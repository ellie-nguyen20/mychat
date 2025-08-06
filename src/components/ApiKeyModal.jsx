import React, { useState } from 'react';
import { X, Key, CheckCircle } from 'lucide-react';
import nebulaApi from '../api/nebulaApi';

const ApiKeyModal = ({ isOpen, onClose, onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Debug log
  console.log('🔍 ApiKeyModal render:', { isOpen, apiKey: apiKey ? 'Has value' : 'Empty' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Submit form with API key:', apiKey ? 'Has value' : 'Empty');
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔑 Testing API key:', apiKey.substring(0, 10) + '...');
      
      // Save API key temporarily for testing
      nebulaApi.setApiKey(apiKey);
      
      // Test connection
      console.log('🌐 Testing API connection...');
      const isConnected = await nebulaApi.testConnection();
      console.log('✅ Connection test result:', isConnected);
      
      if (isConnected) {
        setIsValid(true);
        console.log('🎉 API key is valid!');
        setTimeout(() => {
          onApiKeySet(apiKey);
          onClose();
          setApiKey('');
          setIsValid(false);
        }, 1000);
      } else {
        setError('Invalid API key or cannot connect');
        nebulaApi.clearApiKey();
        console.log('❌ Invalid API key');
      }
    } catch (error) {
      console.error('🚨 Error testing API key:', error);
      setError('An error occurred while checking the API key: ' + error.message);
      nebulaApi.clearApiKey();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) {
    console.log('❌ Modal not open');
    return null;
  }
  
  console.log('✅ Modal is open');

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: 'rgba(26, 26, 26, 0.95)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        position: 'relative',
        boxShadow: 'var(--shadow-heavy)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(10px)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <Key size={24} style={{ color: '#E0E7FF' }} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem', color: '#FFFFFF' }}>
            {isValid ? 'API Key Valid!' : 'Enter Nebula API Key'}
          </h2>
          <p style={{ color: '#E5E7EB', margin: 0 }}>
            {isValid 
              ? 'Connecting...' 
              : 'Please enter your API key to use the chat application'
            }
          </p>
        </div>

        {isValid ? (
          <div style={{ textAlign: 'center', color: 'var(--success-color)' }}>
            <CheckCircle size={48} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#FFFFFF'
              }}>
                API Key:
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  console.log('📝 Input changed:', e.target.value ? 'Has value' : 'Empty');
                  setApiKey(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                placeholder="sk-..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                  background: 'rgba(26, 26, 26, 0.9)',
                  color: '#E0E7FF',
                  backdropFilter: 'blur(5px)'
                }}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div style={{
                background: 'var(--error-bg)',
                color: 'var(--error-color)',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '8px',
                  background: 'rgba(26, 26, 26, 0.9)',
                  color: '#E0E7FF',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.2s'
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '8px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#E0E7FF',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.7 : 1
                }}
                disabled={isLoading || !apiKey.trim()}
              >
                {isLoading ? 'Checking...' : 'Connect'}
              </button>
            </div>
          </form>
        )}

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(45, 45, 45, 0.8)',
          borderRadius: '6px',
          fontSize: '0.9rem',
          color: '#D1D5DB',
          backdropFilter: 'blur(5px)'
        }}>
          <strong>Note:</strong> The API key will be stored locally in your browser and is only used to communicate with the Nebula API.
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal; 