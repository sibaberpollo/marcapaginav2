import type { ZodiacSign, HoroscopoData, LiteraryTexts, ImplementedSignSlug } from './types/horoscope';

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    date: 'MAR 21-ABR 19',
    slug: 'aries',
    symbol: '♈',
    image: '/static/images/horoscope/aries.png',
  },
  {
    name: 'Tauro',
    date: 'ABR 20-MAY 20',
    slug: 'tauro',
    symbol: '♉',
    image: '/static/images/horoscope/tauro.png',
  },
  {
    name: 'Géminis',
    date: 'MAY 21-JUN 20',
    slug: 'geminis',
    symbol: '♊',
    image: '/static/images/horoscope/geminis.png',
  },
  {
    name: 'Cáncer',
    date: 'JUN 21-JUL 22',
    slug: 'cancer',
    symbol: '♋',
    image: '/static/images/horoscope/cancer.png',
  },
  {
    name: 'Leo',
    date: 'JUL 23-AGO 22',
    slug: 'leo',
    symbol: '♌',
    image: '/static/images/horoscope/leo.png',
  },
  {
    name: 'Virgo',
    date: 'AGO 23-SEP 22',
    slug: 'virgo',
    symbol: '♍',
    image: '/static/images/horoscope/virgo.png',
  },
  {
    name: 'Libra',
    date: 'SEP 23-OCT 22',
    slug: 'libra',
    symbol: '♎',
    image: '/static/images/horoscope/libra.png',
  },
  {
    name: 'Escorpio',
    date: 'OCT 23-NOV 21',
    slug: 'escorpio',
    symbol: '♏',
    image: '/static/images/horoscope/escorpio.png',
  },
  {
    name: 'Sagitario',
    date: 'NOV 22-DIC 21',
    slug: 'sagitario',
    symbol: '♐',
    image: '/static/images/horoscope/sagitario.png',
  },
  {
    name: 'Capricornio',
    date: 'DIC 22-ENE 19',
    slug: 'capricornio',
    symbol: '♑',
    image: '/static/images/horoscope/capricornio.png',
  },
  {
    name: 'Acuario',
    date: 'ENE 20-FEB 18',
    slug: 'acuario',
    symbol: '♒',
    image: '/static/images/horoscope/acuario.png',
  },
  {
    name: 'Piscis',
    date: 'FEB 19-MAR 20',
    slug: 'piscis',
    symbol: '♓',
    image: '/static/images/horoscope/piscis.png',
  },
];

// Textos literarios por época
export const literaryHoroscopesCancer: LiteraryTexts = {
  aries: {
    text: 'Semana tipo Rayuela, pero sin saber en qué capítulo estás ni quién te observa desde la otra acera. Cuidado con los ascensores emocionales: pueden devolverte al inicio.',
  },
  tauro: {
    text: 'Tu terquedad alcanza niveles quijotescos. Solo que esta vez los molinos tienen WiFi y Sancho está viendo series. Replantéate ese mensaje antes de enviarlo.',
  },
  geminis: {
    text: 'Demasiadas versiones de ti. Esta semana, elige un solo narrador y dale voz. Tus amigos ya creen que estás atrapado en un taller eterno con Ricardo Piglia.',
  },
  cancer: {
    text: 'Tu nostalgia podría protagonizar un cuento de Benedetti, pero con delivery en vez de cartas. Llama a alguien, aunque solo sea para hablar del clima (o del fin del mundo).',
  },
  leo: {
    text: 'Te sientes como el protagonista de una distopía: todo gira en torno a ti, pero nadie te escucha. Tal vez sea hora de cerrar el diario íntimo y abrir una ventana. Literalmente.',
  },
  virgo: {
    text: 'Tu obsesión por el detalle cruzó la línea: estás editando mentalmente las conversaciones ajenas. Un Cortázar interior quiere corregir la realidad. Déjalo, pero solo hasta el martes.',
  },
  libra: {
    text: 'Vas a encontrar belleza en algo completamente asimétrico, como un verso cojo o un perro callejero. Esta semana no es para balancearse, sino para desbalancearse con estilo.',
  },
  escorpio: {
    text: 'Tu intensidad podría arruinar hasta una viñeta de Mafalda. Aprende a leer entre líneas... y a no subrayarlas todas. No todo lo que duele es tragedia.',
  },
  sagitario: {
    text: 'Estás tentado a empezar una novela sin tener final. Hazlo. Solo recuerda que hasta Bolaño borraba. El fuego creativo no justifica que le escribas a tu ex "por inspiración".',
  },
  capricornio: {
    text: 'Vas camino a convertirte en personaje de tu propia tesis. Trabajas, planificas, documentas... pero alguien te soñó y ya estás despertando en otra novela. No temas al borrador.',
  },
  acuario: {
    text: 'Esta semana tu rebeldía tendrá ecos de Arlt, pero en clave de grupo de WhatsApp. Un pequeño acto anárquico puede redimir tu rutina. Eso sí: no pongas todo en mayúsculas.',
  },
  piscis: {
    text: 'Te va a caer una revelación como en los cuentos de Clarice Lispector: suave, extraña, inevitable. No intentes explicarla. Solo toma nota. Y si puedes, escribe con la luz apagada.',
  },
};

