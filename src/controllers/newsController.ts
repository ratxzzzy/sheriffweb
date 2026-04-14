import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { newsSchema } from '../utils/validators';

export async function listNews(_req: Request, res: Response) {
  const items = await prisma.news.findMany({ orderBy: { date: 'desc' } });
  return res.json(items);
}

export async function createNews(req: Request, res: Response) {
  const body = newsSchema.parse(req.body);
  const created = await prisma.news.create({ data: { ...body, date: new Date(body.date) } });
  return res.status(201).json(created);
}

export async function updateNews(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = newsSchema.parse(req.body);
  const updated = await prisma.news.update({ where: { id }, data: { ...body, date: new Date(body.date) } });
  return res.json(updated);
}

export async function deleteNews(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.news.delete({ where: { id } });
  return res.status(204).send();
}
