// pages/api/videos/[id].ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Sem ID do vídeo no URL' });
    return;
  }

  const videoId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
 if (req.method === 'DELETE') {
    try {
      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        res.status(404).json({ error: 'Video não encontrado' });
        return;
      }

      const fullPath = path.join(process.cwd(), 'public', video.path);
      await fs.unlink(fullPath);

      const deletedVideo = await prisma.video.delete({
        where: { id: videoId },
      });

      res.status(200).json({deletedVideo, message: "Vídeo deletado com sucesso!"});
    } catch (error) {
      console.error('Erro deletando o video:', error);
      res.status(500).json({ error: 'Falha ao deletar o vídeo' });
    }
  } else if (req.method === 'GET') {
    try {
      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        res.status(404).json({ error: 'Video não encontrado' });
        return;
      }

      res.status(200).json(video);
    } catch (error) {
      console.error('Error fetching video:', error);
      res.status(500).json({ error: 'Failed ao buscar o video' });
    }
  } else {
    res.status(405).json({ error: 'Operação não permitida' });
  }
}
