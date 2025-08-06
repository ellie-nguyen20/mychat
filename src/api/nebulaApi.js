import axios from 'axios';

// Configure API base URL and headers for Nebula Block
const API_BASE_URL = 'https://dev-llm-proxy.nebulablock.com/v1';

class NebulaApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout for LLM
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
  async sendChatMessage(message, conversationHistory = [], imageUrl = null) {
    try {
      console.log('💬 Sending message:', message);
      console.log('📚 Conversation history:', conversationHistory.length, 'messages');
      if (imageUrl) {
        console.log('🖼️ Image attached:', imageUrl.substring(0, 50) + '...');
      }

      // Get current model and map to correct format
      const selectedModel = this.getCurrentModel();
      const modelMapping = {
        'deepseek-v3-0324': 'deepseek-ai/DeepSeek-V3-0324',
        'deepseek-r1-0528': 'deepseek-ai/DeepSeek-R1-0528',
        'gpt-4o-mini': 'openai/gpt-4o-mini',
        'claude-sonnet-4': 'anthropic/claude-3-5-sonnet-20241022',
        'qwen2.5-vl-7b': 'Qwen/Qwen2.5-VL-7B-Instruct'
      };
      
      const actualModel = modelMapping[selectedModel] || 'openai/gpt-4o-mini';
      console.log('🎯 Using model:', actualModel);

      // Check if model supports vision
      const visionModels = ['Qwen/Qwen2.5-VL-7B-Instruct', 'openai/gpt-4o-mini'];
      const isVisionModel = visionModels.includes(actualModel);

      // Prepare messages array according to Nebula Block format
      let messages = [
        {
          role: 'system',
          content: 'Hello Ellie. How can I help you?'
        },
        ...conversationHistory
      ];

      // Add user message with image if present
      if (imageUrl && isVisionModel) {
        // Vision model format
        messages.push({
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: message || 'What is this image?'
            }
          ]
        });
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

      console.log('📤 Request data:', requestData);

      const response = await this.api.post('/chat/completions', requestData);
      console.log('📥 Response received:', response.data);

      return response.data;
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
      const response = await this.api.get('/models');
      console.log('✅ Connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
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
    return localStorage.getItem('selected_model') || 'qwen2.5-vl-7b'; // Changed default to vision model
  }
}

export default new NebulaApiService(); 