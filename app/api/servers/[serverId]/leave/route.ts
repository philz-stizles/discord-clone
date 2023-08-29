import { currentProfile } from '@/actions/profile';
import { prismaClient } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const serverId = params.serverId;
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 });
    }

    const profileId = profile.id;
    const server = await prismaClient.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profileId,
        },
        members: {
          some: {
            profileId,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_LEAVE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
