import React, { useState, useCallback, useEffect } from 'react';
import { Download, Sparkles, Wand2, RefreshCw, Copy, Heart, Share2, AlertCircle, CheckCircle, Zap, Settings, Monitor, Smartphone, Tablet, Tv, Camera, Image, Grid3X3 } from 'lucide-react';
import { generateImage, AI_MODELS, validatePrompt, testAPIAvailability } from '../utils/imageApis';
import LoadingSpinner from './LoadingSpinner';
import PromptSuggestions from './PromptSuggestions';

interface GeneratedImage {
  url: string;
  prompt: string;
  model: string;
  timestamp: number;
  dimensions: string;
}

interface ImageDimensions {
  width: number;
  height: number;
  label: string;
  icon: React.ComponentType<any>;
  category: string;
  description: string;
}

const IMAGE_DIMENSIONS: ImageDimensions[] = [
  // Mobile Screens
  { width: 360, height: 640, label: 'Mobile Small', icon: Smartphone, category: 'Mobile', description: 'Small mobile phones' },
  { width: 375, height: 667, label: 'iPhone SE/8', icon: Smartphone, category: 'Mobile', description: 'iPhone SE, 6, 7, 8' },
  { width: 390, height: 844, label: 'iPhone 12/13', icon: Smartphone, category: 'Mobile', description: 'iPhone 12, 13, 14' },
  { width: 393, height: 852, label: 'iPhone 14 Pro', icon: Smartphone, category: 'Mobile', description: 'iPhone 14/15 Pro' },
  { width: 414, height: 896, label: 'iPhone 11/XR', icon: Smartphone, category: 'Mobile', description: 'iPhone 11, XR, XS Max' },
  { width: 428, height: 926, label: 'iPhone 14 Plus', icon: Smartphone, category: 'Mobile', description: 'iPhone 14/15 Plus' },
  { width: 360, height: 800, label: 'Android Standard', icon: Smartphone, category: 'Mobile', description: 'Standard Android phones' },
  { width: 412, height: 915, label: 'Pixel 6/7', icon: Smartphone, category: 'Mobile', description: 'Google Pixel 6, 7' },
  
  // Tablet Screens
  { width: 768, height: 1024, label: 'iPad Portrait', icon: Tablet, category: 'Tablet', description: 'iPad 9.7" Portrait' },
  { width: 1024, height: 768, label: 'iPad Landscape', icon: Tablet, category: 'Tablet', description: 'iPad 9.7" Landscape' },
  { width: 820, height: 1180, label: 'iPad Air Portrait', icon: Tablet, category: 'Tablet', description: 'iPad Air 10.9" Portrait' },
  { width: 1180, height: 820, label: 'iPad Air Landscape', icon: Tablet, category: 'Tablet', description: 'iPad Air 10.9" Landscape' },
  { width: 834, height: 1194, label: 'iPad Pro 11" Portrait', icon: Tablet, category: 'Tablet', description: 'iPad Pro 11" Portrait' },
  { width: 1194, height: 834, label: 'iPad Pro 11" Landscape', icon: Tablet, category: 'Tablet', description: 'iPad Pro 11" Landscape' },
  { width: 1024, height: 1366, label: 'iPad Pro 12.9" Portrait', icon: Tablet, category: 'Tablet', description: 'iPad Pro 12.9" Portrait' },
  { width: 1366, height: 1024, label: 'iPad Pro 12.9" Landscape', icon: Tablet, category: 'Tablet', description: 'iPad Pro 12.9" Landscape' },
  { width: 800, height: 1280, label: 'Android Tablet Portrait', icon: Tablet, category: 'Tablet', description: 'Standard Android tablet' },
  { width: 1280, height: 800, label: 'Android Tablet Landscape', icon: Tablet, category: 'Tablet', description: 'Standard Android tablet' },
  
  // Laptop/Desktop Screens
  { width: 1366, height: 768, label: 'Laptop HD', icon: Monitor, category: 'Desktop', description: 'Standard laptop screen' },
  { width: 1440, height: 900, label: 'MacBook Air 13"', icon: Monitor, category: 'Desktop', description: 'MacBook Air 13" (2017-2020)' },
  { width: 1536, height: 864, label: 'Laptop FHD+', icon: Monitor, category: 'Desktop', description: 'High-res laptop' },
  { width: 1600, height: 900, label: 'Desktop HD+', icon: Monitor, category: 'Desktop', description: 'Desktop HD+ monitor' },
  { width: 1680, height: 1050, label: 'Desktop WSXGA+', icon: Monitor, category: 'Desktop', description: 'Widescreen desktop' },
  { width: 1920, height: 1080, label: 'Full HD Desktop', icon: Monitor, category: 'Desktop', description: 'Standard Full HD monitor' },
  { width: 1920, height: 1200, label: 'Desktop WUXGA', icon: Monitor, category: 'Desktop', description: 'Widescreen desktop' },
  { width: 2560, height: 1440, label: '1440p Monitor', icon: Monitor, category: 'Desktop', description: 'QHD/2K monitor' },
  { width: 2560, height: 1600, label: 'MacBook Pro 13"', icon: Monitor, category: 'Desktop', description: 'MacBook Pro 13" Retina' },
  { width: 3008, height: 1692, label: 'MacBook Pro 14"', icon: Monitor, category: 'Desktop', description: 'MacBook Pro 14" (2021+)' },
  { width: 3456, height: 2234, label: 'MacBook Pro 16"', icon: Monitor, category: 'Desktop', description: 'MacBook Pro 16" (2021+)' },
  { width: 3840, height: 2160, label: '4K Monitor', icon: Monitor, category: 'Desktop', description: 'Ultra HD 4K monitor' },
  
  // TV/Large Displays
  { width: 1920, height: 1080, label: 'Full HD TV', icon: Tv, category: 'TV', description: '1080p television' },
  { width: 2560, height: 1440, label: '1440p TV', icon: Tv, category: 'TV', description: 'QHD television' },
  { width: 3840, height: 2160, label: '4K TV', icon: Tv, category: 'TV', description: 'Ultra HD 4K TV' },
  { width: 7680, height: 4320, label: '8K TV', icon: Tv, category: 'TV', description: 'Ultra HD 8K TV' },
  { width: 5120, height: 2880, label: '5K Display', icon: Tv, category: 'TV', description: 'Apple Studio Display' },
  { width: 6016, height: 3384, label: 'Pro Display XDR', icon: Tv, category: 'TV', description: 'Apple Pro Display XDR' },
  
  // Social Media Optimized
  { width: 1080, height: 1080, label: 'Instagram Square', icon: Grid3X3, category: 'Social', description: 'Instagram post' },
  { width: 1080, height: 1350, label: 'Instagram Portrait', icon: Image, category: 'Social', description: 'Instagram portrait post' },
  { width: 1080, height: 1920, label: 'Instagram Story', icon: Smartphone, category: 'Social', description: 'Instagram/TikTok story' },
  { width: 1200, height: 630, label: 'Facebook Cover', icon: Monitor, category: 'Social', description: 'Facebook cover photo' },
  { width: 1920, height: 1080, label: 'YouTube Thumbnail', icon: Camera, category: 'Social', description: 'YouTube video thumbnail' },
  { width: 1500, height: 500, label: 'Twitter Header', icon: Monitor, category: 'Social', description: 'Twitter/X header' },
  { width: 1128, height: 191, label: 'LinkedIn Banner', icon: Monitor, category: 'Social', description: 'LinkedIn profile banner' },
  { width: 1080, height: 566, label: 'LinkedIn Post', icon: Image, category: 'Social', description: 'LinkedIn post image' },
  
  // Print & Professional
  { width: 2480, height: 3508, label: 'A4 Portrait', icon: Image, category: 'Print', description: 'A4 print portrait (300 DPI)' },
  { width: 3508, height: 2480, label: 'A4 Landscape', icon: Image, category: 'Print', description: 'A4 print landscape (300 DPI)' },
  { width: 3508, height: 4961, label: 'A3 Portrait', icon: Image, category: 'Print', description: 'A3 print portrait (300 DPI)' },
  { width: 4961, height: 3508, label: 'A3 Landscape', icon: Image, category: 'Print', description: 'A3 print landscape (300 DPI)' },
  { width: 1800, height: 1200, label: 'Web Banner', icon: Monitor, category: 'Print', description: 'Website banner' },
  { width: 2400, height: 1600, label: 'High-Res Web', icon: Monitor, category: 'Print', description: 'High-resolution web image' },
  
  // Square Formats
  { width: 512, height: 512, label: 'Square 512', icon: Grid3X3, category: 'Square', description: 'Small square format' },
  { width: 768, height: 768, label: 'Square 768', icon: Grid3X3, category: 'Square', description: 'Medium square format' },
  { width: 1024, height: 1024, label: 'Square 1024', icon: Grid3X3, category: 'Square', description: 'Large square format' },
  { width: 1536, height: 1536, label: 'Square 1536', icon: Grid3X3, category: 'Square', description: 'XL square format' },
  { width: 2048, height: 2048, label: 'Square 2048', icon: Grid3X3, category: 'Square', description: 'XXL square format' },
];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('pollinations-xl');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState<{ [key: string]: boolean }>({});
  const [generationCount, setGenerationCount] = useState(0);
  const [selectedDimensions, setSelectedDimensions] = useState(IMAGE_DIMENSIONS.find(d => d.label === 'Full HD Desktop') || IMAGE_DIMENSIONS[0]);
  const [showDimensionsPanel, setShowDimensionsPanel] = useState(false);
  const [searchDimensions, setSearchDimensions] = useState('');

  // Test API availability on component mount
  useEffect(() => {
    const checkAPIs = async () => {
      try {
        const status = await testAPIAvailability();
        setApiStatus(status);
      } catch (error) {
        console.log('API status check failed:', error);
      }
    };
    
    checkAPIs();
  }, []);

  const handleGenerate = useCallback(async () => {
    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid prompt');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);
    setProgress(0);

    // Simulate realistic progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 95);
      });
    }, 800);

    try {
      console.log('🎨 Starting AI image generation...');
      const startTime = Date.now();
      
      const imageUrl = await generateImage(prompt, selectedModel, selectedDimensions.width, selectedDimensions.height);
      
      const generationTime = Date.now() - startTime;
      console.log(`✅ Image generated in ${generationTime}ms`);
      
      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt,
        model: selectedModel,
        timestamp: Date.now(),
        dimensions: `${selectedDimensions.width}x${selectedDimensions.height}`
      };
      
      setGeneratedImage(newImage);
      setHistory(prev => [newImage, ...prev.slice(0, 19)]); // Keep last 20 images
      setProgress(100);
      setGenerationCount(prev => prev + 1);
      
      // Clear progress after success animation
      setTimeout(() => setProgress(0), 2000);
      
    } catch (err) {
      console.error('❌ Generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Generation failed - trying backup methods...';
      setError(errorMessage);
      setProgress(0);
      
      // Auto-retry with different model after 3 seconds
      setTimeout(() => {
        if (selectedModel !== 'pollinations-xl') {
          setSelectedModel('pollinations-xl');
          setError('Switched to backup model - click Generate again');
        }
      }, 3000);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, selectedDimensions]);

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-image-${selectedDimensions.label.replace(/\s+/g, '-')}-${generatedImage.dimensions}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open image in new tab
      window.open(generatedImage.url, '_blank');
    }
  };

  const handleCopyPrompt = () => {
    if (generatedImage) {
      navigator.clipboard.writeText(generatedImage.prompt);
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Image',
          text: `Generated with prompt: "${generatedImage.prompt}"`,
          url: window.location.href
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const selectedModelInfo = AI_MODELS.find(m => m.id === selectedModel);

  const groupedDimensions = IMAGE_DIMENSIONS.reduce((acc, dim) => {
    if (!acc[dim.category]) acc[dim.category] = [];
    acc[dim.category].push(dim);
    return acc;
  }, {} as Record<string, ImageDimensions[]>);

  const filteredDimensions = searchDimensions
    ? IMAGE_DIMENSIONS.filter(dim => 
        dim.label.toLowerCase().includes(searchDimensions.toLowerCase()) ||
        dim.description.toLowerCase().includes(searchDimensions.toLowerCase()) ||
        dim.category.toLowerCase().includes(searchDimensions.toLowerCase())
      )
    : IMAGE_DIMENSIONS;

  const filteredGroupedDimensions = filteredDimensions.reduce((acc, dim) => {
    if (!acc[dim.category]) acc[dim.category] = [];
    acc[dim.category].push(dim);
    return acc;
  }, {} as Record<string, ImageDimensions[]>);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-white to-gray-300 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI Studio Pro
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Professional AI Image Generation • Every Screen Size • Unlimited
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Generated: {generationCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
              <selectedDimensions.icon className="w-4 h-4 text-white" />
              <span>{selectedDimensions.label}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* API Status */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 shadow-xl">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                System Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Primary Engine</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Backup Systems</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${apiStatus.huggingface ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <span className={apiStatus.huggingface ? 'text-green-400' : 'text-yellow-400'}>
                      {apiStatus.huggingface ? 'Ready' : 'Standby'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions Selection */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-white font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Screen Dimensions
                </label>
                <button
                  onClick={() => setShowDimensionsPanel(!showDimensionsPanel)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-600">
                  <selectedDimensions.icon className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white font-medium">{selectedDimensions.label}</p>
                    <p className="text-gray-400 text-sm">{selectedDimensions.width} × {selectedDimensions.height}</p>
                    <p className="text-gray-500 text-xs">{selectedDimensions.description}</p>
                  </div>
                </div>
              </div>

              {showDimensionsPanel && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search dimensions (e.g., iPhone, 4K, Instagram)..."
                    value={searchDimensions}
                    onChange={(e) => setSearchDimensions(e.target.value)}
                    className="w-full bg-gray-800/50 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-white focus:outline-none text-sm"
                  />
                  
                  {Object.entries(filteredGroupedDimensions).map(([category, dimensions]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        {category === 'Mobile' && <Smartphone className="w-4 h-4" />}
                        {category === 'Tablet' && <Tablet className="w-4 h-4" />}
                        {category === 'Desktop' && <Monitor className="w-4 h-4" />}
                        {category === 'TV' && <Tv className="w-4 h-4" />}
                        {category === 'Social' && <Camera className="w-4 h-4" />}
                        {category === 'Print' && <Image className="w-4 h-4" />}
                        {category === 'Square' && <Grid3X3 className="w-4 h-4" />}
                        {category} ({dimensions.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {dimensions.map((dim) => (
                          <button
                            key={`${dim.width}x${dim.height}`}
                            onClick={() => {
                              setSelectedDimensions(dim);
                              setShowDimensionsPanel(false);
                              setSearchDimensions('');
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                              selectedDimensions.width === dim.width && selectedDimensions.height === dim.height
                                ? 'bg-white/20 border-white/50 text-white'
                                : 'bg-gray-800/30 hover:bg-gray-700/50 border-gray-600 text-gray-300 hover:text-white'
                            } border`}
                          >
                            <dim.icon className="w-4 h-4" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{dim.label}</p>
                              <p className="text-xs opacity-70">{dim.width} × {dim.height}</p>
                              <p className="text-xs opacity-60">{dim.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Model Selection */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                disabled={isGenerating}
              >
                {AI_MODELS.map((model) => (
                  <option key={model.id} value={model.id} className="bg-gray-800 text-white">
                    {model.name} {model.id === 'pollinations-xl' ? '⚡ (Recommended)' : ''}
                  </option>
                ))}
              </select>
              {selectedModelInfo && (
                <p className="text-sm text-gray-300 mt-2">{selectedModelInfo.description}</p>
              )}
            </div>

            {/* Prompt Input */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
              <label className="block text-white font-semibold mb-3">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A professional headshot of a business person in modern office, high quality, detailed, professional lighting..."
                className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[120px] resize-none transition-all placeholder-gray-400"
                disabled={isGenerating}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-300">
                  {prompt.length}/500 characters
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-gradient-to-r from-white to-gray-300 text-black px-6 py-3 rounded-xl font-semibold hover:from-gray-100 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
              
              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-4">
                  <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-white to-gray-300 h-full transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-300 mt-2 text-center">
                    {progress < 20 ? '🚀 Initializing AI models...' : 
                     progress < 50 ? '🎨 Processing your prompt...' : 
                     progress < 80 ? '✨ Generating masterpiece...' : 
                     progress < 95 ? '🎯 Adding final touches...' : '✅ Almost ready!'}
                  </p>
                </div>
              )}
            </div>

            {/* Prompt Suggestions */}
            <PromptSuggestions onSelectPrompt={setPrompt} />
          </div>

          {/* Right Panel - Generated Image */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 min-h-[600px] flex flex-col shadow-xl">
              <div className="flex-1 flex items-center justify-center">
                {isGenerating ? (
                  <LoadingSpinner />
                ) : generatedImage ? (
                  <div className="w-full text-center">
                    <div className="relative inline-block group">
                      <img
                        src={generatedImage.url}
                        alt={generatedImage.prompt}
                        className="max-w-full max-h-96 rounded-xl shadow-2xl transition-transform group-hover:scale-105 border border-gray-600"
                        onError={() => setError('Failed to load generated image')}
                      />
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={handleCopyPrompt}
                          className="p-2 bg-black/70 backdrop-blur-sm rounded-lg text-white hover:bg-black/90 transition-colors border border-gray-600"
                          title="Copy prompt"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleShare}
                          className="p-2 bg-black/70 backdrop-blur-sm rounded-lg text-white hover:bg-black/90 transition-colors border border-gray-600"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 text-left border border-gray-600">
                        <p className="text-sm text-gray-300 mb-1">Prompt:</p>
                        <p className="text-white">{generatedImage.prompt}</p>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                          <span>Model: {AI_MODELS.find(m => m.id === generatedImage.model)?.name}</span>
                          <span>Size: {generatedImage.dimensions}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={handleDownload}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Download className="w-5 h-5" />
                          Download
                        </button>
                        <button
                          onClick={() => setPrompt(generatedImage.prompt)}
                          className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Generate Again
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="mb-6">
                      <Sparkles className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-2xl font-bold mb-2 text-white">Professional AI Image Generation</p>
                      <p className="text-lg">Create stunning images for every screen size</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                        <Smartphone className="w-8 h-8 mx-auto mb-2 text-white" />
                        <p className="font-semibold text-white">Mobile</p>
                        <p className="text-gray-400">All phone sizes</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                        <Tablet className="w-8 h-8 mx-auto mb-2 text-white" />
                        <p className="font-semibold text-white">Tablet</p>
                        <p className="text-gray-400">iPad & Android</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                        <Monitor className="w-8 h-8 mx-auto mb-2 text-white" />
                        <p className="font-semibold text-white">Desktop</p>
                        <p className="text-gray-400">All monitors</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                        <Tv className="w-8 h-8 mx-auto mb-2 text-white" />
                        <p className="font-semibold text-white">TV & 8K</p>
                        <p className="text-gray-400">Ultra HD displays</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-xl text-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Notice</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Recent Creations ({history.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {history.map((image, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 hover:border-white/50 transition-all cursor-pointer group shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => setGeneratedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-24 object-cover rounded-lg border border-gray-600"
                  />
                  <p className="text-xs text-gray-300 mt-2 truncate group-hover:text-white transition-colors">
                    {image.prompt}
                  </p>
                  <p className="text-xs text-gray-500">
                    {image.dimensions}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p className="text-sm">
            Professional AI Image Generation • Every Screen Size • Unlimited • 100% Free
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;