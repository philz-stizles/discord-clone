'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { ActionTooltip } from '../ui/action-tooltip';

type Props = {
  id: string;
  name: string;
  imageUrl: string;
};

const ServerItem = ({ id, name, imageUrl }: Props) => {
  const params = useParams();
  const router = useRouter();

  const activeServerId = params?.serverId;

  const handleNavigateToServer = (id: string) => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={() => handleNavigateToServer(id)}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            activeServerId !== id && 'group-hover:h-[20px]',
            activeServerId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            activeServerId === id && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default ServerItem;
