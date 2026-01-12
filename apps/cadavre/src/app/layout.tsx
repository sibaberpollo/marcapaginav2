import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marcapagina.page";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cadavre — Micronarrativas Colaborativas",
    template: "%s | Cadavre",
  },
  description:
    "Juego colaborativo de escritura creativa donde los participantes escriben historias sin ver el contexto previo.",
  keywords: [
    "escritura creativa",
    "cadavre exquisito",
    "historias colaborativas",
    "microrrelatos",
    "juego de escritura",
  ],
  authors: [{ name: "Marcapágina" }],
  creator: "Marcapágina",
  publisher: "Marcapágina",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${siteUrl}/cadavre`,
    siteName: "Cadavre",
    title: "Cadavre — Micronarrativas Colaborativas",
    description:
      "Juego colaborativo de escritura creativa donde los participantes escriben historias sin ver el contexto previo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cadavre — Micronarrativas Colaborativas",
    description: "Juego colaborativo de escritura creativa.",
  },
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('cadavre-theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

const identityScript = `
(function() {
  var COOKIE_NAME = 'cadavre_anon_id';
  var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  
  function setCookie(name, value) {
    var maxAge = 30 * 24 * 60 * 60;
    document.cookie = name + '=' + value + '; path=/; max-age=' + maxAge + '; samesite=lax';
  }
  
  function generateUUID() {
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    var d = Date.now();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  
  try {
    var existing = getCookie(COOKIE_NAME);
    if (!existing || !UUID_REGEX.test(existing)) {
      var id = localStorage.getItem(COOKIE_NAME);
      if (!id || !UUID_REGEX.test(id)) {
        id = generateUUID();
        localStorage.setItem(COOKIE_NAME, id);
      }
      setCookie(COOKIE_NAME, id);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: identityScript }} />
      </head>
      <body
        className="antialiased bg-bg-page text-text-primary transition-colors duration-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
