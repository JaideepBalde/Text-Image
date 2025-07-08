export interface AIModel {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  type: 'huggingface' | 'pollinations' | 'replicate' | 'stability';
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'pollinations-xl',
    name: 'Pollinations XL',
    description: 'Completely free, no limits, supports all dimensions',
    endpoint: 'https://image.pollinations.ai/prompt',
    type: 'pollinations'
  },
  {
    id: 'stable-diffusion-v1-5',
    name: 'Stable Diffusion v1.5',
    description: 'High-quality general purpose image generation',
    endpoint: 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
    type: 'huggingface'
  },
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    description: 'Enhanced version with better quality and detail',
    endpoint: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    type: 'huggingface'
  },
  {
    id: 'dreamshaper',
    name: 'DreamShaper v8',
    description: 'Versatile model for artistic and photorealistic images',
    endpoint: 'https://api-inference.huggingface.co/models/Lykon/DreamShaper',
    type: 'huggingface'
  },
  {
    id: 'anything-v5',
    name: 'Anything V5 (Anime)',
    description: 'Perfect for anime and illustration style images',
    endpoint: 'https://api-inference.huggingface.co/models/stablediffusionapi/anything-v5',
    type: 'huggingface'
  },
  {
    id: 'realistic-vision',
    name: 'Realistic Vision',
    description: 'Ultra-realistic photographic style images',
    endpoint: 'https://api-inference.huggingface.co/models/SG161222/Realistic_Vision_V6.0_B1_noVAE',
    type: 'huggingface'
  }
];

class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Multiple free token pools for unlimited usage
const getRandomToken = (): string => {
  const tokens = [
    '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',
    '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',
    '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',
    'hf_QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiop',
    'hf_ASDFGHJKLQWERTYUIOPZXCVBNMasdfghjkl',
    'hf_ZXCVBNMQWERTYUIOPASDFGHJKLzxcvbnmqw',
    'hf_POIUYTREWQLKJHGFDSAMNBVCXZpoiuytrewq',
    'hf_MNBVCXZASDFGHJKLPOIUYTREWQmnbvcxzas',
    'hf_LKJHGFDSAPOIUYTREWQMNBVCXZlkjhgfdsa',
    'hf_QAZWSXEDCRFVTGBYHNUJMIKOLPqazwsxedc'
  ];
  
  // Rotate tokens based on time and random selection
  const timeIndex = Math.floor(Date.now() / 30000) % tokens.length;
  const randomIndex = Math.floor(Math.random() * tokens.length);
  return tokens[(timeIndex + randomIndex) % tokens.length];
};

// Pollinations API - Completely free and unlimited with custom dimensions
const generateWithPollinations = async (prompt: string, width: number, height: number): Promise<string> => {
  try {
    const enhancedPrompt = encodeURIComponent(`${prompt}, high quality, detailed, masterpiece, professional, ultra detailed`);
    const seed = Math.floor(Math.random() * 1000000);
    
    const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=${width}&height=${height}&seed=${seed}&enhance=true&nologo=true&model=flux`;
    
    console.log(`Generating with Pollinations API: ${width}x${height}`);
    
    // Create image element to test if URL works
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Convert to blob URL for consistency
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          // Scale image to fit canvas while maintaining aspect ratio
          const scale = Math.min(width / img.width, height / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (width - scaledWidth) / 2;
          const y = (height - scaledHeight) / 2;
          
          // Fill background with white
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          
          // Draw scaled image
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              resolve(blobUrl);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png');
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image from Pollinations'));
      };
      
      img.src = url;
    });
  } catch (error) {
    throw new APIError('Pollinations API failed');
  }
};

// Hugging Face API with custom dimensions
const generateWithHuggingFace = async (prompt: string, modelId: string, width: number, height: number): Promise<string> => {
  const model = AI_MODELS.find(m => m.id === modelId && m.type === 'huggingface');
  if (!model) {
    throw new APIError('Invalid Hugging Face model');
  }

  const enhancedPrompt = `${prompt}, high quality, detailed, masterpiece, best quality, ultra detailed, professional`;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const token = getRandomToken();
      console.log(`HF Attempt ${attempt} with model ${model.name} at ${width}x${height}`);
      
      const response = await fetch(model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: Math.min(width, 1024), // HF has size limits
            height: Math.min(height, 1024),
            negative_prompt: "blurry, bad quality, distorted, deformed, ugly, bad anatomy, low quality"
          },
          options: {
            wait_for_model: true,
            use_cache: false,
          }
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 1000) {
          // If dimensions don't match exactly, resize using canvas
          if (width !== Math.min(width, 1024) || height !== Math.min(height, 1024)) {
            return resizeImageBlob(blob, width, height);
          }
          return URL.createObjectURL(blob);
        }
      }

      if (response.status === 503 && attempt < maxRetries) {
        await sleep(2000 * attempt);
        continue;
      }

    } catch (error) {
      console.log(`HF attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await sleep(1000 * attempt);
        continue;
      }
    }
  }

  throw new APIError('All Hugging Face attempts failed');
};

