import FeedTabs from './FeedTabs';
import FeaturedHoroscopePost from './FeaturedHoroscopePost';
import FeaturedMapPost from './FeaturedMapPost';
import FeaturedRecipePost from './FeaturedRecipePost';
import LatestNarrativaPost from './LatestNarrativaPost';
import PostCard from './PostCard';
import ListCard from './ListCard';
import MemeCard from './MemeCard';

export default function Feed() {
  return (
    <div className="space-y-4">
      <FeedTabs />

      {/* Lista destacada - 5 arranques */}
      <ListCard
        title="5 arranques que te obligan a seguir leyendo"
        excerpt="A diferencia de la novela, el cuento no tiene tiempo para calentar motores. Cada palabra cuenta."
        author="Redacción Marcapágina"
        timeAgo="hace 1h"
        tags={['cuentos', 'listas', 'inicios']}
        readTime="3 min"
        slug="5-arranques-que-te-obligan-a-seguir-leyendo"
        itemCount={5}
      />

      {/* Horóscopo Literario - Enero 2026 */}
      <FeaturedHoroscopePost
        signName="Capricornio"
        signSymbol="♑"
        author="Edgar Allan Poe"
        authorImage="https://res.cloudinary.com/dx98vnos1/image/upload/v1767953685/Poe_bejcvr.png"
        month="Enero 2026"
        excerpt="Capricornio en su forma más oscura y disciplinada: Poe construyó catedrales de terror con la precisión de un arquitecto obsesivo."
      />

      {/* Featured Recipe - El viejo y el ron */}
      <FeaturedRecipePost
        title="El viejo y el ron"
        excerpt="Ernest Hemingway y el mojito cubano: una receta literaria donde el ron, la menta y la genialidad se mezclan en cada sorbo."
        author="Mirco Ferri"
        date="11 Jun"
        readTime="6 min"
        slug="el-viejo-y-el-ron"
        badge="A pie de página"
        recipeType="drink"
      />

      {/* Featured Travel Guide */}
      <FeaturedMapPost
        title="La París de Hemingway"
        excerpt="Una guía literaria para caminar, beber y leer. París fue para Ernest Hemingway algo más que una ciudad: fue su escuela, su refugio y su escenario."
        author="Redacción Marcapágina"
        date="5 Ene"
        readTime="8 min"
        slug="la-paris-de-hemingway"
        badge="A pie de página"
      />

      {/* Lista destacada */}
      <ListCard
        title="10 propósitos literarios de Año Nuevo"
        excerpt="Leer por placer, abandonar libros sin culpa, no fingir que entendiste ese libro... Una lista de buenos propósitos lectores."
        author="Redacción Marcapágina"
        timeAgo="hace 1h"
        tags={['humor', 'listas', 'lectura']}
        readTime="2 min"
        slug="10-propositos-literarios-de-ano-nuevo"
        itemCount={10}
      />

      {/* Posts */}
      <PostCard
        title="Manual de usuario para comenzar a leer"
        excerpt="Pensando siempre en nuestro entusiasta público, ofrecemos a continuación una sencilla guía para entender el funcionamiento de estos aparatos y participar del ritual pagano de la lectura."
        author="Hazael Valecillos"
        timeAgo="hace 3h"
        tags={['ensayo', 'humor', 'lectura']}
        readTime="6 min"
        slug="manual-de-usuario-para-comenzar-a-leer"
      />

      {/* Más listas */}
      <ListCard
        title="Cómo identificar a un lector tóxico"
        excerpt="Dice que 'esto ya lo hizo Borges', menciona a Bolaño en cualquier conversación y desprecia los best sellers sin haberlos leído."
        author="Redacción Marcapágina"
        timeAgo="hace 2h"
        tags={['humor', 'listas', 'sátira']}
        readTime="2 min"
        slug="como-identificar-a-un-lector-toxico"
        itemCount={10}
      />

      {/* Meme en el centro del feed */}
      <MemeCard
        title="Los chapulines salvajes"
        imageUrl="https://res.cloudinary.com/dx98vnos1/image/upload/v1750790673/post-chapulines-salvajes_wipmms.png"
        alt="Los chapulines salvajes - Parodia de Los detectives salvajes"
        slug="los-chapulines-salvajes"
      />

      {/* Latest Narrativa/Transtextos Post */}
      <LatestNarrativaPost />

      <ListCard
        title="Si los géneros literarios fueran personas en una fiesta"
        excerpt="La novela policial pregunta dónde estabas anoche. La poesía llega tarde y huele a lluvia."
        author="Redacción Marcapágina"
        timeAgo="hace 4h"
        tags={['humor', 'géneros-literarios']}
        readTime="1 min"
        slug="si-los-generos-literarios-fueran-personas-en-una-fiesta"
        itemCount={5}
      />

      <ListCard
        title="Trastornos literarios no reconocidos por la OMS"
        excerpt="Del síndrome del subrayador compulsivo a la dependencia emocional de las reseñas de Goodreads."
        author="Redacción Marcapágina"
        timeAgo="hace 5h"
        tags={['humor', 'listas', 'sátira']}
        readTime="3 min"
        slug="trastornos-literarios-no-reconocidos-por-la-oms"
        itemCount={5}
      />
    </div>
  );
}
