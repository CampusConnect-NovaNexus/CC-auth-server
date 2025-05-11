import express from 'express';
import type { Request, Response, Router } from 'express';
import { Database } from '../lib/db';

const router: Router = express.Router();
const prisma = Database.getClient();

router.get('/top10', async (req: Request, res: Response):Promise<any> => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        points: true,
      },
      where: {
        points: {
          gt: 0
        }
      }
    });
    return res.status(200).json(topUsers);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal Server Error', details: message });
  }
});

router.get('/:userId', async (req: Request, res: Response): Promise<any> => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ points: user.points });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal Server Error', details: message });
  }
});

router.post('/:userId', async (req: Request, res: Response):Promise<any> => {
  const { userId } = req.params;
  const { pointsToAdd } = req.body;

  if (!userId || !pointsToAdd) {
    return res.status(400).json({ error: 'userId and pointsToAdd are required' });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } },
    });
    return res.status(200).json({ message: "Points added successfully", updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal Server Error', details: message });
  }
});

export default router;
