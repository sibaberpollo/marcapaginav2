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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light">
      <body className="antialiased bg-bg-page text-text-primary">
        {children}
      </body>
    </html>
  );
}