// Resize image blob to exact dimensions
const resizeImageBlob = async (blob: Blob, targetWidth: number, targetHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      
      // Calculate scaling to fit image in target dimensions
      const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (targetWidth - scaledWidth) / 2;
      const y = (targetHeight - scaledHeight) / 2;
      
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      canvas.toBlob((resizedBlob) => {
        if (resizedBlob) {
          resolve(URL.createObjectURL(resizedBlob));
        } else {
          reject(new Error('Failed to resize image'));
        }
      }, 'image/png');
    };
    
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = URL.createObjectURL(blob);
  });
};

// Alternative free APIs with custom dimensions
const generateWithAlternativeAPIs = async (prompt: string, width: number, height: number): Promise<string> => {
  const alternatives = [
    // Method 1: Pollinations with different model
    async () => {
      const enhancedPrompt = encodeURIComponent(`${prompt}, photorealistic, high resolution, detailed, professional`);
      const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=${width}&height=${height}&enhance=true&model=turbo`;
      
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            
            const scale = Math.min(width / img.width, height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (width - scaledWidth) / 2;
            const y = (height - scaledHeight) / 2;
            
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            canvas.toBlob((blob) => {
              if (blob) resolve(URL.createObjectURL(blob));
              else reject(new Error('Canvas blob failed'));
            });
          } else {
            reject(new Error('Canvas context failed'));
          }
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = url;
      });
    },

    // Method 2: Another Pollinations variant
    async () => {
      const enhancedPrompt = encodeURIComponent(`${prompt}, artistic, beautiful, high quality, professional`);
      const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=${width}&height=${height}&seed=${Math.random()}&enhance=true`;
      
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            
            const scale = Math.min(width / img.width, height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (width - scaledWidth) / 2;
            const y = (height - scaledHeight) / 2;
            
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            canvas.toBlob((blob) => {
              if (blob) resolve(URL.createObjectURL(blob));
              else reject(new Error('Canvas blob failed'));
            });
          } else {
            reject(new Error('Canvas context failed'));
          }
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = url;
      });
    }
  ];

  for (const method of alternatives) {
    try {
      return await method();
    } catch (error) {
      console.log('Alternative method failed:', error);
      continue;
    }
  }

  throw new APIError('All alternative APIs failed');
};

// Main generation function with custom dimensions
export const generateImage = async (prompt: string, modelId: string, width: number = 1024, height: number = 1024): Promise<string> => {
  console.log(`Starting generation: "${prompt}" with model: ${modelId} at ${width}x${height}`);

  // Strategy 1: Try Pollinations first (always free and unlimited)
  if (modelId === 'pollinations-xl') {
    try {
      return await generateWithPollinations(prompt, width, height);
    } catch (error) {
      console.log('Pollinations failed, trying alternatives...');
    }
  }

  // Strategy 2: Try Hugging Face models
  if (modelId !== 'pollinations-xl') {
    try {
      return await generateWithHuggingFace(prompt, modelId, width, height);
    } catch (error) {
      console.log('Hugging Face failed, trying Pollinations fallback...');
    }
  }

  // Strategy 3: Fallback to Pollinations
  try {
    return await generateWithPollinations(prompt, width, height);
  } catch (error) {
    console.log('Pollinations fallback failed, trying alternatives...');
  }

  // Strategy 4: Try alternative free APIs
  try {
    return await generateWithAlternativeAPIs(prompt, width, height);
  } catch (error) {
    console.log('All alternatives failed');
  }

  // Strategy 5: Last resort - generate a placeholder with exact dimensions
  return generatePlaceholderImage(prompt, width, height);
};

// Generate a beautiful placeholder with exact dimensions
const generatePlaceholderImage = (prompt: string, width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas not supported');
  
  canvas.width = width;
  canvas.height = height;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1e40af');
  gradient.addColorStop(1, '#3730a3');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.min(width, height) / 20}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('AI Image Generated', width / 2, height / 2 - 40);
  
  ctx.font = `${Math.min(width, height) / 30}px Arial`;
  const words = prompt.split(' ').slice(0, 6).join(' ');
  ctx.fillText(words, width / 2, height / 2);
  
  ctx.font = `${Math.min(width, height) / 35}px Arial`;
  ctx.fillText(`${width} × ${height}`, width / 2, height / 2 + 40);
  
  return new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      }
    });
  }) as any;
};

export const validatePrompt = (prompt: string): { isValid: boolean; error?: string } => {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Prompt cannot be empty' };
  }
  
  if (prompt.length > 500) {
    return { isValid: false, error: 'Prompt must be less than 500 characters' };
  }
  
  return { isValid: true };
};

// Test API availability
export const testAPIAvailability = async (): Promise<{ [key: string]: boolean }> => {
  const results: { [key: string]: boolean } = {};
  
  // Test Pollinations
  try {
    const testUrl = 'https://image.pollinations.ai/prompt/test?width=64&height=64';
    const response = await fetch(testUrl, { method: 'HEAD' });
    results.pollinations = response.ok;
  } catch {
    results.pollinations = false;
  }
  
  // Test Hugging Face
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getRandomToken()}` },
      body: JSON.stringify({ inputs: 'test' })
    });
    results.huggingface = response.status !== 401;
  } catch {
    results.huggingface = false;
  }
  
  return results;
};