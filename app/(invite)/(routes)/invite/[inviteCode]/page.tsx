import { currentProfile } from '@/actions/profile';
import { prismaClient } from '@/lib/prisma';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    inviteCode: string;
  };
};

const InvitePage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  if (!params.inviteCode) {
    return redirect('/');
  }
  
  const existingServer = await prismaClient.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await prismaClient.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InvitePage;
