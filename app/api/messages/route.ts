import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';

const MESSAGES_BATCH = 10;

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
      return new NextResponse('Channel ID Missing', { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        where: {
          channelId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor
        }
      });
    } else {
      messages = await db.message.findMany({
        where: {
          channelId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: MESSAGES_BATCH
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.log('MESSAGES_GET', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
