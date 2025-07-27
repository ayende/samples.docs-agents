import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  language?: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const renderMessageContent = (message: Message) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(message.text)) !== null) {
      const [fullMatch, language, code] = match;
      const startIndex = match.index;
      const endIndex = startIndex + fullMatch.length;

      if (startIndex > lastIndex) {
        parts.push(<span key={lastIndex}>{message.text.slice(lastIndex, startIndex)}</span>);
      }

      parts.push(
        <SyntaxHighlighter key={startIndex} language={language || 'javascript'} style={vscDarkPlus}>
          {code}
        </SyntaxHighlighter>
      );
      lastIndex = endIndex;
    }

    if (lastIndex < message.text.length) {
      parts.push(<span key={lastIndex}>{message.text.slice(lastIndex)}</span>);
    }

    return parts;
  };


  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {renderMessageContent(message)}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
