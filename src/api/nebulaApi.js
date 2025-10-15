import axios from 'axios';

// Configure API base URL and headers for Nebula Block
const API_BASE_URL = 'https://inference.nebulablock.com/v1';

class NebulaApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds timeout for LLM with images
    });

    // Interceptor to add API key to headers
    this.api.interceptors.request.use((config) => {
      const apiKey = localStorage.getItem('nebula_api_key');
      if (apiKey) {
        config.headers.Authorization = `Bearer ${apiKey}`;
        console.log('🔑 Adding API key to request:', apiKey.substring(0, 10) + '...');
      } else {
        console.log('⚠️ No API key in localStorage');
      }
      console.log('📡 Request URL:', config.url);
      console.log('📡 Request method:', config.method);
      return config;
    });

    // Interceptor to log response
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Response status:', response.status);
        console.log('✅ Response data:', response.data);
        return response;
      },
      (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data);
        console.error('❌ Error message:', error.message);
        return Promise.reject(error);
      }
    );
  }

  // Save API key
  setApiKey(apiKey) {
    localStorage.setItem('nebula_api_key', apiKey);
    console.log('💾 Saved API key to localStorage');
  }

  // Get API key
  getApiKey() {
    const apiKey = localStorage.getItem('nebula_api_key');
    console.log('🔍 API key from localStorage:', apiKey ? 'Found' : 'Not found');
    return apiKey;
  }

  // Clear API key
  clearApiKey() {
    localStorage.removeItem('nebula_api_key');
    console.log('🗑️ Cleared API key from localStorage');
  }

  // Send chat message to Nebula API
  async sendChatMessage(message, conversationHistory = [], imageUrls = null) {
    try {
      console.log('💬 Sending message:', message);
      console.log('📚 Conversation history:', conversationHistory.length, 'messages');
      if (imageUrls) {
        console.log('🖼️ Images attached:', Array.isArray(imageUrls) ? imageUrls.length : 1, 'image(s)');
      }
      
      // Also log to server console for debugging
      console.warn('🚀 [SERVER] Starting API request...');

      // Get current model and map to correct format
      const selectedModel = this.getCurrentModel();
      const modelMapping = {
        'deepseek-v3-0324': 'deepseek-ai/DeepSeek-V3-0324',
        'deepseek-r1-0528': 'deepseek-ai/DeepSeek-R1-0528-Free',
        'gpt-4o-mini': 'openai/gpt-4o-mini',
        'gemini-2.5-pro': 'gemini/gemini-2.5-pro',
        'qwen2.5-vl-7b': 'Qwen/Qwen2.5-VL-7B-Instruct'
      };
      
      const actualModel = modelMapping[selectedModel] || 'openai/gpt-4o-mini';
      console.log('🎯 Using model:', actualModel);

      // Check if model supports vision
      const visionModels = ['Qwen/Qwen2.5-VL-7B-Instruct', 'openai/gpt-4o-mini', 'gemini/gemini-2.5-pro'];
      const isVisionModel = visionModels.includes(actualModel);

      // Prepare messages array according to Nebula Block format
      let messages = [
        {
          role: 'system',
          content: 'Hello Ellie. How can I help you?'
        },
        ...conversationHistory
      ];

      // Add user message with images if present
      if (imageUrls && isVisionModel) {
        // Vision model format with multiple images
        const content = [];
        
        // Add all images (limit to 4 images to avoid request size issues)
        const imageArray = Array.isArray(imageUrls) ? imageUrls.slice(0, 4) : [imageUrls];
        console.log(`🖼️ Processing ${imageArray.length} image(s) for vision model`);
        
        imageArray.forEach((imageUrl, index) => {
          try {
            content.push({
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            });
            console.log(`✅ Added image ${index + 1} to content`);
          } catch (err) {
            console.error(`❌ Error adding image ${index + 1}:`, err);
          }
        });
        
        // Add text content
        if (message) {
          content.push({
            type: 'text',
            text: message
          });
        } else {
          content.push({
            type: 'text',
            text: `Please analyze these ${imageArray.length} image(s)`
          });
        }
        
        messages.push({
          role: 'user',
          content: content
        });
        
        console.log(`📝 Created message with ${content.length} content items (${imageArray.length} images + text)`);
      } else {
        // Text-only format
        messages.push({
          role: 'user',
          content: message || ''
        });
      }

      const requestData = {
        messages: messages,
        model: actualModel,
        max_tokens: null, // No token limit
        temperature: 1,
        top_p: 0.9,
        stream: false
      };

      console.log('📤 Request data size:', JSON.stringify(requestData).length, 'characters');

      try {
        const response = await this.api.post('/chat/completions', requestData);
        console.log('📥 Response received:', response.data);
        return response.data;
      } catch (requestError) {
        console.error('🚨 Request failed, trying with single image fallback...');
        
        // If request fails and we have multiple images, try with just the first one
        if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 1) {
          console.log('🔄 Retrying with first image only...');
          
          // Rebuild messages with only first image
          const fallbackMessages = [
            {
              role: 'system',
              content: 'Hello Ellie. How can I help you?'
            },
            ...conversationHistory
          ];
          
          if (isVisionModel) {
            const fallbackContent = [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrls[0]
                }
              },
              {
                type: 'text',
                text: message || `Please analyze this image (${imageUrls.length} images were provided, showing first one only)`
              }
            ];
            
            fallbackMessages.push({
              role: 'user',
              content: fallbackContent
            });
          } else {
            fallbackMessages.push({
              role: 'user',
              content: message || ''
            });
          }
          
          const fallbackRequestData = {
            messages: fallbackMessages,
            model: actualModel,
            max_tokens: null,
            temperature: 1,
            top_p: 0.9,
            stream: false
          };
          
          const fallbackResponse = await this.api.post('/chat/completions', fallbackRequestData);
          console.log('📥 Fallback response received:', fallbackResponse.data);
          return fallbackResponse.data;
        } else {
          throw requestError;
        }
      }
    } catch (error) {
      console.error('🚨 Error sending chat message:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server returned error
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          throw new Error('Invalid API key or expired');
        } else if (status === 403) {
          throw new Error('No permission to access API');
        } else if (status === 429) {
          throw new Error('Too many requests, please try again later');
        } else if (status >= 500) {
          throw new Error('Server error, please try again later');
        } else {
          throw new Error(data?.error || `Error ${status}: ${data?.message || 'Unknown'}`);
        }
      } else if (error.request) {
        // No response received
        throw new Error('Cannot connect to server. Please check your internet connection');
      } else {
        // Other errors
        throw new Error(error.message || 'An error occurred while sending the message');
      }
    }
  }

  // Get available models list
  async getAvailableModels() {
    try {
      console.log('📋 Getting available models...');
      const response = await this.api.get('/models');
      console.log('✅ Models received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting models:', error);
      throw error;
    }
  }

  // Test API connection
  async testConnection() {
    try {
      console.log('🌐 Testing API connection...');
      // Test with a simple chat completion request instead of /models
      const testData = {
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ],
        model: 'openai/gpt-4o-mini',
        max_tokens: 10
      };
      
      const response = await this.api.post('/chat/completions', testData);
      console.log('✅ Connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      // Check if it's just an authentication error vs a real connection error
      if (error.response?.status === 401) {
        console.log('🔑 API key test failed - authentication required');
        return false;
      }
      return false;
    }
  }

  // Get user information
  async getUserInfo() {
    try {
      console.log('👤 Getting user info...');
      const response = await this.api.get('/user');
      console.log('✅ User info received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting user info:', error);
      throw error;
    }
  }

  // Change model
  setModel(modelName) {
    localStorage.setItem('selected_model', modelName);
    console.log('🎯 Changed model:', modelName);
  }

  // Get current model
  getCurrentModel() {
    return localStorage.getItem('selected_model') || 'gemini-2.5-pro'; // Changed default to Gemini 2.5 Pro
  }
}

export default new NebulaApiService(); 