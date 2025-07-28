import express, { NextFunction, Request, Response } from 'express';
import { documentStore } from '../services/databaseService';

const router = express.Router();

// Error handling middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// GET /api/docs?id=
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({
      error: 'Invalid or missing document id'
    });
  }

  const session = documentStore.openSession();
  try {
    // Load the document by ID
    const document = await session.load(id) as any;

    if (!document) {
      return res.status(404).json({
        error: 'Document not found'
      });
    }

    // Return only the HtmlContent
    if (document.HtmlContent) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(document.HtmlContent);
    } else {
      res.status(404).json({
        error: 'Document has no HTML content'
      });
    }
  } finally {
    session.dispose();
  }
}));

export { router as docsRoutes };
