import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { playerSchema } from '../utils/validators';

const normalizeBadges = (badges: string[]) => badges.join('||');
const parseBadges = (badges: string) => (badges ? badges.split('||') : []);

export async function listPlayers(_req: Request, res: Response) {
  const items = await prisma.player.findMany({ orderBy: { dorsal: 'asc' } });
  return res.json(items.map((p) => ({ ...p, badges: parseBadges(p.badges) })));
}

export async function createPlayer(req: Request, res: Response) {
  const body = playerSchema.parse(req.body);
  const created = await prisma.player.create({
    data: { ...body, nick: body.nick || null, badges: normalizeBadges(body.badges) },
  });
  return res.status(201).json({ ...created, badges: parseBadges(created.badges) });
}

export async function updatePlayer(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = playerSchema.parse(req.body);
  const updated = await prisma.player.update({
    where: { id },
    data: { ...body, nick: body.nick || null, badges: normalizeBadges(body.badges) },
  });
  return res.json({ ...updated, badges: parseBadges(updated.badges) });
}

export async function deletePlayer(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.player.delete({ where: { id } });
  return res.status(204).send();
}
