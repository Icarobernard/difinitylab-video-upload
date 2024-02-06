import { NextApiRequest, NextApiResponse } from 'next';
const multer = require('multer');
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public', 'upload'),
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
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
    path: string;
  };
}
export default async function handler(
  req: MulterNextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { search } = req.query;

    try {
      let videos;
      if (search) {
        videos = await prisma.video.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: search.toString(),
                },
              },
              {
                description: {
                  contains: search.toString(),
                },
              },
            ],
          },
        });
      } else {
        videos = await prisma.video.findMany();
      }

      res.status(200).json(videos);
    } catch (error) {
      console.error('Erro ao buscar videos:', error);
      res.status(500).json({ error: 'Falha ao buscar videos' });
    }
  } else if (req.method === 'POST') {
    try {
      upload.single('file')(req, res, async (err: any) => {
        if (err) {
          console.error('Erro uploading arquivo:', err);
          return res.status(500).json({ error: 'Falha ao efetuar o upload do arquivo' });
        }

        const { name, description } = req.body;
        const path = req.file.path.replace('public', '');

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
