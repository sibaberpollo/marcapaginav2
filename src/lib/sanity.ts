const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';
const token = process.env.SANITY_READ_TOKEN; // opcional para datasets privados
const apiPathVersion = apiVersion.startsWith('v') ? apiVersion : `v${apiVersion}`;

interface SanityQueryResult<T> {
  result?: T;
  ms?: number;
  query?: string;
  error?: {
    description?: string;
    message?: string;
  };
}

/**
 * Ejecuta un query GROQ contra la API HTTP de Sanity usando las variables públicas.
 */
export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!projectId || !dataset) {
    throw new Error('Faltan variables de entorno de Sanity');
  }

  const url = new URL(`https://${projectId}.api.sanity.io/${apiPathVersion}/data/query/${dataset}`);
  url.searchParams.set('query', query);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(`$${key}`, typeof value === 'string' ? JSON.stringify(value) : String(value));
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/json',
    },
  });

  const raw = await res.text();
  let data: SanityQueryResult<T> | null = null;

  try {
    data = JSON.parse(raw);
  } catch {
    // no-op, fall back to raw text
  }

  if (!res.ok || data?.error) {
    const details =
      data?.error?.description ||
      data?.error?.message ||
      raw ||
      `Status ${res.status} ${res.statusText}`;
    throw new Error(`Error al consultar Sanity: ${details}`);
  }

  if (!data || typeof data.result === 'undefined') {
    throw new Error('Respuesta vacía de Sanity');
  }

  return data.result;
}
