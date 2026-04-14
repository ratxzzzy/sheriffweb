import { Request, Response } from 'express';

export function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'Archivo no recibido' });
  }

  return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
}
