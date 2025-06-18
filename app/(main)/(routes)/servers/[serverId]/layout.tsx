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

  // const server = await prismaClient.server.findUnique({
  //   where: {
  //     id: serverId,
  //     members: {
  //       some: {
  //         profileId: profile.id,
  //       },
  //     },
  //   },
  // });

  const server = await prismaClient.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
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
        <ServerAside server={server} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