export const literaryHoroscopesLeo: LiteraryTexts = {
  aries: {
    text: 'Hay algo en el aire que te empuja a hacer declaraciones grandilocuentes tipo prólogo de novela rusa. Pero cuidado: no todas las tragedias merecen 800 páginas.',
  },
  tauro: {
    text: 'Tu fidelidad está a prueba. No con personas, sino con playlists. El algoritmo te traicionará. Serás tentado por una novela de V.C. Andrews. Entrégate.',
  },
  geminis: {
    text: 'Estás a punto de iniciar tres proyectos nuevos. Todos contradictorios. Ninguno urgente. Uno terminará siendo un poema. O una deuda. O ambos.',
  },
  cancer: {
    text: 'Tus emociones te piden subtítulos. Esta semana alguien se los pondrá. ¿El problema? Estarán mal traducidos. No corrijas. Observa.',
  },
  leo: {
    text: 'Tu drama personal cobra dimensiones épicas, tipo tragedia griega pero con ChatGpt. Vas a querer gritar: "¡Yo nací para esto!". Y sí. Pero bájale dos tonos.',
  },
  virgo: {
    text: 'Vas a hacer una lista de listas. Y otra para revisar las anteriores. Si eso no te da paz, prueba con leer en voz alta a alguien que no te interrumpa.',
  },
  libra: {
    text: 'Estás en una fase estética intensa. Cualquier cosa fuera de simetría te altera el chi. Respira. Hasta el mejor verso cojea a veces.',
  },
  escorpio: {
    text: 'Una carta no enviada, una foto no borrada, un mensaje no leído. Todo eso eres tú esta semana. Intenso, como siempre. Pero con estilo noir.',
  },
  sagitario: {
    text: 'Esta semana vas a querer contarle a todos tu próxima idea brillante. No lo hagas. Déjala fermentar. No todo vino se bebe joven.',
  },
  capricornio: {
    text: 'Descubrirás que alguien escribió antes lo que estás pensando. ¿Plagio cósmico? No. Es el inconsciente colectivo pidiéndote una cita en letra chica.',
  },
  acuario: {
    text: 'Te va a tocar ser el raro en una sala de gente rara. Brilla. Nadie como tú para organizar el caos sin que parezca que estás mandando.',
  },
  piscis: {
    text: 'Un sueño extraño va a darte el título de algo importante. No sabrás si es cuento, diario, despedida o mantra.',
  },
};

export const literaryHoroscopesVirgo: LiteraryTexts = {
  aries: {
    text: 'Tus impulsos parecen escritos por Bukowski con resaca: intensos, desprolijos, pero honestos. Esta semana, un sí rápido te salvará de un no eterno.',
  },
  tauro: {
    text: 'Tu paciencia se agrieta como un tomo viejo de Quevedo. No intentes encuadernar lo que ya no pega: cambia de biblioteca antes de que el polvo te adopte.',
  },
  geminis: {
    text: 'Tienes tantas voces dentro que podrías fundar una revista literaria. Solo cuida que no termine siendo suplemento dominical de tu ego.',
  },
  cancer: {
    text: 'El pasado te busca como spam poético. Esta vez no lo abras: escribe tu propio correo fantasma y mándatelo a ti mismo.',
  },
  leo: {
    text: 'Quieres ser protagonista hasta en el pie de página. Tranquilo: incluso en las notas al margen hay gloria, si sabes usar cursivas.',
  },
  virgo: {
    text: 'Esta semana serás como un personaje de Borges: buscando un orden imposible en medio de una biblioteca infinita. El truco está en aceptar que a veces el mejor hallazgo es perderse entre estantes.',
  },
  libra: {
    text: 'Vas a descubrir que lo imperfecto seduce más que lo exacto, como un haiku torcido que se niega al equilibrio. Déjate llevar por esa grieta.',
  },
  escorpio: {
    text: 'Tu intensidad es tan aguda que harías llorar a Nietzsche en una fonda. No todo requiere martillazos: a veces basta un pie de foto.',
  },
  sagitario: {
    text: 'Se abre ante ti un mapa como novela de aventuras. Pero cuidado: no todos los cofres guardan tesoros; algunos solo polvo y cartas de amor mal escritas.',
  },
  capricornio: {
    text: 'Estás tan ocupado construyendo escaleras que olvidaste mirar si llevan a alguna parte. A veces el verdadero logro es tirarse en la primera grada.',
  },
  acuario: {
    text: 'Tu rareza será aplaudida como performance. Solo recuerda que hasta los dadaístas sabían cuándo cerrar la función.',
  },
  piscis: {
    text: 'El sueño te dictará un párrafo perfecto y al despertar lo habrás olvidado. No importa: lo bello de Piscis es creer que aún lo recuerdas.',
  },
};

