import type { Metadata, Viewport } from "next";
import Image from "next/image";
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
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-3">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 font-serif text-lg font-semibold tracking-tight text-[var(--text)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
            >
              Berättelseindex
            </Link>
            <nav className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <Link
                href="/personer"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2 text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
              >
                Personer
              </Link>
              <Link
                href="/teman"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2 text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
              >
                Teman
              </Link>
              <Link
                href="/citat"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2 text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
              >
                Citat
              </Link>
              <Link
                href="/tidslinje"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2 text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
              >
                Tidslinje
              </Link>
              <Link
                href="/tidslinje-historisk"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2 text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
              >
                Historik
              </Link>
              <Link
                href="/jordans-mytologi"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2 text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
              >
                Mytologi
              </Link>
              <Link
                href="/framsteg"
                title="Ditt framsteg"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1 shadow-sm transition hover:scale-105 hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)]"
              >
                <Image
                  src="/images/badges/jordan-peterson-badge.png"
                  alt="Gå till ditt framsteg"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              </Link>
            </nav>
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
