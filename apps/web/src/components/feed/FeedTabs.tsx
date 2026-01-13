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
    <div className="flex items-center gap-1 bg-white dark:bg-surface rounded-lg p-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          aria-pressed={activeFilter === tab.id}
          className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeFilter === tab.id
              ? "bg-black text-white font-semibold"
              : "text-brand-gray hover:text-[#333333]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
