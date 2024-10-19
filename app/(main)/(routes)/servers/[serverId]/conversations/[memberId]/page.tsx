import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/chat-header';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await currentProfile();
  const { redirectToSignIn } = auth();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  );
}
