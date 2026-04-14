import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { adminRoutes } from './routes/adminRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use(express.static(path.join(process.cwd(), 'public')));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

app.use('/api/admin/auth/login', loginLimiter);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/admin/index.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.use(errorHandler);
