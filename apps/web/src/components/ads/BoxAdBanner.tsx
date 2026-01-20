"use client";

import { useEffect } from "react";

interface BoxAdBannerProps {
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function BoxAdBanner({ className = "" }: BoxAdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full max-w-[336px] mx-auto ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1422077668654301"
        data-ad-slot="9677897006"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
