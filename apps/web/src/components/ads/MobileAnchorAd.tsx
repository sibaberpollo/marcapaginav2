'use client';

import { useState } from 'react';

export default function MobileAnchorAd() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="lg:hidden fixed bottom-16 left-4 right-4 z-40">
      <div className="bg-white rounded-lg shadow-lg p-3 border border-surface-2 flex items-center justify-between">
        <div className="flex-1 bg-surface-2 rounded p-2 flex items-center justify-center min-h-[50px] border border-dashed border-brand-gray/30">
          <span className="text-xs text-brand-gray uppercase tracking-wider font-medium">
            Publicidad
          </span>
          {/* AdSense: Mobile Anchor */}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 p-1 text-brand-gray hover:text-black"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
