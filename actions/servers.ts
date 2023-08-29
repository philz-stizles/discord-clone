import { prismaClient } from '@/lib/prisma';

export const getFirstServer = async (profileId: string) => {
  const server = await prismaClient.server.findFirst({
    where: { profileId },
  });

  return server;
};

export const getServer = async (serverId: string, profileId: string) => {
  const server = await prismaClient.server.findUnique({
    where: { id: serverId, members: {
      some: {
        profileId
      }
    } },
  });

  return server;
};

export const getServers = async (userId: string) => {
  return await prismaClient.profile.findMany({
    where: { userId },
  });
};

export const getMemberServers = async (userId: string) => {
  return await prismaClient.server.findMany({
    where: {
      members: {
        some: {
          profileId: userId,
        },
      },
    },
  });
};

export const getMemberServer = async (serverId: string, profileId: string) => {
  return await prismaClient.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};
