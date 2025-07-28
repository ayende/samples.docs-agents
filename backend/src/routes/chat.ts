import express, { NextFunction, Request, Response } from 'express';
import { documentStore } from '../services/databaseService';

const router = express.Router();

type ModelResponse = {
  answer: string | null;
  sources: string[] | null;
}

// Error handling middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Global error handler for this router
router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Route error:', error);
  res.status(500).json({
    error: error.message || 'Internal server error',
    success: false
  });
});

// POST /api/message
router.post('/message', asyncHandler(async (req: Request, res: Response) => {
  const { message, language, conversationId } = req.body;

  const conversation = conversationId != null ?
    documentStore.ai.resumeConversation<ModelResponse>(conversationId) :
    documentStore.ai.startConversation<ModelResponse>('ravendb-docs-rag-agent', {
      'userId': 'users/default',
    })

  conversation.setUserPrompt(message + "\n\nProgramming language: " + language);
  const resp = await conversation.run();
  if (resp != 'Done') {
    // cannot happen, we have no users actions to run
    return res.status(500).json({
      error: 'Failed to process message: ' + resp,
      success: false
    });
  }

  res.json({
    success: true,
    response: {
      ...conversation.answer,
      conversationId: conversationId || conversation.id,
    },
  });
}));

// GET /api/chat/conversations
router.get('/conversations', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId || 'users/default';
  const session = documentStore.openSession();
  try {
    const conversations = await session.advanced.rawQuery(`
from index 'Conversations/Search' as c
where c.userId = $userId
order by c.lastModified desc
select {
  id: id(c),
  lastModified: c.lastModified,
  lastMessage: c.Messages[1].content.substring(0, 50)
}
limit 10
`)
      .addParameter('userId', userId)
      .all();
    res.json({ conversations });
  } finally {
    session.dispose();
  }
}));

// GET /api/chat/messages?id=
router.get('/messages', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({
      error: 'Invalid or missing conversation id'
    });
  }
  const session = documentStore.openSession();
  try {
    const conversation = await session.load(id) as any;

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    const messages = conversation.Messages || [];
    const formattedMessages = messages
      .filter((msg: any) => msg.role == 'user' || (msg.role == 'assistant' && msg.content))
      .map((msg: any) => ({
        sender: msg.role === 'user' ? 'user' : 'ai',
        text: msg.role === 'user' ? msg.content : null,
        response: msg.role === 'assistant' ? JSON.parse(msg.content) : null,
        date: msg.date,
        tokens: msg.usage?.TotalTokens || 0
      }));

    res.json({ messages: formattedMessages });
  } finally {
    session.dispose();
  }
}));

export { router as chatRoutes };

