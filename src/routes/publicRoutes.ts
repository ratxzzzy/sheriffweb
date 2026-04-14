import { Router } from 'express';
import { listNews } from '../controllers/newsController';
import { listPlayers } from '../controllers/playersController';
import { listResults } from '../controllers/resultsController';
import { createSocio } from '../controllers/sociosController';
import { listUpcomingMatches } from '../controllers/upcomingMatchesController';

export const publicRoutes = Router();

publicRoutes.get('/players', listPlayers);
publicRoutes.get('/matches/upcoming', listUpcomingMatches);
publicRoutes.get('/matches/results', listResults);
publicRoutes.get('/news', listNews);
publicRoutes.post('/socios', createSocio);
