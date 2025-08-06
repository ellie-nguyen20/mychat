import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const ChatMessage = ({ message, image, isUser }) => {
  const [copied, setCopied] = useState(false);

  const formatMessage = (text) => {
    // Convert line breaks to <br>
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? (
          <img 
            src="/image.png" 
            alt="Ellie" 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
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
        )}
      </div>
      <div className="message-content">
        {image && (
          <div style={{ marginBottom: '0.5rem' }}>
            <img 
              src={URL.createObjectURL(image)} 
              alt="Uploaded" 
              style={{
                maxWidth: '300px',
                maxHeight: '200px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
          </div>
        )}
        {message && (
          <div style={{ position: 'relative' }}>
            {formatMessage(message)}
            {!isUser && message && (
              <button
                onClick={handleCopy}
                className="copy-button"
                title="Copy message"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 