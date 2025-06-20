'use client';

import { Fragment, useRef } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { format } from 'date-fns';

import { Member } from '@prisma/client';
import { ChatWelcome, ChatItem } from './';
import { MessageWithMemberWithProfile } from '@/types';
import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatSocket } from '@/hooks/use-chat-socket';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type Props = {
  member: Member;
  name: string;
  chatId: string;
  type: 'channel' | 'conversation';
  apiUrl: string;
  socketUrl: string;
  socketQuery: {
    channelId: string;
    serverId: string;
  };
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
};

const ChatMessages = ({
  type,
  name,
  chatId,
  member,
  socketUrl,
  socketQuery,
  apiUrl,
  paramKey,
  paramValue,
}: Props) => {
  const chatRef = useRef(null);
  const bottomRef = useRef(null);
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
     useChatSocket({ queryKey, addKey, updateKey });

    if (status === 'loading') {
      return (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Loading messages...
          </p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="flex flex-col flex-1 justify-center items-center">
          <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Something went wrong!
          </p>
        </div>
      );
    }


  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                isDeleted={message.isDeleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
