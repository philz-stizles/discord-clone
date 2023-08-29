import { v4 as uuidv4 } from 'uuid';
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
      return new NextResponse('Unauthorized', { status: 400 });
    }

    const server = await prismaClient.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_INVITE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await prismaClient.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
