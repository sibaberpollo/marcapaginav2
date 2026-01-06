import FeedTabs from './FeedTabs';
import FeaturedPost from './FeaturedPost';
import FeaturedMapPost from './FeaturedMapPost';
import LatestNarrativaPost from './LatestNarrativaPost';
import PostCard from './PostCard';
import NewsCard from './NewsCard';
import AdBanner from '../ads/AdBanner';
import InFeedAd from '../ads/InFeedAd';

/*
const posts = [
  {
    title: 'Los pájaros que vimos aquel verano',
    excerpt:
      'Mi abuela decía que los pájaros conocen el futuro. Que por eso cantan al amanecer, para advertirnos de lo que viene...',
    author: 'Lucía Mbomío',
    authorColor: 'bg-purple-200',
    timeAgo: 'hace 2h',
    tags: ['cuento', 'memoria'],
    likes: 87,
    comments: 12,
    readTime: '5 min',
  },
  {
    title: 'Instrucciones para desaparecer',
    excerpt:
      'Primero: elige un día cualquiera, preferiblemente martes. Los martes nadie presta atención. Segundo: no te despidas...',
    author: 'Daniel Monedero',
    authorColor: 'bg-green-200',
    timeAgo: 'hace 5h',
    tags: ['microrrelato', 'experimental'],
    likes: 56,
    comments: 8,
    readTime: '3 min',
  },
  {
    title: 'El último café del mundo',
    excerpt:
      'Cuando cerraron la última cafetería de la ciudad, nos quedamos sin lugares donde ser extraños juntos...',
    author: 'Carmen Laforet Jr.',
    authorColor: 'bg-orange-200',
    timeAgo: 'hace 8h',
    tags: ['cuento', 'nostalgia'],
    likes: 43,
    comments: 5,
    readTime: '6 min',
  },
  {
    title: 'Cartografía de lo invisible',
    excerpt:
      'Hay mapas que no existen en ningún atlas. Mi padre los dibujaba en servilletas de bar: el camino exacto del silencio...',
    author: 'Andrés Neuman',
    authorColor: 'bg-blue-200',
    timeAgo: 'hace 12h',
    tags: ['poesía', 'padre'],
    likes: 98,
    comments: 14,
    readTime: '4 min',
  },
];
*/
export default function Feed() {
  return (
    <div className="space-y-4">
      <FeedTabs />

      {/* Ad: Top Leaderboard */}
      <AdBanner size="leaderboard" />

      {/* Featured Travel Guide */}
      <FeaturedMapPost
        title="La París de Hemingway"
        excerpt="Una guía literaria para caminar, beber y leer. París fue para Ernest Hemingway algo más que una ciudad: fue su escuela, su refugio y su escenario."
        author="Redacción Marcapágina"
        date="5 Ene"
        likes={0}
        comments={0}
        readTime="8 min"
        slug="la-paris-de-hemingway"
        badge="🗺️ A pie de página"
      />

      {/* Posts */}
      <PostCard
        title="Manual de usuario para comenzar a leer"
        excerpt="Pensando siempre en nuestro entusiasta público, ofrecemos a continuación una sencilla guía para entender el funcionamiento de estos aparatos y participar del ritual pagano de la lectura."
        author="Hazael Valecillos"
        authorColor="bg-purple-200"
        timeAgo="hace 3h"
        tags={['ensayo', 'humor', 'lectura']}
        likes={124}
        comments={18}
        readTime="6 min"
      />

      {/* Posts 
      <PostCard {...posts[0]} />
      <PostCard {...posts[1]} />
    */}
      {/* In-Feed Ad */}
      <InFeedAd />

      {/* Latest Narrativa/Transtextos Post */}
      <LatestNarrativaPost />

      {/* News Card
      <NewsCard
        category="Premios"
        title='El Premio Nacional de Narrativa 2026 recae en María Fernández por "Cielos de Ceniza"'
        date="3 Ene 2026"
      />
      */}
      {/*
      <PostCard {...posts[2]} />
      <PostCard {...posts[3]} />
      */}
      {/* Load More Button 
      <button className="btn btn-ghost w-full bg-white border border-surface-2 hover:border-brand-gray/30 text-brand-gray hover:text-black">
        Cargar más publicaciones
      </button>
      */}

      {/* Ad: Bottom Leaderboard */}
      <AdBanner size="leaderboard" className="md:min-h-[250px]" />
    </div>
  );
}
