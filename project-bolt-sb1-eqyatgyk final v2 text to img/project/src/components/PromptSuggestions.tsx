import React, { useState } from 'react';
import { Lightbulb, Palette, Camera, Sparkles, ChevronDown, ChevronUp, Monitor, Briefcase, Users } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

const PROMPT_CATEGORIES = [
  {
    title: 'Professional',
    icon: Briefcase,
    prompts: [
      'Professional headshot of a business executive in modern office, clean background, professional lighting, high quality',
      'Corporate team meeting in modern conference room, professional atmosphere, natural lighting',
      'Modern office workspace with clean desk setup, minimalist design, professional environment',
      'Business presentation scene with professional speaker, modern auditorium, corporate setting',
      'Professional product photography with clean white background, studio lighting, commercial quality',
      'Executive portrait in business attire, confident pose, professional studio lighting'
    ]
  },
  {
    title: 'Creative Arts',
    icon: Palette,
    prompts: [
      'Abstract digital art with vibrant colors and geometric patterns, modern artistic style',
      'Watercolor landscape painting of serene mountain lake, soft brushstrokes, artistic interpretation',
      'Modern minimalist poster design with bold typography and clean composition',
      'Digital illustration of futuristic cityscape with neon lights and cyberpunk aesthetic',
      'Oil painting style portrait with dramatic lighting and rich textures',
      'Contemporary art piece with mixed media elements and bold color palette'
    ]
  },
  {
    title: 'Photography',
    icon: Camera,
    prompts: [
      'Professional product photography with dramatic lighting and clean composition',
      'Architectural photography of modern building with geometric lines and natural lighting',
      'Food photography with appetizing presentation and professional styling',
      'Portrait photography with natural lighting and shallow depth of field',
      'Landscape photography during golden hour with stunning natural scenery',
      'Street photography capturing urban life and authentic moments'
    ]
  },
  {
    title: 'Social Media',
    icon: Users,
    prompts: [
      'Instagram-worthy flat lay composition with lifestyle products and clean aesthetic',
      'YouTube thumbnail design with bold text and eye-catching visuals',
      'Social media post template with modern design and engaging layout',
      'Influencer-style lifestyle photo with trendy background and natural lighting',
      'Brand story visual with professional product placement and lifestyle elements',
      'Social media banner design with brand colors and modern typography'
    ]
  }
];

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategory(expandedCategory === categoryTitle ? null : categoryTitle);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5" />
        Professional Prompts
      </h3>
      <div className="space-y-4">
        {PROMPT_CATEGORIES.map((category) => (
          <div key={category.title}>
            <button
              onClick={() => toggleCategory(category.title)}
              className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-gray-600 hover:border-white/50"
            >
              <div className="flex items-center gap-2">
                <category.icon className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{category.title}</span>
              </div>
              {expandedCategory === category.title ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedCategory === category.title && (
              <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                {category.prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectPrompt(prompt)}
                    className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 border border-gray-600 hover:border-white/50 group"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3 h-3 mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {expandedCategory !== category.title && (
              <div className="mt-2 space-y-2">
                {category.prompts.slice(0, 2).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectPrompt(prompt)}
                    className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 border border-gray-600 hover:border-white/50 group"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3 h-3 mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="line-clamp-2">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Quick start prompts */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <h4 className="text-sm text-gray-300 mb-3 flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Quick Start
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Professional business portrait with clean background',
            'Modern product photography with studio lighting',
            'Corporate office environment with natural lighting'
          ].map((prompt, index) => (
            <button
              key={index}
              onClick={() => onSelectPrompt(prompt)}
              className="text-left p-2 bg-gradient-to-r from-white/20 to-gray-300/20 hover:from-white/30 hover:to-gray-300/30 rounded-lg text-sm text-white transition-all duration-200 border border-white/30 hover:border-white/50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptSuggestions;