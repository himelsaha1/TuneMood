import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/camera-capture";
import { EmotionDisplay } from "@/components/emotion-display";
import { MusicRecommendations } from "@/components/music-recommendations";
import { MusicPlayer } from "@/components/music-player";
import { Music, User, Heart, Brain, ListMusic } from "lucide-react";
import type { EmotionType } from "@shared/schema";

interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
  emotionScores: Record<string, number>;
}

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

export default function Home() {
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEmotionDetected = (emotionResult: EmotionResult, tracks: MusicTrack[]) => {
    setDetectedEmotion(emotionResult);
    setRecommendations(tracks);
  };

  const handlePlayTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleStopTrack = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-dark via-gray-900 to-spotify-gray">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-spotify-green to-mood-cyan rounded-full flex items-center justify-center">
              <Music className="text-white text-lg" />
            </div>
            <h1 className="font-poppins font-bold text-2xl bg-gradient-to-r from-spotify-green to-mood-cyan bg-clip-text text-transparent">
              Moodify
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-white">
              <ListMusic className="mr-2 h-4 w-4" />
              Connect ListMusic
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-800">
              <User className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fadeIn">
            <div className="inline-block p-1 bg-gradient-to-r from-mood-coral via-mood-blue to-mood-cyan rounded-full mb-6">
              <div className="bg-spotify-gray px-6 py-2 rounded-full">
                <span className="text-sm font-medium bg-gradient-to-r from-mood-coral to-mood-cyan bg-clip-text text-transparent">
                  ✨ AI-Powered Music Discovery
                </span>
              </div>
            </div>
            <h1 className="font-poppins font-bold text-5xl md:text-7xl mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Let Your Mood
              </span>
              <br />
              <span className="bg-gradient-to-r from-spotify-green via-mood-cyan to-mood-coral bg-clip-text text-transparent">
                Drive ListMusic
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Capture your emotion through your camera and discover personalized music recommendations that match your current mood perfectly.
            </p>
          </div>

          {/* Camera and Emotion Detection */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            <div className="animate-slideUp">
              <CameraCapture onEmotionDetected={handleEmotionDetected} />
            </div>
            
            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <EmotionDisplay emotionResult={detectedEmotion} />
            </div>
          </div>

          {/* Music Recommendations */}
          {recommendations.length > 0 && (
            <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <MusicRecommendations 
                recommendations={recommendations}
                currentEmotion={detectedEmotion?.emotion || null}
                onPlayTrack={handlePlayTrack}
                onUpdateRecommendations={setRecommendations}
              />
            </div>
          )}

          {/* Features Section */}
          <section className="mt-32 animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-16">
              <h2 className="font-poppins font-bold text-4xl mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Powered by AI Technology
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Advanced emotion recognition meets intelligent music curation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-mood-coral to-mood-cyan rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="text-2xl text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-4">Real-time Emotion Detection</h3>
                <p className="text-gray-400">Advanced AI analyzes facial expressions to accurately detect your current emotional state</p>
              </div>

              <div className="text-center p-8 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-spotify-green to-mood-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music className="text-2xl text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-4">Personalized Recommendations</h3>
                <p className="text-gray-400">Curated playlists that match your mood using ListMusic's vast music library</p>
              </div>

              <div className="text-center p-8 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-mood-cyan to-mood-coral rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-2xl text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-4">Save to Your Library</h3>
                <p className="text-gray-400">Seamlessly add discovered tracks to your ListMusic playlists and library</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Music Player */}
      {currentTrack && (
        <MusicPlayer 
          track={currentTrack}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={handleStopTrack}
          onNext={() => {
            const currentIndex = recommendations.findIndex(t => t.id === currentTrack.id);
            const nextTrack = recommendations[currentIndex + 1] || recommendations[0];
            if (nextTrack) handlePlayTrack(nextTrack);
          }}
          onPrevious={() => {
            const currentIndex = recommendations.findIndex(t => t.id === currentTrack.id);
            const previousTrack = recommendations[currentIndex - 1] || recommendations[recommendations.length - 1];
            if (previousTrack) handlePlayTrack(previousTrack);
          }}
        />
      )}

      {/* Floating Music Indicator */}
      {isPlaying && (
        <div className="fixed bottom-6 right-6 z-50 bg-spotify-green rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer animate-pulse-slow">
          <Music className="text-white text-xl" />
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-spotify-green to-mood-cyan rounded-full flex items-center justify-center">
                  <Music className="text-white text-lg" />
                </div>
                <h3 className="font-poppins font-bold text-2xl bg-gradient-to-r from-spotify-green to-mood-cyan bg-clip-text text-transparent">
                  Moodify
                </h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Discover music that matches your mood through the power of artificial intelligence and emotion recognition.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Moodify. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
