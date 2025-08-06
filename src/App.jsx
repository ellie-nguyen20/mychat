import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ApiKeyModal from './components/ApiKeyModal';
import ModelInfo from './components/ModelInfo';
import nebulaApi from './api/nebulaApi';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [error, setError] = useState('');
  const [currentModel, setCurrentModel] = useState('qwen2.5-vl-7b');
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

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageData) => {
    const { text, image } = messageData;
    
    if (!text.trim() && !image) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: text || '',
      image: image,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      // Convert image to base64 if present
      let imageUrl = null;
      if (image) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(image);
        });
      }

      // Send message to Nebula API with current model
      const response = await nebulaApi.sendChatMessage(text || '', conversationHistory, imageUrl);
      
      // Add AI response
      const assistantMessage = {
        id: Date.now() + 1,
        content: response.choices?.[0]?.message?.content || 'Sorry, I cannot process your request.',
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
      
      <div className="chat-header">
        <h1>Hello Ellie</h1>
        <div className="header-controls">
          <button
            onClick={handleClearChat}
            className="header-button"
            title="Clear conversation"
          >
            Clear chat
          </button>
          <button
            onClick={handleClearApiKey}
            className="header-button"
            title="Logout"
          >
            Logout
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
            </div>
          </>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.content}
            image={message.image}
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
    </div>
  );
}

export default App; 