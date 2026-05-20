import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import rsvpRoutes from './routes/rsvpRoutes.js';

export const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'boda-web-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rsvp', rsvpRoutes);
