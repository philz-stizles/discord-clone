import { currentProfile } from '@/actions/profile';
import { prismaClient } from '@/lib/prisma';
import { MemberRole, Profile } from '@prisma/client';
import { NextResponse } from 'next/server';

type Params = {
  params: { serverId: string; channelId: string };
};

export async function PATCH(req: Request, { params }: Params) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const serverId = params.serverId;
    const channelId = params.channelId;

    validation(profile, serverId, channelId);

    if (name === 'general') {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await prismaClient.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile?.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error: any) {
    console.log('CHANNEL_UPDATE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const profile = await currentProfile();
    const serverId = params.serverId;
    const channelId = params.channelId;

    validation(profile, serverId, channelId);

    const server = await prismaClient.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile?.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error: any) {
    console.log('[CHANNEL_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

const validation = (
  profile: Profile | null,
  serverId: string,
  channelId: string
) => {
  if (!profile) {
    return new NextResponse('Unauthorized', { status: 500 });
  }

  if (!serverId) {
    return new NextResponse('Server ID is missing', { status: 400 });
  }

  if (!channelId) {
    return new NextResponse('Channel ID is missing', { status: 400 });
  }
};
