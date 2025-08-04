import { type User, type InsertUser, type EmotionSession, type InsertEmotionSession, type MusicRecommendation, type InsertMusicRecommendation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSpotifyTokens(id: string, accessToken: string, refreshToken: string): Promise<User>;
  
  // Emotion session methods
  createEmotionSession(session: InsertEmotionSession): Promise<EmotionSession>;
  getEmotionSession(id: string): Promise<EmotionSession | undefined>;
  
  // Music recommendation methods
  createMusicRecommendations(recommendations: InsertMusicRecommendation[]): Promise<MusicRecommendation[]>;
  getRecommendationsBySession(sessionId: string): Promise<MusicRecommendation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emotionSessions: Map<string, EmotionSession>;
  private musicRecommendations: Map<string, MusicRecommendation>;

  constructor() {
    this.users = new Map();
    this.emotionSessions = new Map();
    this.musicRecommendations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      spotifyId: null,
      accessToken: null,
      refreshToken: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserSpotifyTokens(id: string, accessToken: string, refreshToken: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = { ...user, accessToken, refreshToken };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createEmotionSession(insertSession: InsertEmotionSession): Promise<EmotionSession> {
    const id = randomUUID();
    const session: EmotionSession = {
      id,
      userId: null,
      detectedEmotion: insertSession.detectedEmotion,
      emotionScores: insertSession.emotionScores || null,
      confidence: insertSession.confidence || null,
      timestamp: new Date()
    };
    this.emotionSessions.set(id, session);
    return session;
  }

  async getEmotionSession(id: string): Promise<EmotionSession | undefined> {
    return this.emotionSessions.get(id);
  }

  async createMusicRecommendations(insertRecommendations: InsertMusicRecommendation[]): Promise<MusicRecommendation[]> {
    const recommendations = insertRecommendations.map(rec => {
      const id = randomUUID();
      const recommendation: MusicRecommendation = { 
        id,
        sessionId: rec.sessionId || null,
        trackId: rec.trackId,
        trackName: rec.trackName,
        artist: rec.artist,
        albumCover: rec.albumCover || null,
        previewUrl: rec.previewUrl || null,
        spotifyUrl: rec.spotifyUrl,
        audioFeatures: rec.audioFeatures || null
      };
      this.musicRecommendations.set(id, recommendation);
      return recommendation;
    });
    return recommendations;
  }

  async getRecommendationsBySession(sessionId: string): Promise<MusicRecommendation[]> {
    return Array.from(this.musicRecommendations.values()).filter(
      rec => rec.sessionId === sessionId
    );
  }
}

export const storage = new MemStorage();
