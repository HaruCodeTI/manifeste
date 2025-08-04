"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica para evitar SSR
const BotpressWebchat = dynamic(() => import('./BotpressWebchatComponent'), {
  ssr: false,
  loading: () => null,
});

export function BotpressChat() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <BotpressWebchat />;
} 