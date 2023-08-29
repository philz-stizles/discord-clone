import { currentProfile } from '@/actions/profile';
import { prismaClient } from '@/lib/prisma';
import { Profile } from '@prisma/client';
import { NextResponse } from 'next/server';

type Params = {
  params: { serverId: string; memberId: string };
};

export async function PATCH(req: Request, { params }: Params) {
  try {
    const profile = await currentProfile();
    const { role } = await req.json();
    const serverId = params.serverId;
    const memberId = params.memberId;

    validateMiddleware(profile, serverId, memberId);

    const server = await prismaClient.server.update({
      where: {
        id: serverId,
        profileId: profile?.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile?.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error: any) {
    console.log('MEMBER_UPDATE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const profile = await currentProfile();
    const serverId = params.serverId;
    const memberId = params.memberId;

    validateMiddleware(profile, serverId, memberId);

    const server = await prismaClient.server.update({
      where: {
        id: serverId,
        profileId: profile?.id,
      },
      data: {
        members: {
          delete: { // deleteMany
            id: memberId,
            profileId: {
              not: profile?.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error: any) {
    console.log('[MEMBER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

const validateMiddleware = (
  profile: Profile | null,
  serverId: string,
  memberId: string
) => {
  if (!profile) {
    return new NextResponse('Unauthorized', { status: 500 });
  }

  if (!serverId) {
    return new NextResponse('Server ID is missing', { status: 400 });
  }

  if (!memberId) {
    return new NextResponse('Member ID is missing', { status: 400 });
  }
};