export const literaryHoroscopesLibra: LiteraryTexts = {
  aries: {
    text: 'Irrumpes en la sobremesa como si fueras un mosquetero de Dumas, pero la reunión era un club de lectura de Marguerite Yourcenar. Brinda igual: tu espada es una cuchara de postre.',
  },
  tauro: {
    text: 'Intentas etiquetar cada emoción con la minucia de un bibliotecario de Umberto Eco. La vida responde con una edición pirata. Acepta que ciertas pasiones vienen sin índice.',
  },
  geminis: {
    text: 'Organizas debate interno como si Italo Calvino te hubiera multiplicado en capítulos alternos. Antes de votar, pregúntale a cuál versión le toca lavar los platos.',
  },
  cancer: {
    text: 'Tu nostalgia arma escenas como una novela de Yasunari Kawabata: delicada, lenta y nevada aun en primavera. Autorízate un escándalo mínimo, quizá un sticker en mayúsculas.',
  },
  leo: {
    text: 'Buscas brillar con la solemnidad de una epopeya de Sor Juana, pero el público quiere un remate a lo Dorothy Parker. Ensaya tu rugido en tres sílabas y con abanico prestado.',
  },
  virgo: {
    text: 'Detectas errores en el universo con la obsesión de una correctora de Tolstói. Antes de demandar a la Vía Láctea, recuerda que los mejores manuscritos incluyen una mancha de té.',
  },
  libra: {
    text: 'Moderarás un salón donde Jane Austen compara notas con Molière y todos esperan tu veredicto. Dicta sentencia: que la ironía lleve guantes blancos, pero que se escuche la carcajada.',
  },
  escorpio: {
    text: 'Tu sospecha olfatea secretos como inspector salido de Dostoievski, aunque el caso sea un mensaje sin responder. Usa la intensidad para escribir la confesión, no para revisar celulares.',
  },
  sagitario: {
    text: 'Planeas escapar en globo rumbo a la biblioteca de Julio Verne, pero terminas programando un tour virtual guiado por Cervantes. Igual aventura, menos maletas.',
  },
  capricornio: {
    text: 'Construyes objetivos con la disciplina de George Eliot supervisando una hacienda victoriana. Añade un intermedio picaresco: ni el progreso resiste tanta agenda sin merienda.',
  },
  acuario: {
    text: 'Fundas una comuna futurista digna de Ursula K. Le Guin y le pones horario de lectura obligatoria. Invita a alguien del realismo mágico antes de que te declaren profe sin recreo.',
  },
  piscis: {
    text: 'Sueñas un epílogo marino dictado por Kobo Abe y despiertas con arena en el teclado. Anótalo antes de que Homero reclame derechos de autor.',
  },
};

export const literaryHoroscopesEscorpio: LiteraryTexts = {
  aries: {
    text: 'Tu ímpetu de Hemingway choca con el noir de Highsmith. Quieres la acción pura; Escorpio prefiere el crimen perfecto sin testigos. Esta semana, antes de lanzarte al precipicio, lee una página de "El talento de Mr. Ripley". Aprenderás que hay formas más oscuras de ganar.',
  },
  tauro: {
    text: 'Buscas raíces eternas como en García Márquez; Escorpio te murmura: "Las raíces más profundas se pudren en la oscuridad". Tu solidez encuentra grietas. Esta semana, acepta que algunos cimientos están diseñados para colapsar. A veces lo podrido es lo más honesto.',
  },
  geminis: {
    text: 'Eres Italo Calvino multiplicado en capítulos. Hablas en juicios paralelos, en historias que se ramifican. Escorpio, como Dostoievski, toma cada palabra tuya y la convierte en confesión. Cuidado: alguien está escribiendo tu monólogo interior en sangre.',
  },
  cancer: {
    text: 'Tu nostalgia tipo Kawabata encuentra a Escorpio buceando en los abismos de Clarice Lispector. Ambos son agua, pero tú miras hacia el pasado y Escorpio hacia las capas donde nada respira. Esta semana, sumérgete sin mapa. Lo profundo necesita dos pares de ojos.',
  },
  leo: {
    text: 'Tu brillo épico estilo Byron asusta a Escorpio. No es envidia; es que ves demasiado como quien lee bajo un foco en una novela negra. Leo quiere ser la estrella del drama; Escorpio quiere saber qué secreto acecha tras tu corona. Déjate editar por la sombra.',
  },
  virgo: {
    text: 'Ambos son obsesivos, pero tú como Borges en su biblioteca infinita, y Escorpio como Patricia Highsmith corrigiendo crímenes. Tú buscas el detalle perfecto; Escorpio, la mentira perfecta. Esta semana, descubre que la corrección verdadera vive en lo que duele.',
  },
  libra: {
    text: 'Tu balance wildeano choca con la amargura de Escorpio. Tú dices: "La belleza es lo único que vale". Escorpio responde: "La belleza es la mejor mentira". Uno quiere un epigrama; el otro, una confesión. Elige: la gracia o la verdad. No puedes tener ambas.',
  },
  escorpio: {
    text: 'Esta semana serás el personaje de Highsmith observando tu propio crimen. Lo incómodo es que ya lo escribiste todo en un diario que nadie encontrará. El revelador es que ese diario eres tú. Cada secreto que guardas es la página que no te atreves a releer.',
  },
  sagitario: {
    text: 'Quieres escribir La Odisea de Julio Verne; Escorpio sugiere quedarse en la oscuridad sin mapa. Viajar lejos es cobardia; viajar profundo es suicidio intelectual. Esta semana, descubre que el mejor laberinto no es geográfico: está escrito en Camus y Sartre.',
  },
  capricornio: {
    text: 'Eres el arquitecto de George Eliot construyendo imperios victorianos. Escorpio es el arqueólogo que sabe que los mejores palacios están enterrados. Tu disciplina es admirable; esta semana, planta una novela negra en el sótano. Florecerá en tinta invisible.',
  },
  acuario: {
    text: 'Tu utopía de Le Guin choca con el cinismo de Bukowski. Tú crees en reformas; Escorpio en la corrupción como verdad universal. El futuro que imaginas ya está podrido en la ficción. Esta semana, lee un cuento de Poe. Es más honesto que tu revolución.',
  },
  piscis: {
    text: 'Sueñas con Murakami en espacios paralelos; Escorpio habita en los de Maupassant donde los espectros no responden. Ambos saben leer lo invisible, pero tú lo poetizas y Escorpio lo disecciona. Esta semana, comparte tu pesadilla más visceral. Escorpio comprenderá porque ya la escribió.',
  },
};

