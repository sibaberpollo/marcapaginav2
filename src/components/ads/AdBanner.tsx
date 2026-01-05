type AdSize = 'leaderboard' | 'medium-rectangle' | 'skyscraper' | 'in-feed' | 'mobile-anchor';

interface AdBannerProps {
  size: AdSize;
  className?: string;
}

const sizeClasses: Record<AdSize, string> = {
  leaderboard: 'min-h-[90px] md:min-h-[90px]',
  'medium-rectangle': 'min-h-[250px]',
  skyscraper: 'min-h-[600px]',
  'in-feed': 'min-h-[100px]',
  'mobile-anchor': 'min-h-[50px]',
};

const adComments: Record<AdSize, string> = {
  leaderboard: 'Responsive Leaderboard',
  'medium-rectangle': '300x250 Medium Rectangle',
  skyscraper: '160x600 Wide Skyscraper',
  'in-feed': 'In-Feed Native',
  'mobile-anchor': 'Mobile Anchor',
};

export default function AdBanner({ size, className = '' }: AdBannerProps) {
  return (
    <div
      className={`bg-surface-2 rounded-lg p-4 flex items-center justify-center border border-dashed border-brand-gray/30 ${sizeClasses[size]} ${className}`}
    >
      <div className="text-center">
        <span className="text-xs text-brand-gray uppercase tracking-wider font-medium">
          Publicidad
        </span>
        {/* AdSense: {adComments[size]} */}
        {/*
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXX"
            data-ad-slot="XXXXXXX"
            data-ad-format="auto"
          />
        */}
      </div>
    </div>
  );
}
