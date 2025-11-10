import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Eye, DollarSign, ChevronDown, Check } from 'lucide-react';

const CurrentModelDisplay = ({ currentModel, modelInfo, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  if (!modelInfo) return null;

  const getModelIcon = (modelId) => {
    if (modelId.includes('qwen') || modelId.includes('vl')) return <Eye size={16} />;
    if (modelId.includes('deepseek')) return <Zap size={16} />;
    if (modelId.includes('gemini')) return <Brain size={16} />;
    if (modelId.includes('gpt')) return <Brain size={16} />;
    return <Brain size={16} />;
  };

  const getModelColor = (modelId) => {
    if (modelId.includes('qwen')) return '#10a37f';
    if (modelId.includes('deepseek')) return '#8b5cf6';
    if (modelId.includes('gemini')) return '#4285f4';
    if (modelId.includes('gpt')) return '#00a67e';
    return '#E0E7FF';
  };

  const modelColor = getModelColor(currentModel);

  // Available models list
  const availableModels = [
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
      fullName: 'deepseek-ai/DeepSeek-R1-0528',
      description: 'Latest model - excels in reasoning, math & coding',
      price: 'Free',
      features: ['Latest model', 'Advanced reasoning', 'Long context']
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

  const handleModelSelect = (modelId) => {
    console.log('🔍 Model selected:', modelId);
    if (onModelChange) {
      onModelChange(modelId);
    }
    setIsOpen(false);
    console.log('✅ Model selection completed');
  };

  console.log('🔍 CurrentModelDisplay render, isOpen:', isOpen, 'currentModel:', currentModel, 'onModelChange:', !!onModelChange);
  
  return (
    <div 
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: isOpen ? '280px' : '200px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: isOpen ? '16px' : '10px 12px',
        border: `1px solid ${modelColor}40`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${modelColor}20`,
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        cursor: 'pointer'
      }} 
      onClick={() => {
        console.log('🔍 Current Model clicked, isOpen:', isOpen);
        setIsOpen(!isOpen);
        console.log('🔍 After setState, new isOpen will be:', !isOpen);
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'space-between' : 'center',
        marginBottom: isOpen ? '12px' : '0',
        paddingBottom: isOpen ? '8px' : '0',
        borderBottom: isOpen ? `1px solid ${modelColor}30` : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: isOpen ? 'auto' : '100%',
        minHeight: isOpen ? 'auto' : '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {getModelIcon(currentModel)}
          <span style={{
            color: modelColor,
            fontWeight: '600',
            fontSize: isOpen ? '14px' : '13px',
            transition: 'font-size 0.3s ease'
          }}>
            {isOpen ? 'Current Model' : modelInfo.name}
          </span>
        </div>
        {isOpen && (
          <ChevronDown 
            size={16} 
            style={{ 
              color: modelColor,
              transform: 'rotate(180deg)',
              transition: 'transform 0.3s ease'
            }} 
          />
        )}
      </div>

      {/* Model Name */}
      <div style={{
        marginBottom: isOpen ? '8px' : '0',
        opacity: isOpen ? 1 : 0,
        maxHeight: isOpen ? '100px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 4px 0',
          lineHeight: '1.2'
        }}>
          {modelInfo.name}
        </h3>
        <div style={{
          fontSize: '11px',
          color: '#D1D5DB',
          fontFamily: 'monospace',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px 8px',
          borderRadius: '4px',
          wordBreak: 'break-all'
        }}>
          {modelInfo.fullName}
        </div>
      </div>

      {/* Price */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: isOpen ? '8px' : '0',
        opacity: isOpen ? 1 : 0,
        maxHeight: isOpen ? '30px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <DollarSign size={12} style={{ color: modelColor }} />
        <span style={{
          color: modelInfo.price === 'Free' ? '#10a37f' : '#F3F4F6',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          {modelInfo.price}
        </span>
      </div>

      {/* Description */}
      <p style={{
        color: '#E5E7EB',
        fontSize: '12px',
        lineHeight: '1.4',
        margin: '0 0 12px 0',
        opacity: isOpen ? 1 : 0,
        maxHeight: isOpen ? '60px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {modelInfo.description}
      </p>

      {/* Features */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        opacity: isOpen ? 1 : 0,
        maxHeight: isOpen ? '40px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {modelInfo.features.slice(0, 3).map((feature, index) => (
          <span key={index} style={{
            background: `${modelColor}20`,
            color: modelColor,
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '500',
            border: `1px solid ${modelColor}40`
          }}>
            {feature}
          </span>
        ))}
      </div>

      {/* Status Indicator */}
      <div style={{
        marginTop: isOpen ? '12px' : '0',
        padding: '6px 8px',
        background: 'rgba(16, 163, 127, 0.1)',
        borderRadius: '6px',
        border: '1px solid rgba(16, 163, 127, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        opacity: isOpen ? 1 : 0,
        maxHeight: isOpen ? '40px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#10a37f',
          animation: 'pulse 2s infinite'
        }} />
        <span style={{
          color: '#10a37f',
          fontSize: '11px',
          fontWeight: '500'
        }}>
          Active & Ready
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '8px',
          border: `1px solid ${modelColor}40`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px ${modelColor}20`,
          marginTop: '8px',
          maxHeight: '300px',
          overflow: 'hidden',
          zIndex: 1001,
          animation: 'fadeInDown 0.3s ease-out'
        }}>
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '8px 0'
        }}>
          {availableModels.map((model) => {
            const isSelected = model.id === currentModel;
            const modelColor = getModelColor(model.id);
            
            return (
              <div
                key={model.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModelSelect(model.id);
                }}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected ? `${modelColor}20` : 'transparent',
                  borderLeft: isSelected ? `3px solid ${modelColor}` : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {getModelIcon(model.id)}
                    <span style={{
                      color: isSelected ? modelColor : '#FFFFFF',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {model.name}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      color: model.price === 'Free' ? '#10a37f' : '#D1D5DB',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {model.price}
                    </span>
                    {isSelected && (
                      <Check size={16} style={{ color: modelColor }} />
                    )}
                  </div>
                </div>
                
                <div style={{
                  fontSize: '11px',
                  color: '#D1D5DB',
                  fontFamily: 'monospace',
                  marginBottom: '4px',
                  wordBreak: 'break-all'
                }}>
                  {model.fullName}
                </div>
                
                <div style={{
                  fontSize: '11px',
                  color: '#E5E7EB',
                  lineHeight: '1.3'
                }}>
                  {model.description}
                </div>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginTop: '6px'
                }}>
                  {model.features.slice(0, 2).map((feature, index) => (
                    <span key={index} style={{
                      background: `${modelColor}20`,
                      color: modelColor,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: '9px',
                      fontWeight: '500',
                      border: `1px solid ${modelColor}40`
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
};

export default CurrentModelDisplay;
