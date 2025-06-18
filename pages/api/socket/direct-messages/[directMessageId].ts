import { NextApiRequest } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { NextApiResponseServerIo } from '@/types';
import { prismaClient } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
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
    const { serverId, channelId, messageId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID missing' });
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' });
    }

    const server = await prismaClient.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const channel = await prismaClient.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
  } catch (error) {
    console.log('[MESSAGES_CREATE]', error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
