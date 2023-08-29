import { prismaClient } from '@/lib/prisma';

export const getChannel = async (channelId: string) => {
  let channel = null;
  try {
    channel = await prismaClient.channel.findUnique({
      where: {
        id: channelId,
      },
    });
  } catch (error) {
    console.error(error);
  }

  return channel;
};
