import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCharacterStats } from "@/lib/gamification";
import { fetchBiblePassage, countWords, lengthLabel } from "@/lib/bible";

export default async function BookPage({
  params,
}: {
  params: Promise<{ corpus: string; book: string }>;
}) {
  const { corpus: corpusSlug, book: bookSlug } = await params;

  const book = await prisma.book.findFirst({
    where: { slug: bookSlug, corpus: { slug: corpusSlug } },
    include: {
      corpus: true,
      stories: {
        orderBy: { orderInBook: "asc" },
        include: {
          characters: { include: { character: true } },
          themes: { include: { theme: true } },
          images: { orderBy: { order: "asc" } },
          petersonSegments: { include: { video: true } },
          // Personer/verk Peterson REFERERAR till i samband med storyn
          // (Nietzsche, Jung, Disney-filmer, ...) — framework-böcker som
          // Maps of Meaning har annars inga riktiga StoryCharacter-rader
          // alls, se användarfeedback och gamification.ts.
          referencesAsTarget: { include: { character: true } },
          progress: true,
        },
      },
    },
  });

  if (!book) notFound();

  const completedCount = book.stories.filter((s) => s.progress?.completedAt).length;

  // Karaktärsremsan under "Om boken": alla karaktärer som antingen
  // förekommer SOM person i någon av bokens berättelser (StoryCharacter)
  // ELLER som Peterson refererar till i samband med en av dem
  // (Reference) — det senare är hur t.ex. Maps of Meaning/12 Rules for
  // Life får en karaktärsremsa alls, eftersom de saknar riktiga
  // StoryCharacter-rader. x/y räknas GLOBALT (över hela appen) — en
  // karaktär som Mose räknas likadant oavsett om man tittar på den från
  // Exodus- eller Matteus-sidan, se gamification.ts.
  const bookCharacterSlugs = new Set([
    ...book.stories.flatMap((s) => s.characters.map((c) => c.character.slug)),
    ...book.stories.flatMap((s) => s.referencesAsTarget.flatMap((r) => (r.character ? [r.character.slug] : []))),
  ]);
  const allCharacterStats = await getCharacterStats();
  const bookCharacterStats = allCharacterStats.filter((c) => bookCharacterSlugs.has(c.slug));

  // Ordantal per story — "är det här en lång eller kort berättelse?"
  // (direkt användarfeedback). Skriftkorpusar: räknar den faktiska
  // bibeltexten (fetchBiblePassage läser bara redan inlästa lokala
  // JSON-filer, ingen nätverksanrop — billigt att göra per story här).
  // Framework-böcker saknar löpande källtext, så där räknas citat +
  // sammanfattning istället (bästa tillgängliga proxy).
  const wordCounts = new Map<string, number>();
  await Promise.all(
    book.stories.map(async (s) => {
      if (book.corpus.kind === "scripture") {
        const passage = await fetchBiblePassage(s.startRef, s.endRef);
        const n = passage ? passage.verses.reduce((sum, v) => sum + countWords(v.text), 0) : 0;
        wordCounts.set(s.id, n);
      } else {
        wordCounts.set(s.id, countWords(`${s.quote ?? ""} ${s.summary ?? ""}`));
      }
    }),
  );

  // Gruppera: standalone-berättelser vs. cykler (seriesSlug).
  const standalone = book.stories.filter((s) => !s.seriesSlug);
  const seriesMap = new Map<string, typeof book.stories>();
  for (const s of book.stories) {
    if (!s.seriesSlug) continue;
    const list = seriesMap.get(s.seriesSlug) ?? [];
    list.push(s);
    seriesMap.set(s.seriesSlug, list);
  }

  // Härledda siffror för bokpresentationen: unika karaktärer och unika
  // Peterson-videor kopplade till någon story i boken (inte hårdkodat,
  // uppdateras automatiskt när fler stories/segment läggs till).
  const characterMap = new Map<string, string>(); // slug -> namn
  const videoMap = new Map<string, string>(); // youtubeId -> titel
  for (const s of book.stories) {
    for (const c of s.characters) characterMap.set(c.character.slug, c.character.name);
    for (const r of s.referencesAsTarget) if (r.character) characterMap.set(r.character.slug, r.character.name);
    for (const seg of s.petersonSegments) videoMap.set(seg.video.youtubeId, seg.video.title);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="text-sm text-[var(--text-faint)] transition hover:text-[var(--text)]"
      >
        ← {book.corpus.name}
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        {book.name}
      </h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        {standalone.length} enskilda berättelser · {seriesMap.size} berättelsecykler
        ({[...seriesMap.values()].reduce((n, l) => n + l.length, 0)} avsnitt) ·{" "}
        <Link href="/framsteg" className="text-[var(--accent)] hover:underline">
          {completedCount}/{book.stories.length} avklarade
        </Link>
      </p>

      {(book.description || book.authorship || book.traditions) && (
        <section className="mb-10 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-sm shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Om boken
          </h2>
          {book.description && <p className="text-[var(--text)]">{book.description}</p>}
          {book.authorship && (
            <p className="text-[var(--text-muted)]">
              <span className="font-medium text-[var(--text)]">Författarskap: </span>
              {book.authorship}
            </p>
          )}
          {book.traditions && (
            <p className="text-[var(--text-muted)]">
              <span className="font-medium text-[var(--text)]">Religiös koppling: </span>
              {book.traditions}
            </p>
          )}
          <p className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--border-soft)] pt-3 text-xs text-[var(--text-faint)]">
            <span>
              {characterMap.size} karaktär{characterMap.size === 1 ? "" : "er"}
              {characterMap.size > 0 && ": " + [...characterMap.values()].join(", ")}
            </span>
          </p>
          <p className="text-xs text-[var(--text-faint)]">
            {videoMap.size} Peterson-video{videoMap.size === 1 ? "" : "r"} kopplade till böckens berättelser
          </p>
        </section>
      )}

      {bookCharacterStats.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Karaktärer i boken
          </h2>
          <div className="flex flex-wrap gap-3">
            {bookCharacterStats.map((c) => (
              <Link
                key={c.slug}
                href={`/personer/${c.slug}`}
                className="flex w-[76px] flex-col items-center gap-1.5 rounded-lg p-1.5 text-center transition hover:bg-[var(--accent-bg)]"
              >
                {c.portraitPath ? (
                  <Image
                    src={c.portraitPath}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border border-[var(--border)] object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] font-serif text-lg text-[var(--text-faint)]">
                    {c.name.charAt(0)}
                  </span>
                )}
                <span className="w-full truncate text-xs font-medium text-[var(--text)]">{c.name}</span>
                <span
                  className={`text-[11px] tabular-nums ${
                    c.completed === c.total ? "text-[var(--success)]" : "text-[var(--text-faint)]"
                  }`}
                >
                  {c.completed}/{c.total}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {seriesMap.size > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Berättelsecykler
          </h2>
          <div className="space-y-4">
            {[...seriesMap.entries()].map(([slug, list]) => (
              <div
                key={slug}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-sm"
              >
                <h3 className="mb-2 font-serif text-lg font-medium text-[var(--text)]">
                  {list[0].seriesTitle ?? slug}
                </h3>
                <ol className="divide-y divide-[var(--border-soft)]">
                  {list
                    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
                    .map((s) => (
                      <li key={s.id}>
                        <StoryRow book={book} story={s} wordCount={wordCounts.get(s.id) ?? 0} />
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}

      {standalone.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Enskilda berättelser
          </h2>
          <ul className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
            {standalone.map((s) => (
              <li key={s.id}>
                <StoryRow book={book} story={s} wordCount={wordCounts.get(s.id) ?? 0} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function StoryRow({
  book,
  story,
  wordCount,
}: {
  book: { slug: string; corpus: { slug: string } };
  wordCount: number;
  story: {
    id: string;
    slug: string;
    title: string;
    startRef: string;
    endRef: string;
    thumbnailOrder: number | null;
    quote: string | null;
    isWellKnown: boolean;
    characters: { character: { name: string; slug: string } }[];
    themes: { theme: { name: string; slug: string } }[];
    images: { order: number; path: string }[];
    petersonSegments: unknown[];
    progress?: { completedAt: Date | null; isFavorite: boolean } | null;
  };
}) {
  const completed = !!story.progress?.completedAt;
  const favorite = !!story.progress?.isFavorite;
  // Visa story.thumbnailOrder om satt (se schema-kommentaren — många
  // källset börjar med en abstrakt "titelkort"-siluett som funkar dåligt
  // som litet omslag), annars första bilden i galleriet som tidigare.
  const thumb =
    story.images.find((img) => img.order === (story.thumbnailOrder ?? 1)) ?? story.images[0];
  // Prioritetsnivå: Tier 1 = har verifierat Peterson-innehåll (segment
  // eller bokcitat), Tier 2 = handplockat känd/central (isWellKnown),
  // Tier 3 = default, inget märke. Se README "Prioritetsnivåer".
  const tier = story.petersonSegments.length > 0 || !!story.quote ? 1 : story.isWellKnown ? 2 : 3;
  return (
    <div className="flex flex-col gap-2 px-5 py-4 transition hover:bg-[var(--accent-bg)]">
      <Link
        href={`/${book.corpus.slug}/${book.slug}/${story.slug}`}
        className="flex min-w-0 items-center gap-3"
      >
        {thumb && (
          <Image
            src={thumb.path}
            alt=""
            width={56}
            height={42}
            className="h-[42px] w-14 shrink-0 rounded-md border border-[var(--border)] object-cover"
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 font-medium text-[var(--text)]">
              {completed && (
                <span
                  aria-label="Avklarad"
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--success)]"
                >
                  <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 text-white" fill="none" aria-hidden>
                    <path
                      d="M3 8.5L6.2 11.5L13 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              {favorite && (
                <span aria-label="Extra viktig" className="shrink-0 text-[var(--link)]">
                  ★
                </span>
              )}
              <TierBadge tier={tier} />
              <span className="truncate">{story.title}</span>
            </span>
            <span className="shrink-0 text-xs text-[var(--text-faint)]">
              {story.startRef}
              {story.endRef !== story.startRef ? `–${story.endRef.replace(/^.*?(\d)/, "$1")}` : ""}
            </span>
          </div>
          {wordCount > 0 && (
            <span className="text-xs text-[var(--text-faint)]">
              {wordCount} ord · {lengthLabel(wordCount)}
            </span>
          )}
        </div>
      </Link>
      {/* Karaktärer och teman på varsin rad under själva raden (i stället
          för att flyta som ett enda ombrytande kluster till höger) — ser
          mindre rörigt ut, särskilt för stories med många taggar. Ligger
          utanför ovanstående Link (kan inte nästla <a> i <a>), men
          fortfarande innanför den hover-bakgrundsfärgade ytterbehållaren. */}
      {story.characters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-[68px]">
          {story.characters.map((c) => (
            <Link
              key={c.character.slug}
              href={`/personer/${c.character.slug}`}
              className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {c.character.name}
            </Link>
          ))}
        </div>
      )}
      {story.themes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-[68px]">
          {story.themes.map((t) => (
            <Link
              key={t.theme.slug}
              href={`/teman/${t.theme.slug}`}
              className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-2 py-0.5 text-xs text-[var(--accent)] transition hover:bg-[var(--accent-border)]"
            >
              {t.theme.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Prioritetsmärke: Tier 1 = Jordans porträtt (verifierat Peterson-
// innehåll finns), Tier 2 = fylld stjärna (handplockat känd/central
// berättelse), Tier 3 = inget märke alls (frånvaro = minst känd/relevant).
// Se README "Prioritetsnivåer" för resonemang bakom indelningen.
function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  if (tier === 1) {
    return (
      <Image
        src="/images/badges/jordan-peterson-badge.png"
        alt="Analyserad av Jordan Peterson"
        title="Jordan Peterson har analyserat den här berättelsen"
        width={18}
        height={18}
        className="h-[18px] w-[18px] shrink-0 rounded-full"
      />
    );
  }
  if (tier === 2) {
    return (
      <span
        aria-label="Känd/central berättelse"
        title="En känd, central berättelse"
        className="shrink-0 text-sm leading-none text-[var(--accent)]"
      >
        ★
      </span>
    );
  }
  return null;
}
