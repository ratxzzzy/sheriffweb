import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { socioSchema } from '../utils/validators';

export async function createSocio(req: Request, res: Response) {
  const body = socioSchema.parse(req.body);
  const created = await prisma.socio.create({ data: body });
  return res.status(201).json(created);
}

export async function listSocios(_req: Request, res: Response) {
  const items = await prisma.socio.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(items);
}
