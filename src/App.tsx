import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ConversationList from './components/ConversationList';
import { chatService } from './services/chatService';
import './App.css';

interface Message {
  sender: 'user' | 'ai';
  text: string | null;
  response: {
    answer: string;
    sources?: string[];
  } | null;
}

interface Conversation {
  id: string;
  lastModified: string;
}

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<string>('csharp');

  // Load conversations from backend on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await chatService.getConversations();

        setConversations(response);

        // Set the first conversation as current if available
        if (response.length > 0) {
          setCurrentConversationId(response[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        alert('Failed to load conversations from the backend. Please check if the server is running: ' + error);
      }
    };

    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId || currentConversationId.startsWith('temp-')) {
        setMessages([]);
        return;
      }

      try {
        const conversationMessages = await chatService.getConversationMessages(currentConversationId);
        setMessages(conversationMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        alert('Failed to load conversation messages from the backend.');
        setMessages([]);
      }
    };

    loadMessages();
  }, [currentConversationId]);

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleCreateNewConversation = () => {
    // Create conversation purely on frontend
    const newConversation: Conversation = {
      id: `temp-${Date.now()}`, // Temporary ID that will be replaced by backend
      lastModified: new Date().toISOString()
    };

    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
    // Clear messages when creating a new conversation
    setMessages([]);
  };

  const handleSendMessage = async (text: string) => {
    if (!currentConversationId) {
      alert('Please select a conversation first.');
      return;
    }

    // Add user message immediately to UI
    const userMessage: Message = { sender: 'user', text, response: null };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      // Check if this is a temporary conversation (starts with 'temp-')
      const isTemporaryConversation = currentConversationId.startsWith('temp-');
      const conversationIdToSend = isTemporaryConversation ? undefined : currentConversationId;

      // Get AI response from backend
      const aiResponse = await chatService.sendMessage(text, language, conversationIdToSend);
      const aiMessage: Message = {
        sender: 'ai',
        text: null,
        response: { answer: aiResponse.answer, sources: aiResponse.sources },
      };

      // Add AI response to UI
      setMessages(prevMessages => [...prevMessages, aiMessage]);

      // If this was a temporary conversation, update it with the real ID from backend
      if (isTemporaryConversation && aiResponse.conversationId) {
        const updatedConversation: Conversation = {
          id: aiResponse.conversationId,
          lastModified: new Date().toISOString()
        };

        // Replace the temporary conversation with the real one
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === currentConversationId ? updatedConversation : conv
          )
        );

        setCurrentConversationId(aiResponse.conversationId);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      alert('Error getting AI response from the backend. Please try again.');

      // Add fallback response if backend fails
      const fallbackResponse: Message = {
        sender: 'ai',
        text: `Sorry, I'm having trouble connecting to the server right now.`,
        response: null,
      };
      setMessages(prevMessages => [...prevMessages, fallbackResponse]);
    }
  };

  return (
    <div className="app">
      <div className="main-content">
        <div className="chat-container">
          <ChatWindow messages={messages} />
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
