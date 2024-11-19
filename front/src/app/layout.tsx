import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load custom fonts with variable weights
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define metadata for the app, including title and description
export const metadata: Metadata = {
  title:
    "Chess Puzzle Maker | Générez des problèmes d'échec personnalisés",
  description:
    "Générez facilement des dizaines de problèmes d'échecs à imprimer !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="icon"
          sizes="32x32"
          href="/favico-32x32.png"
        />
        <link
          rel="icon"
          sizes="16x16"
          href="/favico-16x16.png"
        />
        <link
          rel="icon"
          href="/favico-48x48.png"
          sizes="48x48"
        />

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Chess Puzzle Maker | Générez des problèmes d'échec personnalisés"
        />
        <meta
          property="og:description"
          content="Générez facilement des dizaines de problèmes d'échecs à imprimer !"
        />
        <meta
          property="og:image"
          content="https://chesspuzzlemaker.com/og-image.png"
        />
        <meta
          property="og:url"
          content="https://chesspuzzlemaker.com"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter Card Meta Tags */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Chess Puzzle Maker | Générez des problèmes d'échec personnalisés"
        />
        <meta
          property="og:image:alt"
          content="Logo of Chess Puzzle Maker with a chessboard background"
        />
        <meta
          name="twitter:description"
          content="Générez facilement des dizaines de problèmes d'échecs à imprimer !"
        />
        <meta
          name="twitter:image"
          content="https://chesspuzzlemaker.com/og-image.png"
        />

        {/* Link to external Roboto font from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
