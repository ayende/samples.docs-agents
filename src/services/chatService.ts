const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiMessage {
  sender: 'user' | 'ai';
  text: string;
  language?: string;
  timestamp: string;
}

export interface ApiConversation {
  id: number;
  name: string;
  messages: ApiMessage[];
  createdAt: string;
}

export class ChatService {
  async sendMessage(message: string, language: string, conversationId?: number): Promise<ApiMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to dummy response if backend is unavailable
      return {
        sender: 'ai',
        text: `Sorry, I'm having trouble connecting to the server. Here's a fallback response for ${language}:\n\`\`\`${language}\n// Fallback code example\nconsole.log("Backend connection failed");\n\`\`\``,
        language,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getConversations(): Promise<ApiConversation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Return fallback conversations if backend is unavailable
      return [
        { id: 1, name: 'C# Conversation', messages: [], createdAt: new Date().toISOString() },
        { id: 2, name: 'Python Conversation', messages: [], createdAt: new Date().toISOString() },
      ];
    }
  }
}

export const chatService = new ChatService();
