import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'difinitylabs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(401).json({ error: 'Email ou senha inválido' });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ user: user }, secretKey, {
          expiresIn: '1h',
        });

        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Email ou senha o inválido' });
      }
    } catch (error) {
      console.error('Erro ao logar:', error);
      res.status(500).json({ error: 'Falha ao logar' });
    }
  } else {
    res.status(405).json({ error: 'Operação não permitida' });
  }
}
