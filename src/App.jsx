import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ApiKeyModal from './components/ApiKeyModal';
import ModelInfo from './components/ModelInfo';
import CurrentModelDisplay from './components/CurrentModelDisplay';
import nebulaApi from './api/nebulaApi';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [error, setError] = useState('');
  const [currentModel, setCurrentModel] = useState('gemini-2.5-pro');
  const messagesEndRef = useRef(null);

  // Check API key when component mounts
  useEffect(() => {
    const apiKey = nebulaApi.getApiKey();
    console.log('🔍 Checking API key:', apiKey ? 'Found' : 'Not found');
    if (apiKey) {
      setHasApiKey(true);
      setShowApiKeyModal(false);
    } else {
      setHasApiKey(false);
      setShowApiKeyModal(true);
    }
  }, []);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_history');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        console.log('📚 Loaded chat history:', parsedMessages.length, 'messages');
      } catch (error) {
        console.error('❌ Error loading chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages));
      console.log('💾 Saved chat history:', messages.length, 'messages');
    }
  }, [messages]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get current model info
  const getCurrentModelInfo = () => {
    const models = [
      {
        id: 'qwen2.5-vl-7b',
        name: 'Qwen2.5-VL-7B',
        fullName: 'Qwen/Qwen2.5-VL-7B-Instruct',
        description: 'Vision Language Model - Excellent image analysis and understanding',
        price: '$0.5/M',
        features: ['Vision model', 'Image analysis', 'Multimodal', '7B parameters']
      },
      {
        id: 'deepseek-v3-0324',
        name: 'DeepSeek V3-0324',
        fullName: 'deepseek-ai/DeepSeek-V3-0324',
        description: '685B parameters - State-of-the-art reasoning, math & coding',
        price: '$1.1/M',
        features: ['Best performance', 'Free version available', '685B parameters']
      },
      {
        id: 'deepseek-r1-0528',
        name: 'DeepSeek R1-0528',
        fullName: 'deepseek-ai/DeepSeek-R1-0528-Free',
        description: 'Latest model - excels in reasoning, math & coding (Free version)',
        price: 'Free',
        features: ['Latest model', 'Free version', 'Advanced reasoning']
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o-mini',
        fullName: 'openai/gpt-4o-mini',
        description: 'OpenAI model with multimodal support',
        price: '$1.6/M',
        features: ['Multimodal', 'OpenAI brand', 'Image analysis']
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        fullName: 'gemini/gemini-2.5-pro',
        description: 'Google Gemini 2.5 Pro - Advanced reasoning and multimodal capabilities',
        price: '$2.0/M',
        features: ['Google model', 'Advanced reasoning', 'Multimodal', 'High performance']
      }
    ];

    return models.find(m => m.id === currentModel) || models[0];
  };

  const handleSendMessage = async (messageData) => {
    const { text, images } = messageData;
    
    if (!text.trim() && (!images || images.length === 0)) return;

    setIsLoading(true);
    setError('');

    try {
      // Convert images to base64 if present (for both display and API)
      let imageUrls = [];
      if (images && images.length > 0) {
        imageUrls = await Promise.all(
          images.map(image => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(image);
          }))
        );
      }

      // Add user message with base64 images (so it can be saved to localStorage)
      const userMessage = {
        id: Date.now(),
        content: text || '',
        images: imageUrls || [], // Store base64 strings instead of File objects
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      // Send message to Nebula API with current model
      const response = await nebulaApi.sendChatMessage(text || '', conversationHistory, imageUrls.length > 0 ? imageUrls : null);
      
      // Add AI response
      let responseContent = response.choices?.[0]?.message?.content || 'Sorry, I cannot process your request.';
      
      // Add note if we had to use fallback for multiple images
      if (images && images.length > 1) {
        responseContent = `[Note: Due to request size limits, I analyzed the first image only. ${images.length} images were provided.]\n\n${responseContent}`;
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        content: responseContent,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'An error occurred while sending the message');
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, an error occurred while processing your message. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySet = (apiKey) => {
    console.log('✅ API key set:', apiKey.substring(0, 10) + '...');
    nebulaApi.setApiKey(apiKey);
    setHasApiKey(true);
    setShowApiKeyModal(false);
  };

  const handleOpenSettings = () => {
    console.log('⚙️ Opening settings modal');
    setShowApiKeyModal(true);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
    localStorage.removeItem('chat_history');
    console.log('🗑️ Chat history cleared');
  };

  const handleClearApiKey = () => {
    console.log('🗑️ Clearing API key');
    nebulaApi.clearApiKey();
    setHasApiKey(false);
    setMessages([]);
    setShowApiKeyModal(true);
  };

  const handleModelChange = (modelId) => {
    setCurrentModel(modelId);
    nebulaApi.setModel(modelId);
    console.log('🎯 Switched to model:', modelId);
  };

  const handleExportChat = () => {
    const chatData = {
      messages: messages,
      exportDate: new Date().toISOString(),
      model: currentModel
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('📤 Chat history exported');
  };

  // Debug log
  console.log('🔍 App state:', { hasApiKey, showApiKeyModal, currentModel });

  if (!hasApiKey) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        {/* Shooting Stars */}
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Hello Ellie
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Please enter your API key to start using the application
          </p>
          <button
            onClick={() => {
              console.log('🔑 Click enter API key');
              setShowApiKeyModal(true);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Enter API Key
          </button>
        </div>

        {/* Always show modal when no API key */}
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          onApiKeySet={handleApiKeySet}
        />
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Shooting Stars */}
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      
      <div className="chat-header">
        <h1>Hello Ellie</h1>
        <div className="header-controls">
          <button
            onClick={handleExportChat}
            className="header-button"
            title="Export chat history"
            disabled={messages.length === 0}
          >
            Export
          </button>
          <button
            onClick={handleClearChat}
            className="header-button"
            title="Clear conversation"
          >
            Clear chat
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <>
            <ModelInfo 
              currentModel={currentModel}
              onModelChange={handleModelChange}
            />
            <div className="welcome-message">
              <h3>Hello Ellie. How can I help you?</h3>
              <p>Start a conversation by typing a message below.</p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem' }}>
                💾 Your chat history will be automatically saved
              </p>
            </div>
          </>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.content}
            images={message.images}
            isUser={message.isUser}
          />
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">
              <img 
                src="/_.png" 
                alt="AI Assistant" 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div className="message-content">
              <div className="loading">
                <div className="spinner"></div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onOpenSettings={handleOpenSettings}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onApiKeySet={handleApiKeySet}
      />

      {/* Current Model Display */}
      <CurrentModelDisplay 
        currentModel={currentModel}
        modelInfo={getCurrentModelInfo()}
        onModelChange={handleModelChange}
      />
    </div>
  );
}

export default App; 