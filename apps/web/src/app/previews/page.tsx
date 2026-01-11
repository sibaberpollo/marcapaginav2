import { Metadata } from 'next';
import { Header } from '@/components';
import PreviewCard from '@/components/preview/PreviewCard';
import { getAllPreviews } from '@/lib/previews';

export const metadata: Metadata = {
  title: 'Previews de Novelas | MarcaPágina',
  description: 'Lee los primeros capítulos de novelas seleccionadas. Descubre nuevas voces literarias antes de comprar.',
  openGraph: {
    title: 'Previews de Novelas | MarcaPágina',
    description: 'Lee los primeros capítulos de novelas seleccionadas. Descubre nuevas voces literarias antes de comprar.',
    type: 'website',
  },
};

export default async function PreviewsPage() {
  const previews = await getAllPreviews();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero section */}
        <section className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary mb-4">
            Previews de Novelas
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Lee los primeros capítulos de novelas seleccionadas por MarcaPágina.
            Descubre nuevas voces literarias antes de decidir tu próxima lectura.
          </p>
        </section>

        {/* Previews grid */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          {previews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {previews.map((preview) => (
                <PreviewCard key={preview.slug} preview={preview} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">
                Próximamente nuevos previews de novelas.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
