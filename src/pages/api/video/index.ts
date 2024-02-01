import { NextApiRequest, NextApiResponse } from 'next';
const  multer = require('multer');
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public', 'upload'),
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
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
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  } else if (req.method === 'POST') {
    try {
      upload.single('file')(req, res, async (err: any) => {
        if (err) {
          console.error('Error uploading file:', err);
          return res.status(500).json({ error: 'Failed to upload file' });
        }

        const { name, description } = req.body;
        const path = `/upload/${req.file.filename}`;

        const newVideo = await prisma.video.create({
          data: {
            name,
            description,
            path,
            views: 0,
          },
        });

        res.status(201).json(newVideo);
      });
    } catch (error) {
      console.error('Error adding video:', error);
      res.status(500).json({ error: 'Failed to add video' });
    }
  } else if (req.method === 'PUT') {
    const { id, name, description, views, path } = req.body;

    try {
      const updatedVideo = await prisma.video.update({
        where: { id },
        data: {
          name,
          description,
          views,
          path,
        },
      });
      res.status(200).json(updatedVideo);
    } catch (error) {
      console.error('Error updating video:', error);
      res.status(500).json({ error: 'Failed to update video' });
    }
  } else if (req.method === 'DELETE') {
    const { id, path: filePath } = req.body;

    try {
      // Delete the file from public/upload
      const fullPath = path.join(process.cwd(), 'public', 'upload', filePath);
      await fs.unlink(fullPath);

      // Delete the record from the database
      const deletedVideo = await prisma.video.delete({
        where: { id },
      });

      res.status(200).json(deletedVideo);
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