export const literaryHoroscopesSagitario: LiteraryTexts = {
  aries: {
    text: 'Actuarás con la urgencia de un personaje de Hemingway cruzando la frontera. Directo, veloz, sin preámbulos. Solo que esta vez el toro eres tú. Frena antes del precipicio o hazlo con estilo.',
  },
  tauro: {
    text: 'Aferrado a tu rutina como si fuera una novela de Proust: repetitiva, detallada, infinita. Esta semana alguien te robará una página. Deja que lo haga. A veces perder el hilo es encontrar el desenlace.',
  },
  geminis: {
    text: 'Pareces un cuento de Pessoa escrito por todos sus heterónimos a la vez. Demasiadas voces, ningún consenso. Esta semana: silencia a dos y deja hablar solo al que tiene algo útil que decir.',
  },
  cancer: {
    text: 'Tu melancolía podría ilustrar un epistolario de Sylvia Plath. Hermoso, sí, pero agotador. Esta semana: sal del frasco de cristal. Abre la ventana aunque entre ruido. El mundo no muerde tanto como temes.',
  },
  leo: {
    text: 'Quieres montar una obra donde tú seas autor, director y protagonista. Muy Orson Welles, pero sin presupuesto. Esta semana: comparte el escenario o terminarás aplaudiendo solo frente al espejo.',
  },
  virgo: {
    text: 'Corriges errores que nadie más ve, como un editor fantasma de Flaubert. Admirable, pero exhausto. Esta semana: deja pasar una coma mal puesta. El cielo no se cae por un punto y coma fuera de lugar.',
  },
  libra: {
    text: 'Estás diseñando una portada perfecta para un libro que aún no escribes. Todo equilibrio, ninguna historia. Esta semana: escribe tres páginas feas. La belleza puede venir después, o nunca. Ambas opciones son válidas.',
  },
  escorpio: {
    text: 'Lees entre líneas como si fueras detective en una novela de Chandler. Todo te parece sospechoso, hasta el saludo del vecino. Esta semana: no todo tiene doble fondo. A veces un café es solo un café.',
  },
  sagitario: {
    text: 'Esta semana escribirás diálogos brillantes pero solo en tu cabeza. Cuando intentes decirlos en voz alta, saldrá otra cosa. Acéptalo: la improvisación también es un arte. Hasta Kerouac editaba después.',
  },
  capricornio: {
    text: 'Construyes tu vida como si fuera una saga de Balzac: planificada, ambiciosa, con presupuesto detallado. Esta semana: un imprevisto te cambiará el capítulo. No lo resistas. Las mejores tramas nunca fueron lineales.',
  },
  acuario: {
    text: 'Propones ideas tan raras que parecen salidas de un relato de Bradbury. La mitad te aplaude, la otra mitad huye. Esta semana: no expliques tanto. Los visionarios nunca convencen a todos. Ni falta que hace.',
  },
  piscis: {
    text: 'Vives en una bruma poética digna de Neruda en modo soñador. Bonito, pero poco práctico. Esta semana: aterriza dos horas al día. Paga una cuenta, responde un correo. Luego vuelve a tu nube. Balance.',
  },
};

