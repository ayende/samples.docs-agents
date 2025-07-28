import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { chatService } from '../services/chatService';
import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  const handleViewDocument = async (documentId: string) => {
    setIsLoadingDocument(true);
    try {
      const content = await chatService.getDocument(documentId);
      // Wrap the content with white background and proper styling
      const styledContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              background-color: white;
              color: black;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
              line-height: 1.6;
              margin: 20px;
              padding: 0;
            }
            pre {
              background-color: #f6f8fa;
              border: 1px solid #d1d9e0;
              border-radius: 6px;
              padding: 12px;
              overflow-x: auto;
            }
            code {
              background-color: #f6f8fa;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #1f2328;
              margin-top: 24px;
              margin-bottom: 16px;
            }
            a {
              color: #0969da;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;
      setDocumentContent(styledContent);
      setSelectedDocument(documentId);
    } catch (error) {
      console.error('Error loading document:', error);
      alert('Failed to load document: ' + error);
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const closeDocumentViewer = () => {
    setSelectedDocument(null);
    setDocumentContent('');
  };

  const LoadingAnimation: React.FC = () => {
    const [currentEmoji, setCurrentEmoji] = useState(0);
    const [currentText, setCurrentText] = useState(0);

    const emojis = ['🤔', '💭', '🧠', '⚡', '✨', '🔍', '📝', '💡'];
    const texts = [
      'Thinking...',
      'Processing your request...',
      'Searching documentation...',
      'Analyzing context...',
      'Generating response...',
      'Almost there...'
    ];

    useEffect(() => {
      const emojiInterval = setInterval(() => {
        setCurrentEmoji(prev => (prev + 1) % emojis.length);
      }, 300);

      const textInterval = setInterval(() => {
        setCurrentText(prev => (prev + 1) % texts.length);
      }, 1500);

      return () => {
        clearInterval(emojiInterval);
        clearInterval(textInterval);
      };
    }, []);

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#0e639c',
        fontStyle: 'italic'
      }}>
        <span style={{
          fontSize: '18px',
          display: 'inline-block',
          animation: 'pulse 1s infinite'
        }}>
          {emojis[currentEmoji]}
        </span>
        <span>{texts[currentText]}</span>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  };

  const renderMessageContent = (message: Message) => {
    // Handle loading state
    if (message.isLoading) {
      return <LoadingAnimation />;
    }

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
            <div key={index} style={{ marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleViewDocument(source)}
                disabled={isLoadingDocument}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0e639c',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(14, 99, 156, 0.2)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                📄 {source}
              </button>
              <a
                href={chatService.getDocumentUrl(source)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0e639c',
                  fontSize: '0.8em',
                  textDecoration: 'none'
                }}
                title="Open in new tab"
              >
                🔗
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-window">
      {selectedDocument && (
        <div className="document-viewer" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            width: '90%',
            height: '90%',
            position: 'relative',
            border: '1px solid #3e3e42'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #3e3e42',
              backgroundColor: '#252526'
            }}>
              <h3 style={{ margin: 0, color: '#0e639c', fontSize: '16px' }}>
                Document: {selectedDocument}
              </h3>
              <button
                onClick={closeDocumentViewer}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4d4d4',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#3e3e42'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>
            <iframe
              srcDoc={documentContent}
              style={{
                width: '100%',
                height: 'calc(100% - 60px)',
                border: 'none',
                borderRadius: '0 0 8px 8px'
              }}
              title={`Document: ${selectedDocument}`}
            />
          </div>
        </div>
      )}

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
