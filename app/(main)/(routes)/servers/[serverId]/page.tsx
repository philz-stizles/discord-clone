import { getProfile } from '@/actions/profile';
import { getMemberServer } from '@/actions/servers';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    serverId: string;
  };
};

const ServerPage = async ({ params }: Props) => {
  const profile = await getProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const serverId = params.serverId;
  const server = await getMemberServer(serverId, profile.id);

  const initialChannel = server?.channels[0];
  if (initialChannel?.name !== 'general') {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
};

export default ServerPage;
