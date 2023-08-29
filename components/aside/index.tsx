import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getProfile } from '@/actions/profile';
import ServerItem from './server-item';
import AsideAction from './aside-action';
import { getMemberServers } from '@/actions/servers';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/ui/mode-toggle';

const Aside = async () => {
  const profile = await getProfile();
  if (!profile) {
    redirect('/');
  }

  const servers = await getMemberServers(profile.id);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <AsideAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <ServerItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Aside;
