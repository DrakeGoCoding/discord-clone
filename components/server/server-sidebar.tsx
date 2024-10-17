import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

import { ServerHeader } from './server-header';

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  const { redirectToSignIn } = auth();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  });

  if (!server) {
    return redirect('/');
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};
