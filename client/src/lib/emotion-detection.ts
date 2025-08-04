import type { EmotionType } from '@shared/schema';

interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
  emotionScores: Record<string, number>;
}

// Simple emotion detection using color analysis and basic heuristics
// In a real application, you would use a more sophisticated ML model like face-api.js
export async function detectEmotion(imageData: ImageData): Promise<EmotionResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple analysis based on overall image brightness and contrast
  const { data, width, height } = imageData;
  let totalBrightness = 0;
  let totalContrast = 0;
  let colorVariance = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate brightness
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    
    // Calculate color variance
    const avg = brightness;
    colorVariance += Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);
  }

  const avgBrightness = totalBrightness / (width * height);
  const avgColorVariance = colorVariance / (width * height * 3);

  // Generate emotion scores based on simple heuristics
  const emotionScores: Record<string, number> = {
    happy: Math.min(0.9, Math.max(0.1, avgBrightness / 255 * 0.8 + Math.random() * 0.2)),
    sad: Math.min(0.9, Math.max(0.1, (255 - avgBrightness) / 255 * 0.6 + Math.random() * 0.2)),
    angry: Math.min(0.9, Math.max(0.05, avgColorVariance / 100 * 0.5 + Math.random() * 0.15)),
    fear: Math.min(0.9, Math.max(0.05, (avgColorVariance > 50 ? 0.3 : 0.1) + Math.random() * 0.15)),
    surprise: Math.min(0.9, Math.max(0.05, Math.random() * 0.3)),
    disgust: Math.min(0.9, Math.max(0.05, Math.random() * 0.2)),
    neutral: Math.min(0.9, Math.max(0.1, 0.3 + Math.random() * 0.2)),
  };

  // Find dominant emotion
  const dominantEmotion = Object.entries(emotionScores).reduce((max, [emotion, score]) => 
    score > max.score ? { emotion: emotion as EmotionType, score } : max
  , { emotion: 'neutral' as EmotionType, score: 0 });

  // Normalize scores to add up to 1
  const totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
  const normalizedScores = Object.fromEntries(
    Object.entries(emotionScores).map(([emotion, score]) => [emotion, score / totalScore])
  );

  return {
    emotion: dominantEmotion.emotion,
    confidence: dominantEmotion.score,
    emotionScores: normalizedScores,
  };
}

export function getEmotionIcon(emotion: EmotionType): string {
  const iconMap = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fear: '😨',
    surprise: '😲',
    disgust: '🤢',
    neutral: '😐',
  };
  return iconMap[emotion] || '😐';
}

export function getEmotionColor(emotion: EmotionType): string {
  const colorMap = {
    happy: 'from-yellow-400 to-orange-500',
    sad: 'from-blue-400 to-blue-600',
    angry: 'from-red-400 to-red-600',
    fear: 'from-purple-400 to-purple-600',
    surprise: 'from-pink-400 to-pink-600',
    disgust: 'from-green-400 to-green-600',
    neutral: 'from-gray-400 to-gray-500',
  };
  return colorMap[emotion] || 'from-gray-400 to-gray-500';
}

export function getEmotionDescription(emotion: EmotionType): string {
  const descriptionMap = {
    happy: "You're radiating positive energy! Perfect for upbeat, energetic music.",
    sad: "Feeling a bit down? Let's find some music to comfort your soul.",
    angry: "Channeling some intense energy! Time for powerful, dynamic tracks.",
    fear: "Feeling uncertain? Soothing melodies might help calm your mind.",
    surprise: "Full of wonder! Let's explore some unexpected musical gems.",
    disgust: "Not in the mood? Perhaps some alternative tracks will resonate.",
    neutral: "In a balanced state. Ready to discover music for any direction.",
  };
  return descriptionMap[emotion] || "Let's find the perfect music for your current state.";
}
