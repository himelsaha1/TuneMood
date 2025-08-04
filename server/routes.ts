import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmotionSessionSchema, insertMusicRecommendationSchema, type EmotionType } from "@shared/schema";
import { z } from "zod";

// Spotify API setup
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "441dc6182d234d05993cd770118ca859";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "f9979f2b5e9648609b7fccf0c99314f8";

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

interface SpotifyAudioFeatures {
  danceability: number;
  energy: number;
  tempo: number;
  valence: number;
}

async function getSpotifyToken(): Promise<string> {
  const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const data: SpotifyToken = await response.json();
  return data.access_token;
}

function getEmotionToSpotifyParams(emotion: EmotionType): {
  seed_genres: string;
  target_danceability: number;
  target_energy: number;
  target_valence: number;
  target_tempo?: number;
} {
  const emotionMap = {
    happy: {
      seed_genres: 'pop,dance,funk',
      target_danceability: 0.8,
      target_energy: 0.8,
      target_valence: 0.8,
    },
    sad: {
      seed_genres: 'acoustic,indie,folk',
      target_danceability: 0.3,
      target_energy: 0.3,
      target_valence: 0.2,
    },
    angry: {
      seed_genres: 'rock,metal,punk',
      target_danceability: 0.6,
      target_energy: 0.9,
      target_valence: 0.3,
    },
    fear: {
      seed_genres: 'ambient,classical,electronic',
      target_danceability: 0.2,
      target_energy: 0.4,
      target_valence: 0.3,
    },
    surprise: {
      seed_genres: 'electronic,experimental,jazz',
      target_danceability: 0.6,
      target_energy: 0.7,
      target_valence: 0.6,
    },
    disgust: {
      seed_genres: 'alternative,grunge,indie',
      target_danceability: 0.4,
      target_energy: 0.5,
      target_valence: 0.3,
    },
    neutral: {
      seed_genres: 'indie,alternative,pop',
      target_danceability: 0.5,
      target_energy: 0.5,
      target_valence: 0.5,
    },
  };

  return emotionMap[emotion] || emotionMap.neutral;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create emotion session and get music recommendations
  app.post("/api/emotion-session", async (req, res) => {
    try {
      const validatedData = insertEmotionSessionSchema.parse(req.body);
      
      // Create emotion session
      const session = await storage.createEmotionSession(validatedData);
      
      // Get Spotify recommendations based on emotion
      const token = await getSpotifyToken();
      const emotionParams = getEmotionToSpotifyParams(validatedData.detectedEmotion as EmotionType);
      
      const spotifyUrl = new URL('https://api.spotify.com/v1/recommendations');
      spotifyUrl.searchParams.append('limit', '8');
      spotifyUrl.searchParams.append('market', 'US');
      spotifyUrl.searchParams.append('seed_genres', emotionParams.seed_genres);
      spotifyUrl.searchParams.append('target_danceability', emotionParams.target_danceability.toString());
      spotifyUrl.searchParams.append('target_energy', emotionParams.target_energy.toString());
      spotifyUrl.searchParams.append('target_valence', emotionParams.target_valence.toString());

      const spotifyResponse = await fetch(spotifyUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!spotifyResponse.ok) {
        throw new Error('Failed to get Spotify recommendations');
      }

      const spotifyData: SpotifyRecommendationsResponse = await spotifyResponse.json();
      
      // Create music recommendations
      const recommendations = spotifyData.tracks.map(track => ({
        sessionId: session.id,
        trackId: track.id,
        trackName: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        albumCover: track.album.images[0]?.url || '',
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        audioFeatures: {
          danceability: emotionParams.target_danceability,
          energy: emotionParams.target_energy,
          tempo: 120, // Default tempo
          valence: emotionParams.target_valence,
        },
      }));

      const savedRecommendations = await storage.createMusicRecommendations(recommendations);
      
      res.json({
        session,
        recommendations: savedRecommendations,
      });
    } catch (error) {
      console.error('Error creating emotion session:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to create emotion session' 
      });
    }
  });

  // Get recommendations for a session
  app.get("/api/session/:sessionId/recommendations", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const recommendations = await storage.getRecommendationsBySession(sessionId);
      res.json(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ 
        message: 'Failed to get recommendations' 
      });
    }
  });

  // Get fresh recommendations for a specific emotion
  app.post("/api/fresh-recommendations", async (req, res) => {
    try {
      const { emotion } = z.object({ emotion: z.string() }).parse(req.body);
      
      const token = await getSpotifyToken();
      const emotionParams = getEmotionToSpotifyParams(emotion as EmotionType);
      
      // Add some randomness to get different results
      const randomOffset = Math.floor(Math.random() * 100);
      
      const spotifyUrl = new URL('https://api.spotify.com/v1/recommendations');
      spotifyUrl.searchParams.append('limit', '8');
      spotifyUrl.searchParams.append('market', 'US');
      spotifyUrl.searchParams.append('seed_genres', emotionParams.seed_genres);
      spotifyUrl.searchParams.append('target_danceability', (emotionParams.target_danceability + (Math.random() * 0.2 - 0.1)).toString());
      spotifyUrl.searchParams.append('target_energy', (emotionParams.target_energy + (Math.random() * 0.2 - 0.1)).toString());
      spotifyUrl.searchParams.append('target_valence', (emotionParams.target_valence + (Math.random() * 0.2 - 0.1)).toString());

      const spotifyResponse = await fetch(spotifyUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!spotifyResponse.ok) {
        throw new Error('Failed to get fresh Spotify recommendations');
      }

      const spotifyData: SpotifyRecommendationsResponse = await spotifyResponse.json();
      
      const recommendations = spotifyData.tracks.map(track => ({
        id: track.id,
        trackId: track.id,
        trackName: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        albumCover: track.album.images[0]?.url || '',
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        audioFeatures: {
          danceability: emotionParams.target_danceability,
          energy: emotionParams.target_energy,
          tempo: 120,
          valence: emotionParams.target_valence,
        },
      }));

      res.json(recommendations);
    } catch (error) {
      console.error('Error getting fresh recommendations:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to get fresh recommendations' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
