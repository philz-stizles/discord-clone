'use client';

import { useEffect, useState } from 'react';
import {
  CreateChannelModal,
  CreateServerModal,
  DeleteChannelModal,
  DeleteMessageModal,
  DeleteServerModal,
  EditChannelModal,
  EditServerModal,
  InviteModal,
  MembersModal,
  MessageFileModal,
} from '../modals';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <DeleteServerModal />
      <CreateChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
      <InviteModal />
      <MembersModal />
      <MessageFileModal />
    </>
  );
};

export default ModalProvider;
