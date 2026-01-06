export default function InFeedAd() {
  return (
    <div className="bg-white rounded-lg p-5 border border-surface-2">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-surface rounded-lg">
          <svg className="w-5 h-5 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider">
            Patrocinado
          </span>
          <div className="bg-surface-2 rounded-lg mt-2 p-4 flex items-center justify-center min-h-[100px] border border-dashed border-brand-gray/30">
            <span className="text-xs text-brand-gray uppercase tracking-wider font-medium">
              Publicidad In-Feed
            </span>
            {/* AdSense: In-Feed Native */}
          </div>
        </div>
      </div>
    </div>
  );
}
