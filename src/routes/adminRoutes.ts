import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { login } from '../controllers/authController';
import { createNews, deleteNews, listNews, updateNews } from '../controllers/newsController';
import { createPlayer, deletePlayer, listPlayers, updatePlayer } from '../controllers/playersController';
import { createResult, deleteResult, listResults, updateResult } from '../controllers/resultsController';
import { listSocios } from '../controllers/sociosController';
import { uploadImage } from '../controllers/uploadController';
import {
  createUpcomingMatch,
  deleteUpcomingMatch,
  listUpcomingMatches,
  updateUpcomingMatch,
} from '../controllers/upcomingMatchesController';
import { requireAuth } from '../middleware/auth';

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public/uploads'),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
});

export const adminRoutes = Router();

adminRoutes.post('/auth/login', login);

adminRoutes.use(requireAuth);
adminRoutes.get('/players', listPlayers);
adminRoutes.post('/players', createPlayer);
adminRoutes.put('/players/:id', updatePlayer);
adminRoutes.delete('/players/:id', deletePlayer);

adminRoutes.get('/matches/upcoming', listUpcomingMatches);
adminRoutes.post('/matches/upcoming', createUpcomingMatch);
adminRoutes.put('/matches/upcoming/:id', updateUpcomingMatch);
adminRoutes.delete('/matches/upcoming/:id', deleteUpcomingMatch);

adminRoutes.get('/matches/results', listResults);
adminRoutes.post('/matches/results', createResult);
adminRoutes.put('/matches/results/:id', updateResult);
adminRoutes.delete('/matches/results/:id', deleteResult);

adminRoutes.get('/news', listNews);
adminRoutes.post('/news', createNews);
adminRoutes.put('/news/:id', updateNews);
adminRoutes.delete('/news/:id', deleteNews);

adminRoutes.get('/socios', listSocios);
adminRoutes.post('/upload', upload.single('image'), uploadImage);
