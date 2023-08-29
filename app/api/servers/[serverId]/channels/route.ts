import { currentProfile } from '@/actions/profile';
import { prismaClient } from '@/lib/prisma';
import { MemberRole, Profile } from '@prisma/client';
import { NextResponse } from 'next/server';

type Params = {
  params: { serverId: string };
};

export async function POST(req: Request, { params }: Params) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const serverId = params.serverId;

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 500 });
    }

    if (!serverId) {
      return new NextResponse('Server ID is missing', { status: 400 });
    }

    if (name === 'general') {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await prismaClient.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
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
    console.log('CHANNELS_CREATE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
