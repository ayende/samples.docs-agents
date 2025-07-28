import React, { useState } from 'react';
import type { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: (language: string) => void;
}

const getLanguageIcon = (language?: string) => {
  switch (language) {
    case 'csharp': return '🔷';
    case 'python': return '🐍';
    case 'javascript': return '⚡';
    default: return '💬';
  }
};

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateNewConversation,
}) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleCreateConversation = (language: string) => {
    onCreateNewConversation(language);
    setShowLanguageSelector(false);
  };

  return (
    <div className="conversation-list">
      <div className="new-conversation-section">
        {!showLanguageSelector ? (
          <button
            className="new-conversation-btn"
            onClick={() => setShowLanguageSelector(true)}
          >
            New Conversation
          </button>
        ) : (
          <div className="language-selection">
            <div className="language-selection-header">
              <span>Select Language:</span>
              <button
                className="close-btn"
                onClick={() => setShowLanguageSelector(false)}
              >
                ×
              </button>
            </div>
            <div className="language-options">
              <button
                className="language-btn"
                onClick={() => handleCreateConversation('csharp')}
              >
                🔷 C#
              </button>
              <button
                className="language-btn"
                onClick={() => handleCreateConversation('python')}
              >
                🐍 Python
              </button>
              <button
                className="language-btn"
                onClick={() => handleCreateConversation('javascript')}
              >
                ⚡ Node.js
              </button>
            </div>
          </div>
        )}
      </div>

      <ul>
        {conversations.map((conversation) => {
          const isTemporary = conversation.id.startsWith('temp-');
          return (
            <li
              key={conversation.id}
              className={conversation.id === currentConversationId ? 'active' : ''}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <span className="conversation-icon">
                {getLanguageIcon(conversation.language)}
                {conversation.id === currentConversationId ? '⭐' : ''}
                {isTemporary ? '✨' : ''}
              </span>
              {isTemporary ? 'New Conversation' : conversation.lastModified}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationList;
