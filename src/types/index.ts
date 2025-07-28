// Shared type definitions for the AI Assistant application

export interface Message {
    sender: 'user' | 'ai';
    text?: string;
    response?: {
        answer: string;
        sources?: string[];
        [key: string]: any;
    };
    language?: string;
    isLoading?: boolean;
    timestamp?: string;
}

export interface Conversation {
    id: string;
    lastModified: string;
    language?: string;
}

export interface ModelResponse {
    answer: string | null;
    sources: string[] | null;
}

export interface ApiResponse {
    conversationId: string;
    answer: string;
    sources?: string[];
}
