import React from 'react';
import { Brain, DollarSign, Eye } from 'lucide-react';

const ModelInfo = ({ currentModel, onModelChange }) => {
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
    },
  ];

  const currentModelInfo = models.find(m => m.id === currentModel) || models[0];

  return (
    <div style={{
      background: 'rgba(45, 45, 45, 0.6)',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem'
      }}>
        <Brain size={16} style={{ color: '#E0E7FF' }} />
        <span style={{ fontWeight: '600', color: '#FFFFFF' }}>
          Current Model: {currentModelInfo.name}
        </span>
        {currentModelInfo.id === 'qwen2.5-vl-7b' && (
          <Eye size={16} style={{ color: '#E0E7FF' }} title="Vision Model" />
        )}
      </div>
      
      <div style={{
        fontSize: '0.75rem',
        color: '#D1D5DB',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        marginBottom: '0.5rem',
        padding: '0.25rem 0.5rem',
        background: 'rgba(26, 26, 26, 0.6)',
        borderRadius: '4px',
        backdropFilter: 'blur(5px)'
      }}>
        {currentModelInfo.fullName}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.5rem',
        fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <DollarSign size={14} style={{ color: '#E0E7FF' }} />
          <span style={{ color: '#F3F4F6' }}>
            {currentModelInfo.price}
          </span>
        </div>
      </div>

      <p style={{
        fontSize: '0.85rem',
        color: '#E5E7EB',
        marginBottom: '0.5rem',
        lineHeight: '1.4'
      }}>
        {currentModelInfo.description}
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem',
        marginBottom: '0.5rem'
      }}>
        {currentModelInfo.features.map((feature, index) => (
          <span key={index} style={{
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#E0E7FF',
            padding: '0.2rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            {feature}
          </span>
        ))}
      </div>

      <details style={{ fontSize: '0.85rem' }}>
        <summary style={{
          cursor: 'pointer',
          color: '#E0E7FF',
          fontWeight: '500'
        }}>
          Change Model
        </summary>
        <div style={{
          marginTop: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              style={{
                background: model.id === currentModel 
                  ? 'rgba(139, 92, 246, 0.2)' 
                  : 'rgba(26, 26, 26, 0.6)',
                color: model.id === currentModel ? '#E0E7FF' : '#FFFFFF',
                border: model.id === currentModel 
                  ? '1px solid rgba(139, 92, 246, 0.4)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                backdropFilter: 'blur(5px)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontWeight: '600', 
                marginBottom: '0.25rem' 
              }}>
                {model.name}
                {model.id === 'qwen2.5-vl-7b' && (
                  <Eye size={12} color="currentColor" title="Vision Model" />
                )}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem', color: '#F3F4F6' }}>
                {model.price}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                opacity: 0.7, 
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                wordBreak: 'break-all',
                color: '#D1D5DB'
              }}>
                {model.fullName}
              </div>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
};

export default ModelInfo; 