import { prismaClient } from '@/lib/prisma';

export const getMembership = async (serverId: string, profileId: string) => {
  let member = null;
  try {
    member = await prismaClient.member.findFirst({
      where: {
        serverId,
        profileId,
      },
    });
  } catch (error) {
    console.error(error);
  }

  return member;
};