export const literaryHoroscopesCapricornio: LiteraryTexts = {
  aries: {
    text: 'Arrancas enero con la energía de un personaje de Jack London: salvaje, decidido, hambriento. Pero cuidado: no todo se conquista a dentelladas. Esta semana, antes de morder, pregúntate si el hueso vale la pena.',
  },
  tauro: {
    text: 'Tu paciencia es digna de un narrador de Thomas Mann: lenta, detallada, con vocación de monumento. Pero hasta "La montaña mágica" tiene un final. Esta semana, decide si estás construyendo o simplemente postergando.',
  },
  geminis: {
    text: 'Hablas en dos idiomas simultáneos como un personaje de Nabokov: uno para el mundo, otro para ti. Esta semana, alguien descubrirá tu segundo idioma. No te asustes: la traducción puede ser un alivio.',
  },
  cancer: {
    text: 'Tu memoria es un museo curado por Marguerite Duras: cada objeto duele, cada sombra significa. Esta semana, cierra una sala. No todo lo que guardas merece iluminación permanente.',
  },
  leo: {
    text: 'Quieres protagonizar tu propia épica como un héroe de Tolkien, pero el anillo pesa y el camino es largo. Esta semana, acepta compañía. Hasta Frodo necesitó a Sam para llegar a Mordor.',
  },
  virgo: {
    text: 'Editas la realidad con la obsesión de un corrector de Flaubert buscando "le mot juste". Admirable, pero paralizante. Esta semana, publica el borrador. La perfección es enemiga de existir.',
  },
  libra: {
    text: 'Buscas el equilibrio perfecto como si fueras un ensayo de Montaigne: ponderado, elegante, lleno de "por otra parte". Esta semana, toma partido. Incluso los escépticos deben elegir un café.',
  },
  escorpio: {
    text: 'Tu intensidad podría protagonizar una novela de Dostoievski: confesiones a medianoche, culpas heredadas, redenciones imposibles. Esta semana, perdónate algo pequeño. No todo requiere castigo eterno.',
  },
  sagitario: {
    text: 'Planeas escapadas como un personaje de Julio Verne: con mapas, brújulas y optimismo científico. Pero el mundo ya no tiene tantos blancos en el mapa. Esta semana, explora un territorio interior. Sorpresas garantizadas.',
  },
  capricornio: {
    text: 'Este es tu mes, arquitecto de sueños con planos detallados. Como Poe construyendo sus catedrales de terror, sabes que el diablo está en los detalles. Esta semana, permite una grieta: por ahí entrará la luz.',
  },
  acuario: {
    text: 'Tus ideas suenan a ciencia ficción de Ursula K. Le Guin: utopías posibles, futuros alternativos, preguntas incómodas. Esta semana, baja una idea del cielo y plántala en tierra. Necesita raíces para crecer.',
  },
  piscis: {
    text: 'Flotas entre realidades como un cuento de Murakami: gatos que hablan, pozos que conectan mundos, melodías que abren puertas. Esta semana, elige una realidad y quédate un rato. El misterio puede esperar.',
  },
};

