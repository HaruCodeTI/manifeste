"use client";

import { useState } from 'react';
import {
  Webchat,
  Fab,
  useWebchat,
} from '@botpress/webchat';

const clientId = "023bdfde-0f4d-4ca7-8de4-eb5ecebeef54";

export default function BotpressWebchatComponent() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const { client, messages, participants, isTyping, error, clientState } = useWebchat({
    clientId,
  });

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  if (error) {
    console.error('Webchat error:', error);
    return null;
  }

  return (
    <>
      <Fab onClick={toggleWebchat} />
      {isWebchatOpen && (
        <Webchat
          clientId={clientId}
          configuration={{
            color: '#7b61ff',
          }}
        />
      )}
    </>
  );
} 