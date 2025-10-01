import React, { useState } from 'react';
import { Copy, Check, Download, Image as ImageIcon } from 'lucide-react';

const ChatMessage = ({ message, images, isUser }) => {
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

  const handleCopyImage = async (image) => {
    if (!image) return;
    
    try {
      // Convert image to blob and copy to clipboard
      const response = await fetch(URL.createObjectURL(image));
      const blob = await response.blob();
      
      const clipboardItem = new ClipboardItem({
        'image/png': blob
      });
      
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image: ', err);
      // Fallback: download image
      const link = document.createElement('a');
      link.href = URL.createObjectURL(image);
      link.download = 'image.png';
      link.click();
    }
  };

  const handleDownloadImage = (image) => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(image);
    link.download = `image-${Date.now()}.png`;
    link.click();
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
        {images && images.length > 0 && (
          <div style={{ 
            marginBottom: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '500',
              marginBottom: '4px'
            }}>
              {images.length} image(s) attached
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {images.map((image, index) => (
                <div key={index} style={{ 
                  position: 'relative',
                  display: 'inline-block'
                }}>
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Uploaded ${index + 1}`} 
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      objectFit: 'cover'
                    }}
                    onClick={() => handleCopyImage(image)}
                    title="Click to copy image"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    display: 'flex',
                    gap: '4px',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }} className="image-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyImage(image);
                      }}
                      style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        padding: '4px',
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Copy image"
                    >
                      {copied ? <Check size={12} /> : <ImageIcon size={12} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadImage(image);
                      }}
                      style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        padding: '4px',
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Download image"
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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