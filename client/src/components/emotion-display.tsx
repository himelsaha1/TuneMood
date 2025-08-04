import { Card, CardContent } from "@/components/ui/card";
import { getEmotionIcon, getEmotionColor, getEmotionDescription } from "@/lib/emotion-detection";
import type { EmotionType } from "@shared/schema";

interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
  emotionScores: Record<string, number>;
}

interface EmotionDisplayProps {
  emotionResult: EmotionResult | null;
}

export function EmotionDisplay({ emotionResult }: EmotionDisplayProps) {
  if (!emotionResult) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
        <CardContent className="p-8">
          <h2 className="font-poppins font-semibold text-2xl mb-6">Detected Emotion</h2>
          <div className="text-center py-12">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🎭</span>
            </div>
            <p className="text-gray-400">Capture your photo to detect emotion</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { emotion, confidence, emotionScores } = emotionResult;
  const emotionIcon = getEmotionIcon(emotion);
  const emotionColor = getEmotionColor(emotion);
  const emotionDescription = getEmotionDescription(emotion);

  // Sort emotions by score for display
  const sortedEmotions = Object.entries(emotionScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
      <CardContent className="p-8">
        <h2 className="font-poppins font-semibold text-2xl mb-6">Detected Emotion</h2>
        
        <div className="text-center mb-8">
          {/* Emotion visualization */}
          <div className="relative mb-6">
            <div className={`w-32 h-32 bg-gradient-to-br ${emotionColor} rounded-full flex items-center justify-center mx-auto shadow-2xl`}>
              <span className="text-6xl">{emotionIcon}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
              {Math.round(confidence * 100)}% confident
            </div>
          </div>
          
          <h3 className="font-poppins font-bold text-3xl mb-2 capitalize">{emotion}</h3>
          <p className="text-gray-400 mb-6">{emotionDescription}</p>
        </div>

        {/* Emotion Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg mb-4">Emotion Analysis</h4>
          {sortedEmotions.map(([emotionName, score]) => (
            <div key={emotionName} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <span className="text-sm capitalize">{emotionName}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-600 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${getEmotionColor(emotionName as EmotionType)} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${score * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">{Math.round(score * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
