import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secretKey = 'difinitylabs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      const token = jwt.sign({ user: newUser }, secretKey, {
        expiresIn: '1h',
      });
      res.status(201).json({newUser, token: token});
    } catch (error) {
      console.error('Erro adicionando usuario:', error);
      res.status(500).json({ error: 'Falha ao adicionar usuário' });
    }
  } else if (req.method === 'PUT') {
    const { id, name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Falha ao atualizar usuário' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
      });
      res.status(200).json(deletedUser);
    } catch (error) {
      console.error('Erro deletando usuário:', error);
      res.status(500).json({ error: 'Falha ao deletar usuário' });
    }
  }
}
