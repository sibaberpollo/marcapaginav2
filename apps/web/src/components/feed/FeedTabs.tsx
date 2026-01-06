'use client';

import { useState } from 'react';

const tabs = ['Para ti'];

export default function FeedTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg p-1">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setActiveTab(index)}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === index
              ? 'bg-black text-white font-semibold'
              : 'text-brand-gray hover:text-black hover:bg-surface'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
