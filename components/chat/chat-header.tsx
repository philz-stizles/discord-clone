import { Hash } from 'lucide-react';
import { string } from 'zod';
import ChatVideoButton from './chat-video-button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { SocketIndicator } from '@/components/ui/socket-indicator';
import { MobileToggle } from '@/components/ui/mobile-toggle';

type Props = {
  name: string;
  serverId: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
};

const ChatHeader = ({name, type, serverId, imageUrl}: Props) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
