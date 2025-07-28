import React from 'react';

interface Conversation {
  id: string;
  lastModified: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateNewConversation,
}) => {
  return (
    <div className="conversation-list">
      <button onClick={onCreateNewConversation}>New Conversation</button>

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
