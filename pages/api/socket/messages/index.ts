import { NextApiRequest } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { NextApiResponseServerIo } from '@/types';
import { prismaClient } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return null;
    }

    const profile = await prismaClient.profile.findUnique({
      where: {
        userId,
      },
    });
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID missing' });
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' });
    }
  } catch (error) {
    console.log('[MESSAGES_CREATE]', error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
