import { MatchResult } from '@prisma/client';
import { z } from 'zod';

const isoDate = z.string().datetime();

export const playerSchema = z.object({
  dorsal: z.number().int().min(0).max(99),
  name: z.string().min(2).max(100),
  nick: z.string().max(60).optional().or(z.literal('')),
  badges: z.array(z.string().min(1).max(50)).default([]),
});

export const upcomingMatchSchema = z.object({
  rival: z.string().min(1).max(100),
  date: isoDate,
  location: z.string().min(1).max(120),
  tournament: z.string().max(120).optional().or(z.literal('')),
});

export const resultSchema = z.object({
  rival: z.string().min(1).max(100),
  date: isoDate,
  score: z.string().regex(/^\d+\s*-\s*\d+$/),
  resultType: z.nativeEnum(MatchResult),
});

export const newsSchema = z.object({
  title: z.string().min(4).max(160),
  date: isoDate,
  excerpt: z.string().min(10).max(500),
  imageUrl: z.string().url(),
});

export const socioSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
});
