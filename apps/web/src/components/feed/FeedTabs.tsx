"use client";

export type FeedFilter = "todo" | "listas" | "narrativa" | "viajes" | "previews";

interface FeedTabsProps {
  activeFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
}

const tabs: { id: FeedFilter; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "listas", label: "Listas" },
  { id: "narrativa", label: "Narrativa" },
  { id: "viajes", label: "Viajes" },
  { id: "previews", label: "Previews" },
];

export default function FeedTabs({ activeFilter, onFilterChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide mb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          aria-pressed={activeFilter === tab.id}
          className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            activeFilter === tab.id
              ? "bg-black text-white"
              : "bg-surface text-brand-gray hover:text-[#333333] hover:bg-surface-2"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
