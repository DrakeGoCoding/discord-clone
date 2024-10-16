'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface ActionTooltipProps {
  label: string;
  children: React.ReactNode;
  side?: 'bottom' | 'left' | 'right' | 'top';
  align?: 'center' | 'start' | 'end';
}

export const ActionTooltip = ({
  label,
  children,
  side = 'bottom',
  align = 'center'
}: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={3}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="text-sm font-semibold capitalize">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
