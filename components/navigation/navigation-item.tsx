'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { ActionTooltip } from '@/components/action-tooltip';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const router = useRouter();
  const params = useParams();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="group relative flex items-center" onClick={onClick}>
        <div
          className={cn(
            'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
            params?.serverId === id &&
              'rounded-[16px] bg-primary/10 text-primary'
          )}
        >
          <Image fill src={imageUrl} alt="Channel" className="object-cover" />
        </div>
      </button>
    </ActionTooltip>
  );
};
