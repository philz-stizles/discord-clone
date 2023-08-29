import { currentProfile } from '@/actions/profile';
import { prismaClient } from '@/lib/prisma';
import { MemberRole, Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_PER_PAGE = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');
    if (!channelId) {
      return new NextResponse('Channel ID is missing', { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await prismaClient.message.findMany({
        take: MESSAGES_PER_PAGE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await prismaClient.message.findMany({
        take: MESSAGES_PER_PAGE,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_PER_PAGE) {
      nextCursor = messages[MESSAGES_PER_PAGE - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log('[SERVERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}