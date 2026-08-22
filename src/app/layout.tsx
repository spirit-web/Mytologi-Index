import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berättelseindex",
  description: "Bibelns berättelser med Jordan Peterson som guide",
};

// Talar om för webbläsaren att sidan faktiskt stödjer både ljust och mörkt
// läge, så den inte försöker "auto-invertera" färgerna själv (vilket gav
// nästan osynlig text i mörkt läge tidigare).
export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-[var(--border-soft)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="font-serif text-lg font-semibold tracking-tight text-[var(--text)]"
            >
              Berättelseindex
            </Link>
            <span className="text-xs uppercase tracking-wide text-[var(--text-faint)]">
              Bibeln · Peterson-guide
            </span>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-[var(--border-soft)] px-6 py-6 text-center text-xs text-[var(--text-faint)]">
          Berättelseillustrationer:{" "}
          <a
            href="https://www.freebibleimages.org/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            FreeBibleimages.org
          </a>{" "}
          (huvudsakligen Lambsongs / Jill Kemp &amp; Richard Gunther), CC BY-NC.
          Bibeltext: 1917 års kyrkobibel (upphovsrättsfri), data från{" "}
          <a
            href="https://spraakbanken.gu.se/en/resources/bibel1917"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Språkbanken
          </a>
          , CC BY 4.0. Gudsnamnet normaliserat till "Gud" genomgående.
        </footer>
      </body>
    </html>
  );
}
