"use client";

import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import ResendLinkButton from "./ResendLinkButton";

interface ResendTimerProps {
  resendAvailableAt: string;
  verificationId: string;
}

export default function ResendTimer({
  resendAvailableAt,
  verificationId,
}: ResendTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const targetTime = new Date(resendAvailableAt).getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;
      return Math.max(0, Math.floor(difference / 1000));
    };

    setSecondsLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const currentDifference = calculateTimeLeft();
      setSecondsLeft(currentDifference);

      if (currentDifference <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resendAvailableAt]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  if (secondsLeft === null) {
    return (
      <div className="px-lg">
        <CircularProgress size="1rem" aria-label="Loading…" />
      </div>
    );
  }

  if (secondsLeft === 0) {
    return <ResendLinkButton verificationId={verificationId} />;
  }

  return (
    <span>
      Resend link in <strong>{formatTime(secondsLeft)}</strong>
    </span>
  );
}
