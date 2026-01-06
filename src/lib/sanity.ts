import { createClient } from '@sanity/client';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

// Create Sanity client with CDN enabled in production
export const client = createClient({
    projectId: projectId!,
    dataset: dataset!,
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production', // CDN in production, direct API in development
});

/**
 * Execute a GROQ query against Sanity
 */
export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!projectId || !dataset) {
        throw new Error('Faltan variables de entorno de Sanity');
    }

    try {
        const result = await client.fetch<T>(query, params);
        return result;
    } catch (error) {
        console.error('Error al consultar Sanity:', error);
        throw error;
    }
}
