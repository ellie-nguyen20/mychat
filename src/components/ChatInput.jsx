import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Image, Upload } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, onOpenSettings }) => {
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!message.trim() && imageFiles.length === 0) || isLoading) return;

    // Create message with images if available
    const messageData = {
      text: message.trim(),
      images: imageFiles
    };

    onSendMessage(messageData);
    setMessage('');
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle paste event for images
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const newFiles = [];
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          newFiles.push(file);
        }
      }
    }
    
    if (newFiles.length > 0) {
      handleImageFiles(newFiles);
      console.log(`📋 ${newFiles.length} image(s) pasted from clipboard`);
    }
  };

  // Handle drag and drop for images
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleImageFiles(files);
      console.log(`🎯 ${files.length} image(s) dropped`);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleImageFiles(files);
    }
  };

  // Process multiple image files
  const handleImageFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        console.warn(`Image ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB), skipping`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      alert('No valid images found. Please ensure images are less than 10MB each.');
      return;
    }

    if (validFiles.length !== files.length) {
      alert(`${files.length - validFiles.length} image(s) were skipped due to size limit (10MB max per image)`);
    }

    // Add to existing files
    setImageFiles(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          id: Date.now() + Math.random(),
          src: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove specific image
  const removeImage = (imageId) => {
    setImagePreviews(prev => {
      const newPreviews = prev.filter(img => img.id !== imageId);
      const removedImage = prev.find(img => img.id === imageId);
      if (removedImage) {
        setImageFiles(prevFiles => prevFiles.filter(file => file !== removedImage.file));
      }
      return newPreviews;
    });
  };

  // Remove all images
  const removeAllImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="input-container">
      <form onSubmit={handleSubmit} className="input-form">
        <div 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            placeholder="How do you feel today? (You can paste multiple images with Ctrl+V or drag & drop)"
            className="input-field"
            disabled={isLoading}
            rows={1}
          />
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '500'
                }}>
                  {imagePreviews.length} image(s) ready to send
                </span>
                <button
                  type="button"
                  onClick={removeAllImages}
                  style={{
                    background: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  title="Remove all images"
                >
                  Clear All
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {imagePreviews.map((image) => (
                  <div key={image.id} style={{
                    position: 'relative',
                    display: 'inline-block',
                    maxWidth: '120px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <img 
                      src={image.src} 
                      alt="Preview" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'rgba(255, 107, 107, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      title="Remove this image"
                    >
                      ×
                    </button>
                    <div style={{
                      fontSize: '0.6rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginTop: '2px',
                      textAlign: 'center',
                      wordBreak: 'break-all'
                    }}>
                      {image.file.name.length > 15 
                        ? image.file.name.substring(0, 15) + '...' 
                        : image.file.name
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="settings-button"
            title="Upload Multiple Images"
          >
            <Upload size={20} />
          </button>
          
          <button
            type="button"
            onClick={onOpenSettings}
            className="settings-button"
            title="Settings"
          >
            <Settings size={20} />
          </button>
          
          <button
            type="submit"
            className="send-button"
            disabled={(!message.trim() && imageFiles.length === 0) || isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 