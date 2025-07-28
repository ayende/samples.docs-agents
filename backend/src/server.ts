import express from 'express';
import cors from 'cors';
import { chatRoutes } from './routes/chat';
import { docsRoutes } from './routes/docs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/docs', docsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Assistant Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Assistant Backend server running on port ${PORT}`);
});
