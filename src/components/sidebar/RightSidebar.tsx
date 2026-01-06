import Link from 'next/link';

const apps = [
  { name: 'Literal', description: 'Red social sin algoritmos' },
  { name: 'Oku', description: 'Biblioteca minimalista' },
  { name: 'StoryGraph', description: 'Recomendaciones por mood' },
  { name: 'Hardcover', description: 'Tracking con estadísticas' },
];

const news = [
  { category: 'Editoriales', title: 'Anagrama lanza colección para menores de 30' },
  { category: 'Tecnología', title: 'El audiolibro supera al ebook en España' },
  { category: 'Obituario', title: 'Fallece Antonio Gamoneda a los 92 años' },
];

export default function RightSidebar() {
  return (
    <aside className="hidden lg:block space-y-4">
      <div className="sticky top-20 space-y-4">
        {/* Apps Directory 
        <div className="bg-bg-primary rounded-lg p-4 border border-surface-2">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Apps para lectores
          </h3>
          <div className="space-y-3">
            {apps.map((app) => (
              <Link key={app.name} href="#" className="block group">
                <div className="font-medium text-sm group-hover:text-text-secondary transition-colors">
                  {app.name}
                </div>
                <div className="text-xs text-text-secondary">{app.description}</div>
              </Link>
            ))}
          </div>
          <Link
            href="/apps"
            className="block mt-3 pt-3 border-t border-surface-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            Ver directorio completo →
          </Link>
        </div>
        */}
        {/* Latest News 
        <div className="bg-bg-primary rounded-lg p-4 border border-surface-2">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Últimas noticias
          </h3>
          <div className="space-y-3">
            {news.map((item, index) => (
              <Link key={index} href="#" className="block group">
                <div className="text-xs text-text-secondary">{item.category}</div>
                <div className="font-medium text-sm group-hover:text-text-secondary transition-colors line-clamp-2">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/noticias"
            className="block mt-3 pt-3 border-t border-surface-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            Ver todas las noticias →
          </Link>
        </div>
        */}

        {/* Footer links */}
        <div className="text-xs text-text-secondary space-y-2 px-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="#" className="hover:text-text-primary transition-colors">
              Sobre nosotros
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Contacto
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Enviar textos
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Publicidad
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Términos
            </Link>
          </div>
          <p className="pt-2">© 2026 Marcapágina</p>
        </div>
      </div>
    </aside>
  );
}
