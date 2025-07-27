import React from 'react';

interface Conversation {
  id: number;
  name: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: number;
  onSelectConversation: (id: number) => void;
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
        {conversations.map((conversation) => (
          <li 
            key={conversation.id} 
            className={conversation.id === currentConversationId ? 'active' : ''}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <span className="conversation-icon">
              {conversation.id === currentConversationId ? '⭐' : ''}
            </span>
            {conversation.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