// Datos específicos para cada horóscopo implementado
export const horoscopoData: Record<ImplementedSignSlug, HoroscopoData> = {
  cancer: {
    author: 'Franz Kafka',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1752236442/Kafka_cancer_qeyz7p.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      'Frágil, nocturno, con traumas heredados y la pulsión inagotable de escribir sin que nadie lo lea. El cáncer arquetípico: todo le duele, pero lo convierte en literatura. "Soy literatura o nada", dijo. Murió pidiendo que quemaran todo lo que había escrito. Nadie le hizo caso.',
    efemerides: [
      {
        date: '3 de julio de 1883',
        title: 'Nace Franz Kafka',
        description: 'Lo celebra escribiendo cartas imposibles a su padre.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '10 de julio de 1871',
        title: 'Nace Marcel Proust',
        description: 'Aún no encuentra la magdalena perfecta.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '18 de julio de 1817',
        title: 'Muere Jane Austen',
        description: 'La ironía sobrevivió. Su virginidad, también.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
    ],
    writers: undefined,
  },
  leo: {
    author: 'H.P. Lovecraft',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1753183953/Leo_Lovecraft_tahvd6.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      'H.P. Lovecraft es nuestro icónico Leo, un signo que brilla como nadie, sufre como todos y crea mundos con una metáfora. Nuestro legendario escritor describió en sus historias desde antiguos tratados, como el innombrable Necronomicón, del árabe Abdul Alhazred -un libro nunca visto, pero del que se murmuran cosas monstruosas, de saberes arcanos y magia ritual, registro de fórmulas olvidadas que permiten contactar con unas entidades sobrenaturales de un inmenso poder-, hasta personajes como el alquimista Charles Le Socier, pasando por un universo de mundos y bestias maravillosas que no dejan de cautivar.',
    efemerides: [
      {
        date: '23 de julio de 1888',
        title: 'Nace Raymond Chandler',
        description: 'Ya escribía frases secas desde el útero.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '28 de julio de 1866',
        title: 'Nace Beatrix Potter',
        description: 'Crea animales que hablan mejor que muchos políticos.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '30 de julio de 1818',
        title: 'Nace Emily Brontë',
        description: 'Cumbres borrascosas y ningún pendiente más.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        date: '31 de julio de 1965',
        title: 'Nace J.K. Rowling',
        description: 'Leo con horóscopo ascendente en retweet.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        date: '5 de agosto de 1850',
        title: 'Nace Guy de Maupassant',
        description: 'El primero en describir fantasmas que también eran deudas.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400',
      },
      {
        date: '9 de agosto de 1896',
        title: 'Muere Hermann Melville',
        description: 'Su editor aún esperaba la segunda parte de Moby-Dick.',
        color: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
        borderColor: 'border-indigo-100 dark:border-indigo-800/30',
        textColor: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        date: '15 de agosto de 1769',
        title: 'Nace Napoleón',
        description: 'No escribió novelas, pero inspiró miles.',
        color: 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
        borderColor: 'border-rose-100 dark:border-rose-800/30',
        textColor: 'text-rose-600 dark:text-rose-400',
      },
    ],
    writers: [
      'Henrik Pontoppidan (Premio Nobel 1917)',
      'Alexandre Dumas',
      'Elias Canetti (Premio Nobel 1981)',
      'Aldous Huxley',
      'George Bernard Shaw (Premio Nobel 1925)',
      'Giosuè Carducci (Premio Nobel 1906)',
      'Malcolm Lowry',
      'Eyvind Johnson (Premio Nobel 1974)',
      'Emily Brontë',
      'Cees Nooteboom',
      'Herman Melville',
      'Isabel Allende',
      'Rómulo Gallegos',
      'Knut Hamsun (Premio Nobel 1920)',
      'Virgilio Piñera',
      'Guy de Maupassant',
      'Jostein Gaarder',
      'Alfred Döblin',
      'Jorge Amado',
      'Jacinto Benavente (Premio Nobel 1922)',
      'John Galsworthy (Premio Nobel 1932)',
      'Stieg Larsson',
      'Charles Bukowski',
      'V.S. Naipual (Premio Nobel 2001)',
      'Herta Müller (Premio Nobel 2009)',
      'Jonathan Franzen',
      'H.P. Lovecraft',
      'Salvatore Quasimodo (Premio Nobel 1959)',
      'Emilio Salgari',
      'Ray Bradbury',
    ],
  },
  virgo: {
    author: 'Agatha Christie',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1755780888/Agatha-Christie_lzxfnz.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      '"El detalle mata, pero también salva." La reina indiscutida del crimen elegante. Virgo de manual: precisión quirúrgica, memoria enciclopédica de venenos y la capacidad de convertir una taza de té en arma homicida. Su obsesión por el orden narrativo dio vida a Poirot y Miss Marple, detectives que resolvían casos con más paciencia que Scotland Yard. Publicó más de 60 novelas, fue la autora más vendida de la historia y aún así desapareció once días, como si la vida misma le pidiera una trama. "Escribo asesinatos porque lavar platos me resulta más monótono", podría haber dicho (y probablemente lo pensó).',
    efemerides: [
      {
        date: '26 de agosto de 1914',
        title: 'Nace Julio Cortázar.',
        description: 'Rayuela, cronopios y un París que nunca existió del todo.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '29 de agosto de 1952',
        title: 'Muere Margaret Wise Brown.',
        description: 'Inventó conejitos que se duermen más fácil que algunos lectores.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '4 de septiembre de 1984',
        title: 'Muere Truman Capote.',
        description: 'La alta sociedad aún cree que va a volver a la fiesta.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        date: '9 de septiembre de 1828',
        title: 'Nace León Tolstói.',
        description: 'Demostró que incluso la guerra necesita notas al pie.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        date: '14 de septiembre de 1769',
        title: 'Nace Alexander von Humboldt.',
        description: 'Escribió de ciencia como si fueran novelas de aventuras.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400',
      },
      {
        date: '21 de septiembre de 1866',
        title: 'Nace H.G. Wells.',
        description: 'El hombre que puso a la ciencia a viajar en tranvía temporal.',
        color: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
        borderColor: 'border-indigo-100 dark:border-indigo-800/30',
        textColor: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        date: '21 de septiembre de 1947',
        title: 'Nace Stephen King.',
        description: 'La pesadilla más prolífica de Maine.',
        color: 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
        borderColor: 'border-rose-100 dark:border-rose-800/30',
        textColor: 'text-rose-600 dark:text-rose-400',
      },
    ],
    writers: [
      'Jorge Luis Borges',
      'Álvaro Mutis',
      'Johann Wolfgang von Goethe',
      'Nicanor Parra',
      'Cesare Pavese',
      'Francisco de Quevedo',
      'Adolfo Bioy Casares',
      'Javier Marías',
      'Stephen King',
      'Mary Shelley',
    ],
  },
  libra: {
    author: 'Oscar Wilde',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1758729122/Oscar_Wilde_Libra_s9czcr.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      'El dandy irlandés que convertía cada paradoja en epigrama y cada tragedia en arte. Libra puro: obsesionado con la belleza, adicto a la controversia elegante y capaz de encontrar simetría hasta en la cárcel. "Puedo resistir todo, excepto la tentación", dijo, y fue su guía de vida. Escribió sobre el amor como quien diseña jardines: con artificio perfecto y pasión genuina. Su genio radicaba en hacer que lo frívolo pareciera profundo y lo profundo, frívolo.',
    efemerides: [
      {
        date: '16 de octubre de 1854',
        title: 'Nace Oscar Wilde',
        description: 'Dublin prepara su primer escándalo literario.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '4 de octubre de 1535',
        title: 'Se publica la primera Biblia completa en inglés',
        description: 'El equilibrio entre fe y literatura encuentra su traducción.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '7 de octubre de 1849',
        title: 'Muere Edgar Allan Poe',
        description: 'El misterio de su muerte aún alimenta teorías como cuentos.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        date: '14 de octubre de 1644',
        title: 'Nace William Penn',
        description: 'Fundador de Pensilvania, donde la utopía tuvo código postal.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        date: '21 de octubre de 1772',
        title: 'Nace Samuel Taylor Coleridge',
        description: 'Sus sueños con opio crearon los mejores versos de la historia.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400',
      },
    ],
    writers: [
      'Oscar Wilde',
      'Miguel de Cervantes',
      'Italo Calvino',
      'William Faulkner',
      'F. Scott Fitzgerald',
      'Truman Capote',
      'Graham Greene',
      'Gore Vidal',
      'Donna Leon',
      'Doris Lessing (Premio Nobel 2007)',
      'Mario Puzo',
      'Arthur Miller',
      'John le Carré',
      'Harold Pinter (Premio Nobel 2005)',
      'Ursula K. Le Guin',
      'Anne Rice',
      'Elfriede Jelinek (Premio Nobel 2004)',
    ],
  },
  escorpio: {
    author: 'Patricia Highsmith',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1761664881/Patricia_Highsmith_c0spde.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'phighsmith',
    description:
      'Escorpio encarnado: oscuro, moralmente ambiguo, obsesionado con los abismos de la naturaleza humana. Patricia Highsmith escribía crimen como quien respira. Su Tom Ripley no es un villano; es la verdad incómoda de lo que somos cuando nadie nos mira. Creó historias donde el culpable y la víctima intercambian máscaras. Vivió en retiro, desconfiando del mundo, escribiendo las verdades más oscuras con la precisión de un cirujano. "He trabajado duro durante años para ser excepcional. Ahora que lo soy, no me sorprende", dijo sin arrogancia: era observación.',
    efemerides: [
      {
        date: '8 de noviembre de 1949',
        title: 'Publica "El talento de Mr. Ripley"',
        description: 'Nace el socio perfecto: amable, culto, asesino.',
        color: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
        borderColor: 'border-red-100 dark:border-red-800/30',
        textColor: 'text-red-600 dark:text-red-400',
      },
      {
        date: '10 de noviembre de 1883',
        title: 'Nace Djuna Barnes',
        description: 'Escritora de la noche: París en tinta negra y verdades prohibidas.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '13 de noviembre de 1850',
        title: 'Nace Robert Louis Stevenson',
        description: 'El Jekyll y Hyde fue primero biografía personal, luego ficción.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '19 de noviembre de 1918',
        title: 'Nace Ivo Andrić',
        description: 'El puente de Visegrad: historias donde el pasado es maldición y luz.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
    ],
    writers: [
      'Patricia Highsmith',
      'Diane Arbus',
      'Bette Davis',
      'Pablo Neruda',
      'James Baldwin',
      'Sylvia Plath',
      'Charles Bukowski',
      'Truman Capote',
      'Tennessee Williams',
      'David Lynch',
      'Isabel Allende',
      'Clarice Lispector',
    ],
  },
  sagitario: {
    author: 'Jane Austen',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1764592800/jane_austen_sagitario_q5ssic.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'jausten',
    description:
      'Sagitario en estado puro: aventurera intelectual disfrazada de señorita inglesa. Jane Austen disparaba verdades filosóficas con ironía quirúrgica desde la sala de té. Observaba el mundo como antropóloga y lo narraba como comediante. Sus novelas son flechas certeras hacia la hipocresía social, envueltas en bailes de salón. "Declaro, después de todo, que no hay placer como la lectura", escribió, y lo decía en serio aunque sus personajes no siempre. Murió joven pero dejó un legado que sigue provocando conversaciones, risas y tesis doctorales. Sagitario no conquista territorios: conquista mentes.',
    efemerides: [
      {
        date: '1 de diciembre de 1948',
        title: 'Muere Alejandra Kollontai',
        description: 'Revolucionaria, diplomática, novelista. La libertad también se escribe.',
        color: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
        borderColor: 'border-red-100 dark:border-red-800/30',
        textColor: 'text-red-600 dark:text-red-400',
      },
      {
        date: '3 de diciembre de 1857',
        title: 'Nace Joseph Conrad',
        description: 'Del mar a la selva: el viaje como metáfora del alma.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '16 de diciembre de 1775',
        title: 'Nace Jane Austen',
        description: 'La ironía británica encuentra su templo portátil.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '16 de diciembre de 1917',
        title: 'Nace Arthur C. Clarke',
        description: 'Filósofo del espacio: la ciencia ficción como profecía.',
        color: 'from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20',
        borderColor: 'border-cyan-100 dark:border-cyan-800/30',
        textColor: 'text-cyan-600 dark:text-cyan-400',
      },
      {
        date: '18 de diciembre de 1856',
        title: 'Nace J.J. Thomson',
        description: 'Descubre el electrón y lo escribe como quien narra una aventura.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
    ],
    writers: [
      'Jane Austen',
      'Gustave Flaubert',
      'Joseph Conrad',
      'Willa Cather',
      'Noel Coward',
      'Arthur C. Clarke',
      'Philip K. Dick',
      'William Blake',
      'Emily Dickinson',
      'Louisa May Alcott',
      'C.S. Lewis',
      'Noam Chomsky',
      'Jorge Semprún',
      'José Ortega y Gasset',
      'Edmond Rostand',
    ],
  },
  capricornio: {
    author: 'Edgar Allan Poe',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1767953685/Poe_bejcvr.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'eapoe',
    description:
      'Capricornio en su forma más oscura y disciplinada: Edgar Allan Poe construyó catedrales de terror con la precisión de un arquitecto obsesivo. Inventó el cuento policial, perfeccionó el relato gótico y convirtió sus demonios en literatura universal. "Los que sueñan de día conocen muchas cosas que escapan a los que sueñan solo de noche", escribió, y vivió entre ambos mundos. Murió misteriosamente a los 40, pero dejó un legado que sigue latiendo bajo las tablas del piso de la literatura mundial. Capricornio no teme a la oscuridad: la cartografía.',
    efemerides: [
      {
        date: '19 de enero de 1809',
        title: 'Nace Edgar Allan Poe',
        description: 'Boston recibe al arquitecto del terror moderno.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '3 de enero de 1892',
        title: 'Nace J.R.R. Tolkien',
        description: 'El constructor de mundos que hizo de la fantasía una arquitectura.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        date: '2 de enero de 1920',
        title: 'Nace Isaac Asimov',
        description: 'Las leyes de la robótica nacieron de un Capricornio metódico.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '9 de enero de 1908',
        title: 'Nace Simone de Beauvoir',
        description: 'El feminismo encontró su voz filosófica más rigurosa.',
        color: 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
        borderColor: 'border-rose-100 dark:border-rose-800/30',
        textColor: 'text-rose-600 dark:text-rose-400',
      },
      {
        date: '5 de enero de 1932',
        title: 'Nace Umberto Eco',
        description: 'Semiótica, erudición y novelas que son laberintos de espejos.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        date: '12 de enero de 1876',
        title: 'Nace Jack London',
        description: 'La llamada de lo salvaje: aventura con colmillos y conciencia social.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-cyan-400',
      },
      {
        date: '18 de enero de 1867',
        title: 'Nace Rubén Darío',
        description: 'El príncipe del modernismo latinoamericano nació en invierno.',
        color: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
        borderColor: 'border-indigo-100 dark:border-indigo-800/30',
        textColor: 'text-indigo-600 dark:text-indigo-400',
      },
    ],
    writers: [
      'Edgar Allan Poe',
      'J.R.R. Tolkien',
      'Isaac Asimov',
      'Simone de Beauvoir',
      'Umberto Eco',
      'Jack London',
      'Rubén Darío',
      'Molière',
      'Haruki Murakami',
      'Susan Sontag',
      'E.L. Doctorow',
      'Juan Rulfo',
      'Yukio Mishima',
      'Carlos Castaneda',
      'Stanisław Lem',
    ],
  },
};

// Función helper para obtener los textos literarios según el signo
export function getLiteraryTexts(signo: ImplementedSignSlug): LiteraryTexts {
  switch (signo) {
    case 'cancer':
      return literaryHoroscopesCancer;
    case 'leo':
      return literaryHoroscopesLeo;
    case 'virgo':
      return literaryHoroscopesVirgo;
    case 'libra':
      return literaryHoroscopesLibra;
    case 'escorpio':
      return literaryHoroscopesEscorpio;
    case 'sagitario':
      return literaryHoroscopesSagitario;
    case 'capricornio':
      return literaryHoroscopesCapricornio;
  }
}

// Función para obtener el link del signo
export function getSignLink(signSlug: string): string {
  if (signSlug === 'capricornio') return '/horoscopo'; // Signo actual (Enero 2026)
  if (signSlug === 'sagitario') return '/horoscopo/sagitario'; // Archivo disponible (Diciembre 2025)
  if (signSlug === 'escorpio') return '/horoscopo/escorpio'; // Archivo disponible (Noviembre 2025)
  if (signSlug === 'libra') return '/horoscopo/libra'; // Archivo disponible (Octubre 2025)
  if (signSlug === 'virgo') return '/horoscopo/virgo'; // Archivo disponible (Septiembre 2025)
  if (signSlug === 'leo') return '/horoscopo/leo'; // Archivo disponible (Agosto 2025)
  if (signSlug === 'cancer') return '/horoscopo/cancer'; // Archivo disponible (Julio 2025)
  return '#'; // Signos futuros (sin link)
}

// Signos implementados (para validación)
export const implementedSigns: ImplementedSignSlug[] = ['cancer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio'];

// Nombres de signos para mostrar
export const signDisplayNames: Record<ImplementedSignSlug, string> = {
  cancer: 'Cáncer',
  leo: 'Leo',
  virgo: 'Virgo',
  libra: 'Libra',
  escorpio: 'Escorpio',
  sagitario: 'Sagitario',
  capricornio: 'Capricornio',
};
