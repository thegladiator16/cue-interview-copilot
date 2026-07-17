"use client";

import { useEffect, useState } from "react";
import { CallSessionRoom } from "./CallSessionRoom";
import { MobileSessionView } from "./MobileSessionView";

type Message = { id: string; role: "question" | "answer"; content: string };

type Props = {
  sessionId: string;
  company: string | null;
  role: string | null;
  initialMessages: Message[];
  initialSecondsUsed: number;
  allowedSeconds: number;
  isUnlimited: boolean;
  alreadyEnded: boolean;
};

export function SessionRoomResponsive(props: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);

    function onChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!mounted) {
    return <CallSessionRoom {...props} />;
  }

  if (isMobile) {
    return <MobileSessionView {...props} />;
  }

  return <CallSessionRoom {...props} />;
}
