"use client";

import { useEffect } from "react";

interface HorizontalAdBannerProps {
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function HorizontalAdBanner({ className = "" }: HorizontalAdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1422077668654301"
        data-ad-slot="8071858219"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
