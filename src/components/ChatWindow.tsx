import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface Message {
  sender: 'user' | 'ai';
  text?: string;
  response?: {
    answer: string;
    sources?: string[];
    [key: string]: any;
  };
  language?: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const renderMessageContent = (message: Message) => {
    // Get the text content - either from text property or response.answer
    const textContent = message.text || message.response?.answer || '';

    return (
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling for markdown elements
          p: ({ children }) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.5' }}>{children}</p>,
          h1: ({ children }) => <h1 style={{ color: '#0e639c', marginBottom: '8px' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ color: '#0e639c', marginBottom: '6px' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ color: '#0e639c', marginBottom: '6px' }}>{children}</h3>,
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code style={{
                backgroundColor: 'rgba(14, 99, 156, 0.2)',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              }}>
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre style={{
              backgroundColor: '#1e1e1e',
              padding: '12px',
              borderRadius: '6px',
              overflow: 'auto',
              margin: '8px 0'
            }}>
              {children}
            </pre>
          ),
          ul: ({ children }) => <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ol>,
          li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '3px solid #0e639c',
              paddingLeft: '12px',
              margin: '8px 0',
              color: '#ccc',
              fontStyle: 'italic'
            }}>
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} style={{ color: '#0e639c', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        }}
      >
        {textContent}
      </ReactMarkdown>
    );
  };

  const renderSources = (sources: string[]) => {
    if (!sources || sources.length === 0) return null;

    return (
      <div className="sources" style={{
        marginTop: '12px',
        padding: '8px 12px',
        backgroundColor: 'rgba(14, 99, 156, 0.1)',
        borderLeft: '3px solid #0e639c',
        fontSize: '0.85em',
        color: '#ccc',
        borderRadius: '0 4px 4px 0'
      }}>
        <strong style={{ color: '#0e639c' }}>Sources:</strong>
        <div style={{ marginTop: '4px' }}>
          {sources.map((source, index) => (
            <div key={index} style={{ marginBottom: '2px' }}>
              <a href={`/docs?id=${source}`} target="_blank" rel="noopener noreferrer"
                style={{
                  color: '#0e639c',
                  textDecoration: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                }}>
                📄 {source}
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {renderMessageContent(message)}
          {message.response?.sources && renderSources(message.response.sources)}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
