const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiMessage {
  sender: 'user' | 'ai';
  text: string;
  response: any;
  timestamp: string;
}

export interface ApiConversation {
  id: string;
  lastModified: string;
  language?: string;
}

export interface ModelResult {
  conversationId: string;
  answer: string;
  sources?: string[];
}

export class ChatService {
  async sendMessage(message: string, language: string, conversationId?: string): Promise<ModelResult> {
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
  }

  async getConversations(): Promise<ApiConversation[]> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.conversations;
  }

  async getConversationMessages(conversationId: string): Promise<ApiMessage[]> {

    const response = await fetch(`${API_BASE_URL}/chat/messages?id=${encodeURIComponent(conversationId)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.messages;
  }

  async getDocument(documentId: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/docs?id=${encodeURIComponent(documentId)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Return the HTML content as text
    return await response.text();
  }

  // Helper method to get the document URL for iframe usage
  getDocumentUrl(documentId: string): string {
    return `${API_BASE_URL}/docs?id=${encodeURIComponent(documentId)}`;
  }
}

export const chatService = new ChatService();
