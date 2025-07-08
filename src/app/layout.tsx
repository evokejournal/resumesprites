import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeSprites - Your Dynamic Resume Builder",
  description: "Create and share interactive resumes with unique links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bungee&family=Gloock&family=Inter:wght@400;500;700&family=Orbitron:wght@400;700&family=Pixelify+Sans:wght@400..700&family=Rock+Salt&family=Space+Grotesk:wght@400;500;700&family=Ultra&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
