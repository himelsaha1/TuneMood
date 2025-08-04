import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Video, AlertCircle } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useEmotionDetection } from "@/hooks/use-emotion-detection";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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

interface CameraCaptureProps {
  onEmotionDetected: (emotionResult: EmotionResult, tracks: MusicTrack[]) => void;
}

export function CameraCapture({ onEmotionDetected }: CameraCaptureProps) {
  const { videoRef, isActive, error: cameraError, startCamera, stopCamera, captureImage } = useCamera();
  const { detectEmotionFromImage, isDetecting, error: emotionError } = useEmotionDetection();
  const [isCapturing, setIsCapturing] = useState(false);

  const createSessionMutation = useMutation({
    mutationFn: async (data: { detectedEmotion: string; emotionScores: Record<string, number>; confidence: number }) => {
      const response = await apiRequest('POST', '/api/emotion-session', data);
      return response.json();
    },
    onSuccess: (data) => {
      const emotionResult: EmotionResult = {
        emotion: data.session.detectedEmotion as EmotionType,
        confidence: data.session.confidence,
        emotionScores: data.session.emotionScores,
      };
      onEmotionDetected(emotionResult, data.recommendations);
    },
    onError: (error) => {
      console.error('Failed to create emotion session:', error);
    },
  });

  const handleCaptureEmotion = async () => {
    if (!isActive) return;

    setIsCapturing(true);
    try {
      const imageData = await captureImage();
      if (!imageData) {
        throw new Error('Failed to capture image');
      }

      const emotionResult = await detectEmotionFromImage(imageData);
      if (!emotionResult) {
        throw new Error('Failed to detect emotion');
      }

      // Send emotion data to backend to get music recommendations
      createSessionMutation.mutate({
        detectedEmotion: emotionResult.emotion,
        emotionScores: emotionResult.emotionScores,
        confidence: emotionResult.confidence,
      });
    } catch (error) {
      console.error('Error capturing emotion:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const error = cameraError || emotionError;
  const isProcessing = isDetecting || isCapturing || createSessionMutation.isPending;

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="font-poppins font-semibold text-2xl mb-3">Capture Your Mood</h2>
          <p className="text-gray-400">Position yourself in the camera frame and let AI detect your emotion</p>
        </div>
        
        {/* Camera Interface */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video mb-6">
          {isActive ? (
            <>
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Overlay for emotion detection indicators */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">
                    {isProcessing ? 'Processing...' : 'Ready'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-spotify-green to-mood-cyan rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-slow">
                  <Camera className="text-3xl text-white" />
                </div>
                <p className="text-gray-400 mb-4">
                  {error ? error : 'Camera not active'}
                </p>
                {!error && (
                  <Button 
                    onClick={startCamera}
                    className="bg-spotify-green hover:bg-green-600"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Enable Camera
                  </Button>
                )}
                {error && (
                  <div className="flex items-center justify-center text-red-400 text-sm">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Camera access denied or unavailable
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Capture Button */}
        <div className="text-center">
          <Button 
            onClick={handleCaptureEmotion}
            disabled={!isActive || isProcessing}
            className="relative px-8 py-4 bg-gradient-to-r from-mood-coral to-mood-cyan hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            <Camera className="mr-3 h-5 w-5" />
            {isProcessing ? 'Processing...' : 'Capture Emotion'}
          </Button>
          
          {isActive && (
            <Button 
              onClick={stopCamera}
              variant="outline"
              className="ml-4 border-gray-600 hover:border-red-500 hover:text-red-500"
            >
              Stop Camera
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
