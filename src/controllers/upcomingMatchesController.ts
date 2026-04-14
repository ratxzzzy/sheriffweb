import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { upcomingMatchSchema } from '../utils/validators';

export async function listUpcomingMatches(_req: Request, res: Response) {
  const items = await prisma.upcomingMatch.findMany({ orderBy: { date: 'asc' } });
  return res.json(items);
}

export async function createUpcomingMatch(req: Request, res: Response) {
  const body = upcomingMatchSchema.parse(req.body);
  const created = await prisma.upcomingMatch.create({
    data: { ...body, date: new Date(body.date), tournament: body.tournament || null },
  });
  return res.status(201).json(created);
}

export async function updateUpcomingMatch(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = upcomingMatchSchema.parse(req.body);
  const updated = await prisma.upcomingMatch.update({
    where: { id },
    data: { ...body, date: new Date(body.date), tournament: body.tournament || null },
  });
  return res.json(updated);
}

export async function deleteUpcomingMatch(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.upcomingMatch.delete({ where: { id } });
  return res.status(204).send();
}
