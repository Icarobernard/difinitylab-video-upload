import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'PUT') {
    try {
      const updatedVideo = await prisma.video.update({
        where: { id: Number(id) },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      return res.status(200).json(updatedVideo);
    } catch (error) {
      console.error('Erro ao atualizar visualização do vídeo:', error);
      return res.status(500).json({ error: 'Falha ao atualizar a visualização do vídeo' });
    }
  } else {
    return res.status(405).json({ error: 'Operação não permitida' });
  }
}
