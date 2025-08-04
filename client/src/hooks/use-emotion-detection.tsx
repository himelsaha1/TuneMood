import { useState, useCallback } from 'react';
import { detectEmotion } from '@/lib/emotion-detection';
import type { EmotionType } from '@shared/schema';

interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
  emotionScores: Record<string, number>;
}

export function useEmotionDetection() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectEmotionFromImage = useCallback(async (imageData: ImageData): Promise<EmotionResult | null> => {
    setIsDetecting(true);
    setError(null);

    try {
      const result = await detectEmotion(imageData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect emotion';
      setError(errorMessage);
      console.error('Emotion detection error:', err);
      return null;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return {
    detectEmotionFromImage,
    isDetecting,
    error,
  };
}
