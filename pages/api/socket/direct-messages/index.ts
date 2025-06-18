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
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!userId) {
      return null;
    }

    const profile = await prismaClient.profile.findUnique({
      where: {
        userId,
      },
    });

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
      return res.status(404).json({ message: 'Server not found' });
    }

    const channel = await prismaClient.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const message = await prismaClient.directMessage.create({
      data: {
        memberId: member.id,
        content,
        fileUrl,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:direct-messages`;

    res.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[DIRECT_MESSAGES_CREATE]', error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
