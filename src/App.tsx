import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ConversationList from './components/ConversationList';
import { chatService } from './services/chatService';
import './App.css';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  language?: string;
}

interface Conversation {
  id: number;
  name: string;
  messages: Message[];
}

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, name: 'C# Conversation', messages: [] },
    { id: 2, name: 'Python Conversation', messages: [] },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState<number>(1);
  const [language, setLanguage] = useState<string>('csharp');

  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id);
  };

  const handleCreateNewConversation = () => {
    const newId = conversations.length + 1;
    const newConversation: Conversation = {
      id: newId,
      name: `Conversation ${newId}`,
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newId);
  };

  const handleSendMessage = async (text: string) => {
    const currentConversation = conversations.find(c => c.id === currentConversationId);
    if (currentConversation) {
      // Add user message immediately
      const userMessage: Message = { sender: 'user', text };
      const newMessages: Message[] = [...currentConversation.messages, userMessage];
      
      // Update conversations with user message
      const updatedConversations = conversations.map(c =>
        c.id === currentConversationId ? { ...c, messages: newMessages } : c
      );
      setConversations(updatedConversations);
      
      try {
        // Get AI response from backend
        const aiResponse = await chatService.sendMessage(text, language, currentConversationId);
        const aiMessage: Message = {
          sender: aiResponse.sender,
          text: aiResponse.text,
          language: aiResponse.language,
        };
        
        // Add AI response
        const finalMessages = [...newMessages, aiMessage];
        const finalConversations = conversations.map(c =>
          c.id === currentConversationId ? { ...c, messages: finalMessages } : c
        );
        setConversations(finalConversations);
      } catch (error) {
        console.error('Error getting AI response:', error);
        // Fallback response if backend fails
        const fallbackResponse: Message = {
          sender: 'ai',
          text: `Sorry, I'm having trouble connecting to the server right now.`,
        };
        const finalMessages = [...newMessages, fallbackResponse];
        const finalConversations = conversations.map(c =>
          c.id === currentConversationId ? { ...c, messages: finalMessages } : c
        );
        setConversations(finalConversations);
      }
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="app">
      <div className="main-content">
        <div className="chat-container">
          {currentConversation && <ChatWindow messages={currentConversation.messages} />}
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask a question..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div className="language-selector">
            <div 
              className={`language-option ${language === 'csharp' ? 'selected' : ''}`}
              onClick={() => setLanguage('csharp')}
            >
              <div className="language-icon">🔷</div>
              <div className="language-name">C#</div>
            </div>
            <div 
              className={`language-option ${language === 'python' ? 'selected' : ''}`}
              onClick={() => setLanguage('python')}
            >
              <div className="language-icon">🐍</div>
              <div className="language-name">Python</div>
            </div>
            <div 
              className={`language-option ${language === 'javascript' ? 'selected' : ''}`}
              onClick={() => setLanguage('javascript')}
            >
              <div className="language-icon">⚡</div>
              <div className="language-name">Node.js</div>
            </div>
          </div>
        </div>
      </div>
      <ConversationList
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateNewConversation={handleCreateNewConversation}
      />
    </div>
  );
};

export default App;
