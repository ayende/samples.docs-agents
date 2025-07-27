# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# AI Assistant

A full-stack TypeScript application that serves as an AI Assistant for software projects.

## Features

- **Chat Interface**: Interactive chat window where users can ask questions and receive AI responses
- **Programming Language Selection**: Choose between C#, Python, and Node.js at the beginning of conversations
- **Syntax Highlighting**: Automatic code highlighting for code snippets in responses using \`\`\` code blocks
- **Conversation Management**: Create new conversations and switch between existing ones
- **Dark Theme**: IDE-inspired dark mode with blue accents (#0e639c)
- **REST API Backend**: TypeScript Express.js server with dummy AI responses

## Tech Stack

- **Frontend**: React with TypeScript, Vite
- **Backend**: Express.js with TypeScript
- **Styling**: CSS with dark theme
- **Code Highlighting**: react-syntax-highlighter
- **API**: RESTful endpoints for chat functionality

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/
│   │   ├── ChatWindow.tsx      # Main chat interface
│   │   └── ConversationList.tsx # Sidebar with conversations
│   ├── services/
│   │   └── chatService.ts      # Frontend API service
│   ├── App.tsx                 # Main application component
│   └── App.css                 # Application styling
└── backend/                # Backend Express.js server
    ├── src/
    │   ├── routes/
    │   │   └── chat.ts         # Chat API routes
    │   ├── services/
    │   │   └── aiService.ts    # AI response logic
    │   └── server.ts           # Express server setup
    └── package.json
```

## Getting Started

### Frontend

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Backend

1. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

## Usage

1. Start both frontend and backend servers
2. Select your preferred programming language from the dropdown
3. Type your question in the chat input and press Enter
4. View AI responses with syntax-highlighted code snippets
5. Create new conversations or switch between existing ones using the sidebar

## API Endpoints

- `POST /api/chat/message` - Send a message and get AI response
- `GET /api/chat/conversations` - Get all conversations
- `GET /health` - Server health check

## Development

The application uses:

- **Frontend**: Vite for fast development and hot module replacement
- **Backend**: ts-node for TypeScript development with auto-reload
- **Fallback**: Frontend gracefully handles backend unavailability with fallback responses

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
