import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ModeSync from "@/components/ModeSync";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ErrorBoundary from "@/components/ErrorBoundary";
import WorldTransition from "@/components/WorldTransition";
import Lightbox from "@/components/Lightbox";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Halil Bagosi — Painting, Photography & Film",
  description:
    "The portfolio of Halil Bagosi: tactile fine-art painting, high-end photography, and cinematic film direction.",
};

// Runs before hydration so the correct world theme is painted immediately,
// avoiding a flash from the default painting palette to the persisted one.
const themeScript = `(function(){try{var raw=localStorage.getItem('portfolio-mode');var mode='painting';if(raw){var p=JSON.parse(raw);if(p&&p.state&&p.state.mode)mode=p.state.mode;}document.documentElement.setAttribute('data-mode',mode);}catch(e){document.documentElement.setAttribute('data-mode','painting');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-mode="painting"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ModeSync />
        <WorldTransition />
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>
        <ErrorBoundary>
          <CustomCursor />
        </ErrorBoundary>

        <ErrorBoundary>
          {children}
        </ErrorBoundary>

        <ErrorBoundary>
          <Lightbox />
        </ErrorBoundary>
      </body>
    </html>
  );
}
