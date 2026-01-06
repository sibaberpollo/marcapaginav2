import Link from 'next/link';
import AdBanner from '@/components/ads/AdBanner';

// Datos de ejemplo - en producción vendrían de una API/CMS
const article = {
  title: 'Manual de usuario para comenzar a leer',
  author: {
    name: 'Hazael Valecillos',
    handle: '@hazaelvv',
    avatar: 'bg-purple-200',
  },
  date: '5 Enero 2026',
  readTime: '6 min',
  tags: ['ensayo', 'humor', 'lectura'],
  featured: true,
};

export default function ArticlePage() {
  return (
    <main className="pt-14 min-h-screen pb-20 lg:pb-0">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header del artículo */}
        <header className="mb-8">
          {article.featured && (
            <span className="inline-block px-3 py-1 bg-brand-yellow text-brand-black text-xs font-bold uppercase tracking-wider rounded mb-4">
              Destacado
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-4 pb-6 border-b border-surface-2">
            <div className={`w-12 h-12 ${article.author.avatar} rounded-full`}></div>
            <div className="flex-1">
              <div className="font-semibold">{article.author.name}</div>
              <div className="text-sm text-brand-gray">{article.author.handle}</div>
            </div>
            <div className="text-right text-sm text-brand-gray">
              <div>{article.date}</div>
              <div>{article.readTime} de lectura</div>
            </div>
          </div>
        </header>

        {/* Contenido del artículo */}
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-brand-gray mb-6">
            Durante los últimos años, hemos visto con creciente preocupación cómo nuestros centros comerciales han dado espacio a tiendas que, entre el local de ropa íntima y el de perfumes, ofrecen pilas y pilas de objetos paralelepípedos<sup><a href="#nota-1" id="ref-1" className="text-brand-yellow hover:underline">[1]</a></sup> -perturbadoramente similares entre sí- bajo el rótulo de librería. Pensando siempre en nuestro entusiasta público, ofrecemos a continuación una sencilla guía para entender el funcionamiento de estos aparatos y, así, lograr pasar frente a sus vidrieras sin esa mezcla de enojo y extrañeza en el rostro e, incluso, para los más aventurados, participar del ritual pagano de la lectura.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Paso 1: Reconocer un libro</h2>
          <p className="leading-relaxed mb-6">
            Cualquiera que haya visto un iPad o, siendo más mundanos, un ladrillo, reconocerá con suma facilidad un libro. Con su ya identificada forma de paralelepípedo, su grosor es variable y directamente proporcional a la extensión. Para apreciarlo en su justa medida es necesario correr la primer capa, la más gruesa, e ir decodificando<sup><a href="#nota-2" id="ref-2" className="text-brand-yellow hover:underline">[2]</a></sup> su contenido que, por lo general, se hará de arriba hacia abajo y de izquierda a derecha. Aunque estos objetos nos parezcan extraños, las estadísticas sugieren que todo ser humano tiene contacto con uno por lo menos tres veces en su vida y, lo que es más impactante, al menos el 50% de las personas tiene uno en su casa. Así que levántese, examine su casa, busque bajo el sofá chueco, detrás del portarretrato roto, y de seguro encontrará un libro.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Paso 2: Adquirir el libro</h2>
          <p className="leading-relaxed mb-6">
            A pesar de la cantidad de libros que se pueden encontrar en las tenebrosas profundidades de las librerías, es importante aclarar que NO todos ofrecen la misma calidad. Se evitará en todo momento la selección del libro en los estantes que lleven los rótulos de: Autoayuda, Bestseller, Sagas de mayor venta y parecidos. En última instancia, es la experiencia la que determinará cuál libro es SU libro. Asimismo, es recomendable decodificar la última capa para hacerse una idea de si la información allí presente satisface nuestra curiosidad.
          </p>

          {/* Ad en medio del artículo */}
          <div className="my-10">
            <AdBanner size="leaderboard" />
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Paso 3: Comenzar a leer</h2>
          <p className="leading-relaxed mb-6">
            Éste es fundamental, pues su incorrecta realización impedirá los siguientes pasos. Para cumplirlo debe realizarse un complejo proceso de decodificación (en adelante leer), consistente en encadenar un símbolo o letra con la siguiente y así completar un número suficiente para generar lo que se denomina una palabra, la suma de éstas hará la oración, luego el párrafo y así sucesivamente. Es importante aclarar que dicha decodificación no obliga a la comprensión, estadio mayor de la lectura.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Paso 4: Disfrutar el libro</h2>
          <p className="leading-relaxed mb-6">
            Como todo ejercicio del espíritu, leer implica unas condiciones adecuadas para que se logre el total disfrute de esta práctica. Recomendamos, por ello, evitar los grandes éxitos del reguetón, los capítulos repetidos de Glee, o cualquier contaminación auditiva que perturbe nuestra concentración. En contraste, el lugar puede ser elegido al azar, siendo particularmente propicios el transporte público, las colas de banco, la oficina y el infaltable baño<sup><a href="#nota-3" id="ref-3" className="text-brand-yellow hover:underline">[3]</a></sup>. Vale advertir que el disfrute puede ir acompañado de una paulatina amplitud de criterio y el incómodo desarrollo de una visión crítica de la realidad, así que tome las precauciones necesarias.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Paso 5: La peor parte, cerrar el libro</h2>
          <p className="leading-relaxed mb-6">
            Si hemos seguido todos los pasos al pie de la letra, llegará el momento en que nos encontremos con el final del libro y, así, con la conclusión de nuestra lectura. Pocos momentos resultan tan desoladores... La sensación de vacío y soledad es tan desgarradora que sólo puede combatirse reiniciando el proceso, pero con otro libro. Siguiendo esta práctica una y otra vez, nos convertiremos en un usuario patológico de libros, un adicto, un esclavo de la lectura, nos convertiremos en una de las criaturas más perversas que existen sobre la faz de la tierra: un lector.<sup><a href="#nota-4" id="ref-4" className="text-brand-yellow hover:underline">[4]</a></sup>
          </p>
        </div>

        {/* Notas al pie */}
        <footer className="mt-12 pt-8 border-t border-surface-2">
          <h3 className="text-lg font-bold mb-4">Notas</h3>
          <div className="space-y-4 text-sm text-brand-gray">
            <p id="nota-1">
              <strong>[1]</strong> Dícese de la figura geométrica tridimensional que corresponde al libro, aunque en ocasiones también se puede acercar al cubo, pero jamás a la pirámide. En adelante estos paralelepípedos se identificarán como libros. <a href="#ref-1" className="badge bg-brand-black text-brand-yellow border-none text-xs hover:bg-brand-gray">Volver</a>
            </p>
            <p id="nota-2">
              <strong>[2]</strong> Ver paso tres para la adecuada comprensión de este término. <a href="#ref-2" className="badge bg-brand-black text-brand-yellow border-none text-xs hover:bg-brand-gray">Volver</a>
            </p>
            <p id="nota-3">
              <strong>[3]</strong> Se debe hacer una clara diferenciación entre el baño -a secas- y el baño de oficina, pues se trata de dos experiencias completamente distintas. <a href="#ref-3" className="badge bg-brand-black text-brand-yellow border-none text-xs hover:bg-brand-gray">Volver</a>
            </p>
            <p id="nota-4">
              <strong>[4]</strong> En un próximo número abordaremos la terminología básica del lector, y exploraremos términos como bibliómano, bibliofilia, entre otros. <a href="#ref-4" className="badge bg-brand-black text-brand-yellow border-none text-xs hover:bg-brand-gray">Volver</a>
            </p>
          </div>
        </footer>

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-surface-2">
          <div className="flex items-center gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="px-3 py-1 bg-surface text-sm rounded-full hover:bg-surface-2 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Acciones del artículo */}
        <div className="mt-8 flex items-center justify-between py-4 border-t border-b border-surface-2">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-brand-gray hover:text-red-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">124</span>
            </button>
            <button className="flex items-center gap-2 text-brand-gray hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">18</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-brand-gray hover:text-black transition-colors" title="Guardar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button className="p-2 text-brand-gray hover:text-black transition-colors" title="Compartir">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Autor bio */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-surface-2">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 ${article.author.avatar} rounded-full flex-shrink-0`}></div>
            <div>
              <h3 className="font-bold text-lg">{article.author.name}</h3>
              <p className="text-sm text-brand-gray mb-3">{article.author.handle}</p>
              <p className="text-sm text-brand-gray">
                Escritor, lector empedernido y coleccionista de libros que nunca terminará de leer.
                Cree firmemente que la lectura es el único vicio que debería fomentarse.
              </p>
              <button className="mt-4 btn btn-sm bg-brand-black text-brand-white hover:bg-brand-gray">
                Seguir
              </button>
            </div>
          </div>
        </div>

        {/* Ad final */}
        <div className="mt-8">
          <AdBanner size="leaderboard" className="md:min-h-[250px]" />
        </div>

        {/* Artículos relacionados */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Más artículos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Los pájaros que vimos aquel verano', author: 'Lucía Mbomío', color: 'bg-purple-200' },
              { title: 'Instrucciones para desaparecer', author: 'Daniel Monedero', color: 'bg-green-200' },
              { title: 'El último café del mundo', author: 'Carmen Laforet Jr.', color: 'bg-orange-200' },
              { title: 'Cartografía de lo invisible', author: 'Andrés Neuman', color: 'bg-blue-200' },
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                className="p-4 bg-white rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-6 h-6 ${item.color} rounded-full`}></div>
                  <span className="text-sm text-brand-gray">{item.author}</span>
                </div>
                <h3 className="font-semibold group-hover:text-brand-gray transition-colors">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
