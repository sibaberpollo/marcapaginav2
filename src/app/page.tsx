import { LeftSidebar, RightSidebar, Feed } from '@/components';

export default function Home() {
  return (
    <main className="pt-14 min-h-screen pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[240px_1fr_320px] gap-6">
          <LeftSidebar />
          <Feed />
          <RightSidebar />
        </div>
      </div>
    </main>
  );
}
