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
      console.error('Error updating video views:', error);
      return res.status(500).json({ error: 'Failed to update video views' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
