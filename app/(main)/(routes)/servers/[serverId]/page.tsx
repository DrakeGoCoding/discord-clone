import { auth } from '@clerk/nextjs/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

export default async function ServerIdPage({
  params: { serverId }
}: ServerIdPageProps) {
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
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== 'general') {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
}
