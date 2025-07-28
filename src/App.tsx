import React, { useEffect, useState } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import ConversationList from './components/ConversationList';
import { chatService } from './services/chatService';
import type { Conversation, Message } from './types';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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
        alert('Failed to load conversation messages from the backend: ' + error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [currentConversationId]);

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleCreateNewConversation = (language: string) => {
    // Create conversation purely on frontend
    const newConversation: Conversation = {
      id: `temp-${Date.now()}`, // Temporary ID that will be replaced by backend
      lastModified: new Date().toISOString(),
      language: language
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

    // Get the current conversation to determine its language
    const currentConversation = conversations.find(conv => conv.id === currentConversationId);
    const conversationLanguage = currentConversation?.language || 'csharp';

    // Add user message immediately to UI
    const userMessage: Message = { sender: 'user', text };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Add loading message with animation
    const loadingMessage: Message = {
      sender: 'ai',
      text: '🤔 Thinking...',
      isLoading: true
    };
    setMessages(prevMessages => [...prevMessages, loadingMessage]);

    try {
      // Check if this is a temporary conversation (starts with 'temp-')
      const isTemporaryConversation = currentConversationId.startsWith('temp-');
      const conversationIdToSend = isTemporaryConversation ? undefined : currentConversationId;

      // Get AI response from backend
      const aiResponse = await chatService.sendMessage(text, conversationLanguage, conversationIdToSend);
      const aiMessage: Message = {
        sender: 'ai',
        response: { answer: aiResponse.answer, sources: aiResponse.sources },
      };

      // Replace loading message with actual AI response
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        // Replace the last message (which should be the loading message) with the AI response
        newMessages[newMessages.length - 1] = aiMessage;
        return newMessages;
      });

      // If this was a temporary conversation, update it with the real ID from backend
      if (isTemporaryConversation && aiResponse.conversationId) {
        const tempConversation = conversations.find(conv => conv.id === currentConversationId);
        const updatedConversation: Conversation = {
          id: aiResponse.conversationId,
          lastModified: new Date().toISOString(),
          language: tempConversation?.language || conversationLanguage
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

      // Replace loading message with fallback response
      const fallbackResponse: Message = {
        sender: 'ai',
        text: `Sorry, I'm having trouble connecting to the server right now.`,
      };
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        // Replace the last message (which should be the loading message) with the fallback response
        newMessages[newMessages.length - 1] = fallbackResponse;
        return newMessages;
      });
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
