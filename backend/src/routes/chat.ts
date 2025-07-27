import express, { Request, Response } from 'express';
import { AiService } from '../services/aiService';

const router = express.Router();
const aiService = new AiService();

// POST /api/chat/message
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, language, conversationId } = req.body;
    
    if (!message || !language) {
      return res.status(400).json({ 
        error: 'Message and language are required' 
      });
    }

    const aiResponse = await aiService.generateResponse(message, language, conversationId);
    
    res.json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response' 
    });
  }
});

// GET /api/chat/conversations
router.get('/conversations', (req: Request, res: Response) => {
  try {
    const conversations = aiService.getConversations();
    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversations' 
    });
  }
});

export { router as chatRoutes };
