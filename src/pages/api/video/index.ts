import { NextApiRequest, NextApiResponse } from 'next';
const multer = require('multer');
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public', 'upload'),
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + '.mp4');
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};
interface MulterNextApiRequest extends NextApiRequest {
  file: {
    filename: any;
    path: string;
  };
}
export default async function handler(
  req: MulterNextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { search } = req.query;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 1;
    try {
      const searchCondition = search
        ? {
          OR: [
            { name: { contains: search.toString() } },
            { description: { contains: search.toString() } },
          ],
        }
        : {};

      const totalCount = await prisma.video.count({
        where: searchCondition,
      });

      const videos = await prisma.video.findMany({
        where: searchCondition,
        take: pageSize as number,
        skip: (page as number - 1) * (pageSize as number),
      });

      const hasMore = page * pageSize < totalCount;
      res.status(200).json({ videos, hasMore });
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      res.status(500).json({ error: 'Falha ao buscar vídeos' });
    }
  } else if (req.method === 'POST') {
    try {
      upload.single('file')(req, res, async (err: any) => {
        if (err) {
          console.error('Erro upando o arquivo:', err);
          return res.status(500).json({ error: 'Falha ao efetuar o upload do arquivo' });
        }

        const { name, description } = req.body;
        const path = `/upload/${req.file.filename}`;

        const newVideo = await prisma.video.create({
          data: {
            name,
            description,
            path,
            views: 0
          },
        });

        res.status(201).json(newVideo);
      });
    } catch (error) {
      console.error('Erro ao adicionar video:', error);
      res.status(500).json({ error: 'Falha para adicionar video' });
    }
  }
}
