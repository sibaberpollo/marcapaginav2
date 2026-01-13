"use client";

import { useState } from "react";
import FeedTabs, { type FeedFilter } from "./FeedTabs";
import FeaturedHoroscopePost from "./FeaturedHoroscopePost";
import FeaturedMapPost from "./FeaturedMapPost";
import FeaturedPreviewPost from "./FeaturedPreviewPost";
import FeaturedRecipePost from "./FeaturedRecipePost";
import PostCard from "./PostCard";
import ListCard from "./ListCard";
import MemeCard from "./MemeCard";

interface FeedProps {
  latestNarrativaPost: React.ReactNode;
}

export default function Feed({ latestNarrativaPost }: FeedProps) {
  const [filter, setFilter] = useState<FeedFilter>("todo");

  const showAll = filter === "todo";
  const showListas = showAll || filter === "listas";
  const showNarrativa = showAll || filter === "narrativa";
  const showViajes = showAll || filter === "viajes";
  const showPreviews = showAll || filter === "previews";

  return (
    <div className="space-y-4">
      <FeedTabs activeFilter={filter} onFilterChange={setFilter} />

      {/* Latest Narrativa/Transtextos Post */}
      {showNarrativa && latestNarrativaPost}

      {/* Featured Preview - Alta Pureza */}
      {showPreviews && (
        <FeaturedPreviewPost
          title="Alta Pureza"
          author="Marianne Díaz Hernández"
          genre="Thriller"
          excerpt="Una novela que comienza con el hallazgo de un cadáver en una hacienda del páramo andino y sigue la investigación de Ana, una abogada venezolana que enfrenta más de un misterio."
          coverImage="https://public-files.gumroad.com/xgdjeqtl5792s8io16abkoshyx1u"
          slug="alta-pureza"
          chaptersCount={3}
        />
      )}

      {/* Lista destacada - 5 arranques */}
      {showListas && (
        <ListCard
          title="5 arranques que te obligan a seguir leyendo"
          excerpt="A diferencia de la novela, el cuento no tiene tiempo para calentar motores. Cada palabra cuenta."
          author="Redacción Marcapágina"
          timeAgo="hace 1h"
          tags={["cuentos", "listas", "inicios"]}
          readTime="3 min"
          slug="5-arranques-que-te-obligan-a-seguir-leyendo"
          itemCount={5}
        />
      )}

      {/* Horóscopo Literario - Enero 2026 */}
      {showAll && (
        <FeaturedHoroscopePost
          signName="Capricornio"
          signSymbol="♑"
          author="Edgar Allan Poe"
          authorImage="https://res.cloudinary.com/dx98vnos1/image/upload/v1767953685/Poe_bejcvr.png"
          excerpt="Capricornio en su forma más oscura y disciplinada: Poe construyó catedrales de terror con la precisión de un arquitecto obsesivo."
        />
      )}

      {/* Featured Recipe - El viejo y el ron */}
      {showViajes && (
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
      )}

      {/* Featured Travel Guide */}
      {showViajes && (
        <FeaturedMapPost
          title="La París de Hemingway"
          excerpt="Una guía literaria para caminar, beber y leer. París fue para Ernest Hemingway algo más que una ciudad: fue su escuela, su refugio y su escenario."
          author="Redacción Marcapágina"
          date="5 Ene"
          readTime="8 min"
          slug="la-paris-de-hemingway"
          badge="A pie de página"
        />
      )}

      {/* Lista destacada */}
      {showListas && (
        <ListCard
          title="10 propósitos literarios de Año Nuevo"
          excerpt="Leer por placer, abandonar libros sin culpa, no fingir que entendiste ese libro... Una lista de buenos propósitos lectores."
          author="Redacción Marcapágina"
          timeAgo="hace 1h"
          tags={["humor", "listas", "lectura"]}
          readTime="2 min"
          slug="10-propositos-literarios-de-ano-nuevo"
          itemCount={10}
        />
      )}

      {/* Posts */}
      {showAll && (
        <PostCard
          title="Manual de usuario para comenzar a leer"
          excerpt="Pensando siempre en nuestro entusiasta público, ofrecemos a continuación una sencilla guía para entender el funcionamiento de estos aparatos y participar del ritual pagano de la lectura."
          author="Hazael Valecillos"
          timeAgo="hace 3h"
          tags={["ensayo", "humor", "lectura"]}
          readTime="6 min"
          slug="manual-de-usuario-para-comenzar-a-leer"
        />
      )}

      {/* Más listas */}
      {showListas && (
        <ListCard
          title="Cómo identificar a un lector tóxico"
          excerpt="Dice que 'esto ya lo hizo Borges', menciona a Bolaño en cualquier conversación y desprecia los best sellers sin haberlos leído."
          author="Redacción Marcapágina"
          timeAgo="hace 2h"
          tags={["humor", "listas", "sátira"]}
          readTime="2 min"
          slug="como-identificar-a-un-lector-toxico"
          itemCount={10}
        />
      )}

      {/* Meme en el centro del feed */}
      {showAll && (
        <MemeCard
          title="Los chapulines salvajes"
          imageUrl="https://res.cloudinary.com/dx98vnos1/image/upload/v1750790673/post-chapulines-salvajes_wipmms.png"
          alt="Los chapulines salvajes - Parodia de Los detectives salvajes"
          slug="los-chapulines-salvajes"
        />
      )}

      {showListas && (
        <ListCard
          title="Si los géneros literarios fueran personas en una fiesta"
          excerpt="La novela policial pregunta dónde estabas anoche. La poesía llega tarde y huele a lluvia."
          author="Redacción Marcapágina"
          timeAgo="hace 4h"
          tags={["humor", "géneros-literarios"]}
          readTime="1 min"
          slug="si-los-generos-literarios-fueran-personas-en-una-fiesta"
          itemCount={5}
        />
      )}

      {showListas && (
        <ListCard
          title="Trastornos literarios no reconocidos por la OMS"
          excerpt="Del síndrome del subrayador compulsivo a la dependencia emocional de las reseñas de Goodreads."
          author="Redacción Marcapágina"
          timeAgo="hace 5h"
          tags={["humor", "listas", "sátira"]}
          readTime="3 min"
          slug="trastornos-literarios-no-reconocidos-por-la-oms"
          itemCount={5}
        />
      )}
    </div>
  );
}
