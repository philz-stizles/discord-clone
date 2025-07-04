import { NextApiRequest } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { NextApiResponseServerIo } from '@/types';
import { prismaClient } from '@/lib/prisma';
import { MemberRole } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const { serverId, channelId, messageId } = req.query;

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

    let message = await prismaClient.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.isDeleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'DELETE') {
      message = await prismaClient.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          isDeleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      message = await prismaClient.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res.socket.server.io.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[MESSAGES_CREATE]', error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
