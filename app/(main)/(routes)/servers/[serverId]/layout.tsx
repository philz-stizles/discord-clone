import { currentProfile } from '@/actions/profile';
import { ServerAside } from '@/components/server/server-aside';
import { prismaClient } from '@/lib/prisma';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
};

const ServerLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const serverId = params.serverId;

  const server = await prismaClient.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerAside serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
