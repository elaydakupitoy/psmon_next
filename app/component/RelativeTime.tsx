"use client";

import { useEffect, useState } from "react";

type RelativeTimeProps = {
  timestamp: string | number | Date;
};

function getShortRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  if (diff < 2629800) return `${Math.floor(diff / 604800)}w`;
  if (diff < 31557600) return `${Math.floor(diff / 2629800)}mo`;

  return `${Math.floor(diff / 31557600)}y`;
}

export default function RelativeTime({ timestamp }: RelativeTimeProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      setTime(getShortRelativeTime(new Date(timestamp)));
    }

    updateTime();
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{time}</span>;
}