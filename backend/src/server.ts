import express from 'express';
import cors from 'cors';
import { chatRoutes } from './routes/chat';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Assistant Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Assistant Backend server running on port ${PORT}`);
});
