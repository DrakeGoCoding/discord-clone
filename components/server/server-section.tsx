'use client';

import { ChannelType, MemberRole } from '@prisma/client';

import { ActionTooltip } from '@/components/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';
import { type ServerWithMembersWithProfiles } from '@/types';
import { Plus, Settings } from 'lucide-react';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  server?: ServerWithMembersWithProfiles;
  channelType?: ChannelType;
  sectionType: 'channels' | 'members';
}

export const ServerSection = ({
  label,
  role,
  channelType,
  sectionType,
  server
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="darK:text-zinc-400 text-xs font-semibold uppercase text-zinc-500">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen('createChannel', { server, channelType })}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen('members', { server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
