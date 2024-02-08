import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, description } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Sem ID do vídeo no URL' });
    return;
  }

  const videoId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);

  if (req.method === 'PUT') {

    try {
      const updatedVideo = await prisma.video.update({
        where: { id: videoId },
        data: {
          name: name?.toString(),
          description: description?.toString(),
        },
      });
      res.status(200).json({updatedVideo, message: "Atualizado com sucesso!"});
    } catch (error) {
      console.error('Error atualizando o video:', error);
      res.status(500).json({ error: 'Falha pra atualizar o video' });
    }
  } 
}
