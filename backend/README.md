# AI Assistant Backend

This is the TypeScript backend server for the AI Assistant application. It provides REST API endpoints for chat functionality and conversation management.

## Features

- **REST API**: Express.js server with TypeScript
- **Chat Endpoints**: Send messages and receive AI responses
- **Conversation Management**: Create and manage chat conversations
- **Dummy AI Responses**: Language-specific code examples and responses
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Chat

- `POST /api/chat/message` - Send a message and get AI response
- `GET /api/chat/conversations` - Get all conversations

### Health Check

- `GET /health` - Server health status

## Getting Started

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

The server will run on `http://localhost:3001`

## Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── chat.ts         # Chat API routes
│   ├── services/
│   │   └── aiService.ts    # AI response logic
│   └── server.ts           # Express server setup
├── package.json
└── tsconfig.json
```

## API Usage Examples

### Send Message

```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I create a class in C#?",
    "language": "csharp",
    "conversationId": 1
  }'
```

### Get Conversations

```bash
curl http://localhost:3001/api/chat/conversations
```
