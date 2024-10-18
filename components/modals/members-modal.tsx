'use client';

import { MemberRole } from '@prisma/client';
import axios from 'axios';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { type ServerWithMembersWithProfiles } from '@/types';

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server?: ServerWithMembersWithProfiles };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      });
      const res = await axios.patch(url, { role });
      router.refresh();
      onOpen('members', { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      });
      const res = await axios.delete(url);
      router.refresh();
      onOpen('members', { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length ?? 0} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="mr-2 flex flex-col gap-y-1">
                <div className="flex items-center text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="mr-2 h-4 w-4" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.GUEST)
                                }
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                <span className="mr-2">Guest</span>
                                <Check
                                  className={cn(
                                    'invisible ml-auto h-4 w-4',
                                    member.role === MemberRole.GUEST &&
                                      'visible'
                                  )}
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.MODERATOR)
                                }
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                <span className="mr-2">Moderator</span>
                                <Check
                                  className={cn(
                                    'invisible ml-auto h-4 w-4',
                                    member.role === MemberRole.MODERATOR &&
                                      'visible'
                                  )}
                                />
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className="mr-2 h-4 w-4" />
                          <span>Kick</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
