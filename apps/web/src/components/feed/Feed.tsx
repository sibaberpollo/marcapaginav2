import FeedTabs from './FeedTabs';
import FeaturedMapPost from './FeaturedMapPost';
import LatestNarrativaPost from './LatestNarrativaPost';
import PostCard from './PostCard';
import ListCard from './ListCard';
import MemeCard from './MemeCard';

export default function Feed() {
  return (
    <div className="space-y-4">
      <FeedTabs />

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
        badge="A pie de página"
      />

      {/* Lista destacada */}
      <ListCard
        title="10 propósitos literarios de Año Nuevo"
        excerpt="Leer por placer, abandonar libros sin culpa, no fingir que entendiste ese libro... Una lista de buenos propósitos lectores."
        author="Redacción Marcapágina"
        authorColor="bg-amber-200"
        timeAgo="hace 1h"
        tags={['humor', 'listas', 'lectura']}
        likes={0}
        comments={0}
        readTime="2 min"
        slug="10-propositos-literarios-de-ano-nuevo"
        itemCount={10}
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
        slug="manual-de-usuario-para-comenzar-a-leer"
      />

      {/* Más listas */}
      <ListCard
        title="Cómo identificar a un lector tóxico"
        excerpt="Dice que 'esto ya lo hizo Borges', menciona a Bolaño en cualquier conversación y desprecia los best sellers sin haberlos leído."
        author="Redacción Marcapágina"
        authorColor="bg-rose-200"
        timeAgo="hace 2h"
        tags={['humor', 'listas', 'sátira']}
        likes={0}
        comments={0}
        readTime="2 min"
        slug="como-identificar-a-un-lector-toxico"
        itemCount={10}
      />

      {/* Meme en el centro del feed */}
      <MemeCard
        title="Chapulines salvajes"
        imageUrl="https://res.cloudinary.com/dx98vnos1/image/upload/v1750790673/post-chapulines-salvajes_wipmms.png"
        alt="Chapulines salvajes en marcha"
      />

      {/* Latest Narrativa/Transtextos Post */}
      <LatestNarrativaPost />

      <ListCard
        title="Si los géneros literarios fueran personas en una fiesta"
        excerpt="La novela policial pregunta dónde estabas anoche. La poesía llega tarde y huele a lluvia."
        author="Redacción Marcapágina"
        authorColor="bg-violet-200"
        timeAgo="hace 4h"
        tags={['humor', 'géneros-literarios']}
        likes={0}
        comments={0}
        readTime="1 min"
        slug="si-los-generos-literarios-fueran-personas-en-una-fiesta"
        itemCount={5}
      />

      <ListCard
        title="Trastornos literarios no reconocidos por la OMS"
        excerpt="Del síndrome del subrayador compulsivo a la dependencia emocional de las reseñas de Goodreads."
        author="Redacción Marcapágina"
        authorColor="bg-teal-200"
        timeAgo="hace 5h"
        tags={['humor', 'listas', 'sátira']}
        likes={0}
        comments={0}
        readTime="3 min"
        slug="trastornos-literarios-no-reconocidos-por-la-oms"
        itemCount={5}
      />
    </div>
  );
}
