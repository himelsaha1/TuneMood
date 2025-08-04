import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Plus, Star, RotateCcw, ExternalLink } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { openSpotifyTrack } from "@/lib/spotify";
import type { EmotionType } from "@shared/schema";

interface MusicTrack {
  id: string;
  trackName: string;
  artist: string;
  albumCover: string;
  previewUrl: string | null;
  spotifyUrl: string;
  audioFeatures?: {
    danceability: number;
    energy: number;
    tempo: number;
    valence: number;
  };
}

interface MusicRecommendationsProps {
  recommendations: MusicTrack[];
  currentEmotion: EmotionType | null;
  onPlayTrack: (track: MusicTrack) => void;
  onUpdateRecommendations: (tracks: MusicTrack[]) => void;
}

export function MusicRecommendations({ 
  recommendations, 
  currentEmotion, 
  onPlayTrack, 
  onUpdateRecommendations 
}: MusicRecommendationsProps) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const refreshRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/fresh-recommendations', {
        emotion: currentEmotion
      });
      return response.json();
    },
    onSuccess: (data) => {
      onUpdateRecommendations(data);
    },
    onError: (error) => {
      console.error('Failed to get fresh recommendations:', error);
    },
  });

  const handlePlayTrack = (track: MusicTrack) => {
    setPlayingTrackId(track.id);
    onPlayTrack(track);
  };

  const handleOpenSpotify = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openSpotifyTrack(url);
  };

  const getRating = (features?: MusicTrack['audioFeatures']) => {
    if (!features) return 4.5;
    const { danceability, energy, valence } = features;
    return Math.round(((danceability + energy + valence) / 3) * 5 * 10) / 10;
  };

  return (
    <section className="mt-20">
      <div className="text-center mb-12">
        <h2 className="font-poppins font-bold text-4xl mb-4">
          <span className="bg-gradient-to-r from-spotify-green to-mood-cyan bg-clip-text text-transparent">
            Music for Your Mood
          </span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Curated recommendations based on your detected emotion and personal taste
        </p>
      </div>

      {/* Recommendation Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {recommendations.map((track) => (
          <Card 
            key={track.id}
            className="group bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            onClick={() => handlePlayTrack(track)}
          >
            <CardContent className="p-6">
              <div className="relative mb-4">
                <img 
                  src={track.albumCover || '/placeholder-album.jpg'} 
                  alt={`${track.trackName} album cover`}
                  className="w-full aspect-square rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                {playingTrackId === track.id && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-2 truncate" title={track.trackName}>
                {track.trackName}
              </h3>
              <p className="text-gray-400 mb-3 truncate" title={track.artist}>
                {track.artist}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 text-sm fill-current" />
                  <span className="text-sm text-gray-400">
                    {getRating(track.audioFeatures)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleOpenSpotify(track.spotifyUrl, e)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement add to library functionality
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="p-2 bg-spotify-green hover:bg-green-600 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTrack(track);
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button 
          onClick={() => refreshRecommendationsMutation.mutate()}
          disabled={refreshRecommendationsMutation.isPending || !currentEmotion}
          variant="outline"
          className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-spotify-green font-medium"
        >
          <RotateCcw className={`mr-2 h-4 w-4 ${refreshRecommendationsMutation.isPending ? 'animate-spin' : ''}`} />
          {refreshRecommendationsMutation.isPending ? 'Loading...' : 'Discover More Music'}
        </Button>
      </div>
    </section>
  );
}
