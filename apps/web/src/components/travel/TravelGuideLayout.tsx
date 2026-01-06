'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { TravelGuide, Location } from '@/lib/types/article';

// Dynamic import for the map to avoid SSR issues with Leaflet
const TravelMap = dynamic(() => import('./TravelMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] lg:h-full bg-surface-2 animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-text-secondary">Cargando mapa...</span>
        </div>
    ),
});

interface TravelGuideLayoutProps {
    article: TravelGuide;
}

function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function TravelGuideLayout({ article }: TravelGuideLayoutProps) {
    const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

    const handleLocationClick = (location: Location) => {
        setActiveLocationId(location.id);
        // Scroll to the location card
        const element = document.getElementById(`location-${location.id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleCardClick = (locationId: string) => {
        setActiveLocationId(locationId);
    };

    const sortedLocations = [...article.locations].sort((a, b) => a.order - b.order);

    return (
        <main className="min-h-screen pb-20 lg:pb-0">
            {/* Hero Header */}
            <header className="bg-brand-black-static text-brand-white-static">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="badge bg-brand-yellow text-brand-black-static border-none text-xs font-bold">
                            GUÍA DE VIAJE
                        </span>
                        <Link
                            href={`/categoria/${article.categorySlug}`}
                            className="badge bg-white/20 text-white border-none text-xs hover:bg-white/30 transition-colors"
                        >
                            {article.category}
                        </Link>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                        {article.title}
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mb-6">{article.excerpt}</p>

                    {/* Author and meta */}
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${article.author.avatar} rounded-full`}></div>
                        <div>
                            <div className="font-medium">{article.author.name}</div>
                            <div className="text-sm text-gray-400">
                                {formatDate(article.publishedAt)} · {article.readTime} de lectura
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content with sticky map */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="lg:grid lg:grid-cols-5 lg:gap-8">
                    {/* Map - Sticky on desktop */}
                    <div className="lg:col-span-2 mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-20 space-y-4">
                            <div className="h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-surface-2">
                                <TravelMap
                                    locations={article.locations}
                                    center={article.mapCenter}
                                    zoom={article.mapZoom || 13}
                                    activeLocationId={activeLocationId}
                                    onLocationClick={handleLocationClick}
                                    showRoute={true}
                                    routeOrder={article.suggestedRoute}
                                />
                            </div>

                            {/* Quick navigation */}
                            <div className="bg-bg-primary rounded-lg p-4 border border-surface-2">
                                <h3 className="font-bold text-sm mb-3 text-text-secondary uppercase tracking-wider">
                                    Puntos de interés
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {sortedLocations.map((location) => (
                                        <button
                                            key={location.id}
                                            onClick={() => handleCardClick(location.id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all
                        ${activeLocationId === location.id
                                                    ? 'bg-brand-yellow text-brand-black-static font-medium'
                                                    : 'bg-surface hover:bg-surface-2 text-text-secondary'
                                                }`}
                                        >
                                            <span className="w-5 h-5 rounded-full bg-brand-black-static text-brand-yellow text-xs flex items-center justify-center font-bold">
                                                {location.order}
                                            </span>
                                            <span className="hidden sm:inline">{location.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {/* Introduction */}
                        {article.content && (
                            <div
                                className="article-content prose prose-lg max-w-none mb-12"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        )}

                        {/* Location Cards */}
                        <div className="space-y-8">
                            {sortedLocations.map((location, index) => (
                                <div key={location.id}>
                                    <article
                                        id={`location-${location.id}`}
                                        onClick={() => handleCardClick(location.id)}
                                        className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300
                    ${activeLocationId === location.id
                                                ? 'border-brand-yellow shadow-lg shadow-brand-yellow/20 ring-2 ring-brand-yellow/30'
                                                : 'border-surface-2 hover:border-brand-gray/30'
                                            }`}
                                    >
                                        {/* Location header */}
                                        <div className={`px-6 py-4 transition-colors
                    ${activeLocationId === location.id
                                                ? 'bg-brand-yellow'
                                                : 'bg-brand-black-static'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                        ${activeLocationId === location.id
                                                        ? 'bg-brand-black-static text-brand-yellow'
                                                        : 'bg-brand-yellow text-brand-black-static'
                                                    }`}
                                                >
                                                    {location.order}
                                                </span>
                                                <div className="flex-1">
                                                    <h2 className={`text-xl font-bold transition-colors
                          ${activeLocationId === location.id
                                                            ? 'text-brand-black-static'
                                                            : 'text-brand-white-static'
                                                        }`}
                                                    >
                                                        {location.icon && <span className="mr-2">{location.icon}</span>}
                                                        {location.name}
                                                    </h2>
                                                    {location.subtitle && (
                                                        <p className={`text-sm transition-colors
                            ${activeLocationId === location.id
                                                                ? 'text-brand-black-static/70'
                                                                : 'text-gray-400'
                                                            }`}
                                                        >
                                                            {location.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location body */}
                                        <div className="bg-bg-primary px-6 py-5">
                                            {location.address && (
                                                <p className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                                                    <span className="text-brand-yellow">📍</span>
                                                    {location.address}
                                                </p>
                                            )}
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: location.description }}
                                            />
                                        </div>
                                    </article>

                                </div>
                            ))}
                        </div>

                        {/* Suggested Route */}
                        {article.suggestedRoute && article.suggestedRoute.length > 0 && (
                            <section className="mt-12 p-6 bg-surface rounded-xl border border-surface-2">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🗺️</span>
                                    Ruta sugerida
                                </h2>
                                <p className="text-sm text-text-secondary mb-4">
                                    Medio día, caminable + metro
                                </p>
                                <div className="flex flex-col gap-2">
                                    {article.suggestedRoute.map((id, index) => {
                                        const location = article.locations.find((l) => l.id === id);
                                        if (!location) return null;
                                        return (
                                            <div key={id} className="flex items-center gap-3">
                                                <div className="flex flex-col items-center">
                                                    <span className="w-8 h-8 rounded-full bg-brand-black-static text-brand-yellow flex items-center justify-center font-bold text-sm">
                                                        {index + 1}
                                                    </span>
                                                    {index < article.suggestedRoute!.length - 1 && (
                                                        <div className="w-0.5 h-6 bg-brand-gray/30 my-1"></div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleCardClick(id)}
                                                    className="text-left hover:text-brand-yellow transition-colors"
                                                >
                                                    {location.icon && <span className="mr-1">{location.icon}</span>}
                                                    {location.name}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Recommended Readings */}
                        {article.recommendedReadings && article.recommendedReadings.length > 0 && (
                            <section className="mt-8 p-6 bg-brand-black-static text-brand-white-static rounded-xl">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📚</span>
                                    Lecturas para acompañar la ruta
                                </h2>
                                <ul className="space-y-3">
                                    {article.recommendedReadings.map((book, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-brand-yellow">•</span>
                                            <div>
                                                <span className="font-medium">{book.title}</span>
                                                <span className="text-gray-400"> – {book.author}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

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

                        {/* Author bio */}
                        <div className="mt-8 p-6 bg-bg-primary rounded-lg border border-surface-2">
                            <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 ${article.author.avatar} rounded-full flex-shrink-0`}></div>
                                <div>
                                    <h3 className="font-bold text-lg">{article.author.name}</h3>
                                    <p className="text-sm text-brand-gray mb-3">{article.author.handle}</p>
                                    <p className="text-sm text-brand-gray">{article.author.bio}</p>
                                    <button className="mt-4 btn btn-sm bg-brand-black-static text-brand-white-static hover:bg-brand-gray">
                                        Seguir
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
