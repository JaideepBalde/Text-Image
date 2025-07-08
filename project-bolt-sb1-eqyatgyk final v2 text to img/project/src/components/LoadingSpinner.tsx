import React from 'react';
import { Sparkles, Palette, Wand2, Monitor } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-8">
        {/* Main spinner */}
        <div className="w-20 h-20 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        
        {/* Inner decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        
        {/* Orbiting icons */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <Palette className="w-4 h-4 text-gray-300 absolute -top-2 left-1/2 transform -translate-x-1/2" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
          <Wand2 className="w-4 h-4 text-white absolute -bottom-2 left-1/2 transform -translate-x-1/2" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s' }}>
          <Monitor className="w-4 h-4 text-gray-300 absolute top-1/2 -left-2 transform -translate-y-1/2" />
        </div>
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold text-white mb-2">Creating your professional image...</h3>
        <p className="text-gray-300 mb-4">AI is crafting your vision with precision</p>
        
        {/* Loading tips */}
        <div className="bg-gray-900/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700">
          <p className="text-sm text-gray-300">
            💡 <strong>Pro Tip:</strong> Detailed prompts create better results!
          </p>
        </div>
      </div>
      
      {/* Animated dots */}
      <div className="mt-6 flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-white to-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 w-64 bg-gray-800/50 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-white to-gray-300 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;