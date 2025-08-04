"use client";

import { useState } from 'react';
import {
  Webchat,
  WebchatProvider,
  Fab,
  getClient,
  Configuration,
} from '@botpress/webchat';

const clientId = "023bdfde-0f4d-4ca7-8de4-eb5ecebeef54";

const configuration: Configuration = {
  color: '#7b61ff',
};

export function BotpressChat() {
  const client = getClient({
    clientId,
  });

  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <WebchatProvider client={client} configuration={configuration}>
      <Fab onClick={toggleWebchat} />
      <div
        style={{
          display: isWebchatOpen ? 'block' : 'none',
        }}
      >
        <Webchat />
      </div>
    </WebchatProvider>
  );
} 