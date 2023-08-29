import { v4 as uuidv4 } from 'uuid';
import { currentProfile } from '@/actions/profile';
import { prismaClient } from '@/lib/prisma';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    const newServer = await prismaClient.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
      },
    });

    return NextResponse.json(newServer);
  } catch (error) {
    console.log('[SERVERS_CREATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
