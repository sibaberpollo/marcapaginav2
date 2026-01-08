'use client';

import Link from 'next/link';
import { Recipe } from '@/lib/types/article';
import { Avatar } from '@/components';

interface RecipeLayoutProps {
    article: Recipe;
}

function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function RecipeLayout({ article }: RecipeLayoutProps) {
    const sortedSteps = [...article.steps].sort((a, b) => a.order - b.order);

    return (
        <main className="min-h-screen pb-20 lg:pb-0">
            {/* Hero Header */}
            <header className="bg-brand-black-static text-brand-white-static">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="badge bg-brand-yellow text-brand-black-static border-none text-xs font-bold">
                            {article.recipeType === 'drink' ? 'RECETA DE TRAGO' : 'RECETA'}
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
                        <Avatar name={article.author.name} size="md" className="bg-brand-yellow text-brand-black-static" />
                        <div>
                            <div className="font-medium">{article.author.name}</div>
                            <div className="text-sm text-gray-400">
                                {formatDate(article.publishedAt)} · {article.readTime} de lectura
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Sidebar - Recipe Card */}
                    <aside className="lg:col-span-1 mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-20 space-y-6">
                            {/* Recipe Info Card */}
                            <div className="bg-brand-yellow text-brand-black-static rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl">{article.recipeType === 'drink' ? '🍹' : '🍽️'}</span>
                                    <h2 className="text-xl font-bold">La receta</h2>
                                </div>

                                {/* Meta info */}
                                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                                    {article.servings && (
                                        <div className="flex items-center gap-1">
                                            <span>👥</span>
                                            <span>{article.servings}</span>
                                        </div>
                                    )}
                                    {article.prepTime && (
                                        <div className="flex items-center gap-1">
                                            <span>⏱️</span>
                                            <span>{article.prepTime}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Ingredients */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-sm uppercase tracking-wider mb-3 border-b border-brand-black-static/20 pb-2">
                                        Ingredientes
                                    </h3>
                                    <ul className="space-y-2">
                                        {article.ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-brand-black-static/60">•</span>
                                                <span>
                                                    {ingredient.quantity && (
                                                        <span className="font-medium">{ingredient.quantity} </span>
                                                    )}
                                                    {ingredient.unit && (
                                                        <span>{ingredient.unit} </span>
                                                    )}
                                                    <span>{ingredient.name}</span>
                                                    {ingredient.notes && (
                                                        <span className="text-brand-black-static/70 italic"> ({ingredient.notes})</span>
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Utensils */}
                                {article.utensils && article.utensils.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-wider mb-3 border-b border-brand-black-static/20 pb-2">
                                            Utensilios
                                        </h3>
                                        <ul className="space-y-1">
                                            {article.utensils.map((utensil, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm">
                                                    <span className="text-brand-black-static/60">•</span>
                                                    <span>{utensil}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Related Author Bio */}
                            {article.relatedAuthor && (
                                <div className="bg-surface rounded-xl p-5 border border-surface-2">
                                    <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-text-secondary">
                                        Sobre el autor literario
                                    </h3>
                                    <p className="font-medium mb-2">{article.relatedAuthor.name}</p>
                                    {article.relatedAuthor.bio && (
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            {article.relatedAuthor.bio}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Literary content with interweaved recipe steps */}
                        <article className="prose prose-lg max-w-none">
                            {/* Featured image */}
                            {article.featuredImage && (
                                <figure className="mb-8">
                                    <img
                                        src={article.featuredImage}
                                        alt={article.title}
                                        className="w-full rounded-xl shadow-lg"
                                    />
                                </figure>
                            )}

                            {/* Render steps with literary notes interweaved */}
                            {sortedSteps.map((step, index) => (
                                <div key={step.order} className="mb-8">
                                    {/* Literary note before the step */}
                                    {step.literaryNote && (
                                        <div
                                            className="article-content mb-6"
                                            dangerouslySetInnerHTML={{ __html: step.literaryNote }}
                                        />
                                    )}

                                    {/* Recipe step */}
                                    <div className="bg-brand-yellow/10 border-l-4 border-brand-yellow rounded-r-lg p-4 my-6">
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-yellow text-brand-black-static flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <p className="text-text-primary font-medium leading-relaxed pt-1">
                                                {step.instruction}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Main literary content at the end */}
                            {article.literaryContent && (
                                <div
                                    className="article-content mt-8"
                                    dangerouslySetInnerHTML={{ __html: article.literaryContent }}
                                />
                            )}
                        </article>

                        {/* Tags */}
                        <div className="mt-12 pt-6 border-t border-surface-2">
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
                                <Avatar name={article.author.name} size="xl" className="bg-brand-yellow text-brand-black-static" />
                                <div>
                                    <h3 className="font-bold text-lg">{article.author.name}</h3>
                                    <p className="text-sm text-brand-gray mb-3">{article.author.handle}</p>
                                    {article.author.bio && (
                                        <p className="text-sm text-brand-gray">{article.author.bio}</p>
                                    )}
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
