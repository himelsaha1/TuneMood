import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipForward, SkipBack, Heart, Volume2 } from "lucide-react";
import { formatDuration, openSpotifyTrack } from "@/lib/spotify";

interface MusicTrack {
  id: string;
  trackName: string;
  artist: string;
  albumCover: string;
  previewUrl: string | null;
  spotifyUrl: string;
}

interface MusicPlayerProps {
  track: MusicTrack;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function MusicPlayer({ track, isPlaying, onPlay, onPause, onNext, onPrevious }: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      onPause();
      onNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPause, onNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Main Player */}
      <Card className="fixed bottom-0 left-0 right-0 z-40 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <img 
                src={track.albumCover || '/placeholder-album.jpg'} 
                alt={`${track.trackName} album cover`}
                className="w-16 h-16 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => openSpotifyTrack(track.spotifyUrl)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-lg truncate" title={track.trackName}>
                  {track.trackName}
                </h4>
                <p className="text-gray-400 truncate" title={track.artist}>
                  {track.artist}
                </p>
              </div>
            </div>
            
            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={onPrevious}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  className="p-4 bg-spotify-green hover:bg-green-600 rounded-full"
                  onClick={isPlaying ? onPause : onPlay}
                  disabled={!track.previewUrl}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={onNext}>
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md flex items-center space-x-2">
                <span className="text-xs text-gray-400 w-10">
                  {formatDuration(currentTime * 1000)}
                </span>
                <div 
                  className="flex-1 bg-gray-600 rounded-full h-1 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="bg-spotify-green h-1 rounded-full transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10">
                  {formatDuration(duration * 1000)}
                </span>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? 'text-spotify-green hover:text-green-600' : 'text-gray-400 hover:text-spotify-green'}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden Audio Element */}
      {track.previewUrl && (
        <audio 
          ref={audioRef}
          src={track.previewUrl}
          preload="metadata"
        />
      )}

      {/* No Preview Message */}
      {!track.previewUrl && isPlaying && (
        <div className="fixed bottom-20 right-6 z-50 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">Preview not available</p>
          <Button 
            variant="link" 
            className="text-black hover:text-gray-800 p-0 h-auto"
            onClick={() => openSpotifyTrack(track.spotifyUrl)}
          >
            Listen on Spotify
          </Button>
        </div>
      )}

      <style>
        {`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: var(--spotify-green);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: var(--spotify-green);
          cursor: pointer;
          border: none;
        }
        `}
      </style>
    </>
  );
}
