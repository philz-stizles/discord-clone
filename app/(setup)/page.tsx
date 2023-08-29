import { redirect } from 'next/navigation';
import { getFirstServer } from '@/actions/servers';
import { getProfile } from '../../actions/profile';
import { InitialModal } from '@/components/modals/initial-modal';

type Props = {};

const SetupPage = async (props: Props) => {
  const profile = await getProfile();

  const server = await getFirstServer(profile.id);

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
