import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { resultSchema } from '../utils/validators';

export async function listResults(_req: Request, res: Response) {
  const items = await prisma.result.findMany({ orderBy: { date: 'desc' } });
  return res.json(items);
}

export async function createResult(req: Request, res: Response) {
  const body = resultSchema.parse(req.body);
  const created = await prisma.result.create({ data: { ...body, date: new Date(body.date) } });
  return res.status(201).json(created);
}

export async function updateResult(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = resultSchema.parse(req.body);
  const updated = await prisma.result.update({
    where: { id },
    data: { ...body, date: new Date(body.date) },
  });
  return res.json(updated);
}

export async function deleteResult(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.result.delete({ where: { id } });
  return res.status(204).send();
}
