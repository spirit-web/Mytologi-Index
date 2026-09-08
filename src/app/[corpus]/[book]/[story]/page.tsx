import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fetchBiblePassage, externalBibleUrl } from "@/lib/bible";
import { StoryProgressControls } from "@/components/StoryProgressControls";
import { QuoteFavoriteControls } from "@/components/QuoteFavoriteControls";
import { countFavoriteQuotesForStory } from "@/lib/quotes";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ corpus: string; book: string; story: string }>;
}) {
  const { corpus: corpusSlug, book: bookSlug, story: storySlug } = await params;

  const story = await prisma.story.findFirst({
    where: {
      slug: storySlug,
      book: { slug: bookSlug, corpus: { slug: corpusSlug } },
    },
    include: {
      book: { include: { corpus: true } },
      characters: { include: { character: true } },
      themes: { include: { theme: true } },
      images: { orderBy: { order: "asc" } },
      petersonSegments: {
        include: { video: { include: { series: true } }, verseNotes: { orderBy: { order: "asc" } } },
      },
      referencesAsTarget: { include: { video: { include: { series: true } }, character: true } },
      progress: true,
      parallelLinks: {
        include: {
          parallel: {
            include: { theme: true, stories: { include: { story: { include: { book: true } } } } },
          },
        },
      },
    },
  });

  if (!story) notFound();

  // Vems ord är story.quote? I "influences"-korpusen (Nietzsche/Jung/
  // Freud m.fl., se README Fas 58+) är citatet PERSONENS EGET — den
  // StoryCharacter-rad som lades till med role "författare" pekar ut
  // vem. Saknas en sådan (alla andra framework-böcker: 12 Rules, We Who
  // Wrestle, Maps of Meaning, Beyond Order) är citatet Petersons eget.
  // Direkt användarönskemål 2026-08-28 (se README Fas 61) — annars går
  // det inte att se VEM som säger vad.
  const quoteAuthorCharacter = story.characters.find((c) => c.role === "författare")?.character;
  const quoteAuthorIsPeterson = story.book.corpus.kind === "framework" && !quoteAuthorCharacter;

  // Bok-interna referenser (t.ex. "12 Rules for Life, Regel 6" ->
  // Solzjenitsyn, eller "We Who Wrestle with God, Kapitel 2" -> Adam och
  // Eva i Edens lustgård): vilka andra personer/berättelser Jordan
  // refererar till INOM just det här kapitlet. bookSourceRef byggs
  // konsekvent som "${bokens namn}, ${story.startRef}" i seed.ts, så
  // samma query fungerar för alla framework-böcker (se seed.ts
  // "Bok-interna referenser"-block för omfattning/källor per bok).
  const bookReferences =
    story.book.corpus.kind === "framework"
      ? await prisma.reference.findMany({
          where: { bookSourceRef: `${story.book.name}, ${story.startRef}` },
          include: {
            story: { include: { book: { include: { corpus: true } } } },
            character: true,
          },
        })
      : [];

  // Omvänd uppslagning för referensAsTarget-sektionen nedan ("Peterson
  // refererar hit från"): bookSourceRef är bara fri text (t.ex. "We Who
  // Wrestle with God, Kapitel 2"), ingen FK — så för att kunna länka
  // VIDARE till den story:n (direkt användarönskemål 2026-08-28, se
  // README Fas 61: "vill kunna gå till de verk där han gjorde
  // kopplingen") måste vi tolka strängen mot samma "${bokens namn}, " +
  // startRef-mönster som seed.ts bygger den med ovan.
  const sourceRefTargets = new Map<
    string,
    { corpusSlug: string; bookSlug: string; storySlug: string; title: string } | null
  >();
  const distinctSourceRefs = [
    ...new Set(story.referencesAsTarget.map((r) => r.bookSourceRef).filter((r): r is string => !!r)),
  ];
  if (distinctSourceRefs.length > 0) {
    const frameworkBooks = await prisma.book.findMany({
      where: { corpus: { kind: "framework" } },
      select: { name: true, slug: true, corpus: { select: { slug: true } } },
    });
    for (const ref of distinctSourceRefs) {
      const matchedBook = frameworkBooks.find((b) => ref.startsWith(`${b.name}, `));
      if (!matchedBook) {
        sourceRefTargets.set(ref, null);
        continue;
      }
      const startRef = ref.slice(matchedBook.name.length + 2);
      const targetStory = await prisma.story.findFirst({
        where: { book: { slug: matchedBook.slug }, startRef },
        select: { slug: true, title: true },
      });
      sourceRefTargets.set(
        ref,
        targetStory
          ? { corpusSlug: matchedBook.corpus.slug, bookSlug: matchedBook.slug, storySlug: targetStory.slug, title: targetStory.title }
          : null,
      );
    }
  }

  // Segment-nivå-koppling finns ännu inte (Phase 2). Tills vidare: visa en
  // grov, omärkt kandidatlista baserad på titel-matchning mot bokens
  // videoserier, så man ser vilka föreläsningar som *troligen* är relevanta.
  const candidateVideos =
    story.petersonSegments.length === 0
      ? await findCandidateVideos(story.title, story.book.name)
      : [];

  // Bibeltext hämtas on-demand — bara för Bibel-korpusen specifikt (INTE
  // alla scripture-korpusar: bible-api.com känner förstås bara till
  // bibelreferenser, inte suror/traktat/Gita-kapitel, se README Fas 65).
  const passage =
    story.book.corpus.slug === "bible"
      ? await fetchBiblePassage(story.startRef, story.endRef)
      : null;

  // Slå upp versnivå-kommentarer per "kapitel:vers" så vi kan visa dem
  // direkt inline efter rätt vers när texten radbryts vers för vers.
  const verseNotesByVerse = new Map<
    string,
    {
      id: string;
      quote: string;
      summary: string;
      verseEnd: number | null;
      quoteIsFavorite: boolean;
      diaryNote: string | null;
    }[]
  >();
  for (const seg of story.petersonSegments) {
    for (const note of seg.verseNotes) {
      const key = `${note.chapter}:${note.verse}`;
      const list = verseNotesByVerse.get(key) ?? [];
      list.push({
        id: note.id,
        quote: note.quote,
        summary: note.summary,
        verseEnd: note.verseEnd,
        quoteIsFavorite: note.quoteIsFavorite,
        diaryNote: note.diaryNote,
      });
      verseNotesByVerse.set(key, list);
    }
  }

  const favoriteQuoteCount = countFavoriteQuotesForStory(story);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href={`/${corpusSlug}/${bookSlug}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
      >
        ← {story.book.name}
      </Link>

      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        {story.title}
      </h1>
      <p className="mb-4 text-sm text-[var(--text-muted)]">
        {story.startRef}
        {story.endRef !== story.startRef ? `–${story.endRef}` : ""}
        {story.seriesTitle ? ` · Del av ${story.seriesTitle}` : ""}
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StoryProgressControls
          storyId={story.id}
          initialCompleted={!!story.progress?.completedAt}
          initialFavorite={!!story.progress?.isFavorite}
        />
        {favoriteQuoteCount > 0 && (
          <Link
            href="/citat"
            className="flex items-center gap-1.5 rounded-full border border-[var(--link-border)] bg-[var(--link-bg)] px-3 py-1 text-xs font-medium text-[var(--link)] transition hover:bg-[var(--link-border)]"
            title="Se alla sparade citat"
          >
            <span aria-hidden>★</span>
            {favoriteQuoteCount} sparat{favoriteQuoteCount === 1 ? "" : "e"} citat i den här berättelsen
          </Link>
        )}
      </div>

      {story.images.length > 0 && (
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-wide text-[var(--text-faint)]">
            {story.book.corpus.slug === "bible"
              ? 'Bildberättelse (parafras från bildkällan — inte bibeltext, se "Text" nedan för det)'
              : "Symbolbilder (se bildtext för sammanhang och källa)"}
          </p>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
            {story.images.map((img) => (
              <figure key={img.id} className="w-[240px] shrink-0 snap-start">
                <Image
                  src={img.path}
                  alt={img.caption ?? ""}
                  width={240}
                  height={180}
                  className="h-[150px] w-full rounded-lg border border-[var(--border)] object-cover"
                />
                {img.caption && (
                  <figcaption className="mt-1.5 text-xs leading-snug text-[var(--text-muted)]">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-faint)]">
            Bilder och bildtexter (översatta):{" "}
            <a
              href={story.images[0].creditUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              {story.images[0].credit}
            </a>
          </p>
        </div>
      )}

      {(story.characters.length > 0 || story.themes.length > 0) && (
        <div className="mb-8 flex flex-wrap gap-1.5">
          {story.characters.map((c) => (
            <Link
              key={c.character.slug}
              href={`/personer/${c.character.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border)] py-1 pl-1 pr-2.5 text-xs text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {c.character.portraitPath && (
                <Image
                  src={c.character.portraitPath}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
              {c.character.name}
            </Link>
          ))}
          {story.themes.map((t) => (
            <Link
              key={t.theme.slug}
              href={`/teman/${t.theme.slug}`}
              className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-2.5 py-1 text-xs text-[var(--accent)] transition hover:bg-[var(--accent-border)]"
            >
              {t.theme.name}
            </Link>
          ))}
        </div>
      )}

      <section className="mb-10 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Text
          </h2>
          {passage && (
            <span className="text-xs text-[var(--text-faint)]">{passage.translationName}</span>
          )}
        </div>

        {passage ? (
          <div>
            {passage.partial && (
              <p className="mb-3 text-sm text-[var(--accent)]">
                Ett eller flera kapitel kunde inte hämtas just nu — texten nedan kan ha luckor.
                Ladda om sidan för att försöka igen.
              </p>
            )}
            <div className="space-y-1">
              {passage.verses.map((v, i) => {
                const notes = verseNotesByVerse.get(`${v.chapter}:${v.verse}`) ?? [];
                return (
                  <div key={`${v.chapter}:${v.verse}`}>
                    {(i === 0 || v.verse === 1) && (
                      <div className="mt-5 mb-1 text-xs font-sans uppercase tracking-wide text-[var(--text-faint)] first:mt-0">
                        Kapitel {v.chapter}
                      </div>
                    )}
                    <p className="font-serif text-[1.05rem] leading-relaxed text-[var(--text)]">
                      <sup className="mr-1 select-none text-[var(--text-faint)]">{v.verse}</sup>
                      {v.text}
                    </p>
                    {notes.map((note, ni) => (
                      <div
                        key={ni}
                        className="my-2 ml-4 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-3"
                      >
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                          Jordan Peterson om {note.verseEnd ? `v. ${v.verse}–${note.verseEnd}` : `v. ${v.verse}`}
                        </p>
                        <blockquote className="mb-2 font-serif italic text-[var(--text)]">
                          "{note.quote}"
                        </blockquote>
                        <p className="text-sm text-[var(--text-muted)]">{note.summary}</p>
                        <QuoteFavoriteControls
                          kind="verse"
                          id={note.id}
                          initialFavorite={note.quoteIsFavorite}
                          initialDiaryNote={note.diaryNote}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : story.book.corpus.slug === "bible" ? (
          <p className="text-sm text-[var(--text-muted)]">
            Kunde inte hämta versstexten just nu (bible-api.com svarade inte). Prova ladda om sidan.
          </p>
        ) : story.quote || story.summary ? (
          <div>
            {story.quote && (
              <>
                {(quoteAuthorCharacter || quoteAuthorIsPeterson) && (
                  <div className="mb-2 flex items-center gap-2">
                    {quoteAuthorIsPeterson ? (
                      <Image
                        src="/images/badges/jordan-peterson-badge.png"
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : quoteAuthorCharacter?.portraitPath ? (
                      <Image
                        src={quoteAuthorCharacter.portraitPath}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-bg)] text-xs font-medium text-[var(--accent)]">
                        {(quoteAuthorCharacter?.name ?? "").charAt(0)}
                      </span>
                    )}
                    <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                      Citat av {quoteAuthorIsPeterson ? "Jordan Peterson" : quoteAuthorCharacter?.name}
                    </span>
                  </div>
                )}
                <blockquote className="mb-3 border-l-2 border-[var(--border)] pl-4 font-serif text-[1.05rem] italic leading-relaxed text-[var(--text)]">
                  "{story.quote}"
                </blockquote>
              </>
            )}
            {story.summary && (
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{story.summary}</p>
            )}
            {story.quote && (
              <QuoteFavoriteControls
                kind="story"
                id={story.id}
                initialFavorite={story.quoteIsFavorite}
                initialDiaryNote={story.diaryNote}
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            Inget citat/sammanfattning inlagt för denna berättelse ännu.
          </p>
        )}

        {story.book.corpus.slug === "bible" && (
          <p className="mt-4 border-t border-[var(--border-soft)] pt-3 text-xs text-[var(--text-faint)]">
            <a
              href={externalBibleUrl(story.startRef, story.endRef)}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--link)] underline underline-offset-2"
            >
              Läs på BibleGateway →
            </a>
          </p>
        )}
      </section>

      {bookReferences.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--link-border)] bg-[var(--link-bg)] p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-[var(--link)]">
            Referenser i det här kapitlet
          </h2>
          <p className="mb-4 text-xs text-[var(--text-faint)]">
            Andra personer, verk eller berättelser Jordan tar upp för att illustrera sin poäng.
          </p>
          <ul className="space-y-4">
            {bookReferences.map((ref) => (
              <li key={ref.id} className="text-sm">
                {ref.character && (
                  <Link
                    href={`/personer/${ref.character.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {ref.character.name}
                  </Link>
                )}
                {ref.story && (
                  <Link
                    href={`/${ref.story.book.corpus.slug}/${ref.story.book.slug}/${ref.story.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {ref.story.title}
                    <span className="text-[var(--text-faint)]">({ref.story.book.name})</span>
                  </Link>
                )}
                <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{ref.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
          Jordan Peterson-guide
        </h2>

        {story.petersonSegments.length > 0 ? (
          <ul className="space-y-3">
            {story.petersonSegments.map((seg) => (
              <li key={seg.id} className="text-sm">
                <a
                  href={`https://youtube.com/watch?v=${seg.video.youtubeId}&t=${seg.startSec}s`}
                  className="font-medium text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  {seg.video.title} — {formatTime(seg.startSec)}
                  {seg.endSec ? `–${formatTime(seg.endSec)}` : ""}
                </a>
                {seg.quote && (
                  <blockquote className="mt-2 border-l-2 border-[var(--accent-border)] pl-3 font-serif italic text-[var(--text)]">
                    "{seg.quote}"
                  </blockquote>
                )}
                {seg.keyPoints && <p className="mt-1 text-[var(--text-muted)]">{seg.keyPoints}</p>}
                {seg.quote && (
                  <QuoteFavoriteControls
                    kind="segment"
                    id={seg.id}
                    initialFavorite={seg.quoteIsFavorite}
                    initialDiaryNote={seg.diaryNote}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : candidateVideos.length > 0 ? (
          <div>
            <p className="mb-3 text-sm text-[var(--text-muted)]">
              Ingen exakt tidsstämpel är annoterad ännu (Phase 2). Troliga
              föreläsningar baserat på titel:
            </p>
            <ul className="space-y-2">
              {candidateVideos.map((v) => (
                <li key={v.id} className="text-sm text-[var(--text)]">
                  {v.title}
                  <span className="ml-2 text-xs text-[var(--text-faint)]">
                    ({v.series.title}
                    {v.series.isPanelDiscussion ? " · panel" : ""}
                    {v.series.requiresPaidAccess ? " · betalvägg" : ""}, ej annoterad)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            Ingen Peterson-föreläsning hittad/kopplad för denna berättelse ännu.
          </p>
        )}
      </section>

      {story.parallelLinks.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--link-border)] bg-[var(--link-bg)] p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--link)]">
            Liknande berättelser (arketyp)
          </h2>
          <ul className="space-y-4">
            {story.parallelLinks.map((link) => (
              <li key={link.parallel.id} className="text-sm">
                <p className="font-medium text-[var(--text)]">
                  {link.parallel.title}
                  {link.parallel.theme && (
                    <span className="ml-2 text-xs font-normal text-[var(--link)]">
                      #{link.parallel.theme.name}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[var(--text-muted)]">{link.parallel.description}</p>
                <ul className="mt-2 space-y-1">
                  {link.parallel.stories
                    .filter((ps) => ps.storyId !== story.id)
                    .map((ps) => (
                      <li key={ps.storyId} className="text-[var(--text-muted)]">
                        ↳ <span className="text-[var(--text)]">{ps.story.title}</span>{" "}
                        ({ps.story.book.name}){ps.note ? ` — ${ps.note}` : ""}
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      {story.referencesAsTarget.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Peterson refererar hit från
          </h2>
          <ul className="space-y-2">
            {story.referencesAsTarget.map((ref) => (
              <li key={ref.id} className="text-sm text-[var(--text-muted)]">
                {ref.character && (
                  <Link
                    href={`/personer/${ref.character.slug}`}
                    className="font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-2"
                  >
                    {ref.character.name}
                  </Link>
                )}
                {ref.work && <span className="italic text-[var(--text-faint)]"> ({ref.work})</span>}
                {ref.character && " — "}
                {ref.video ? (
                  <a
                    href={`https://youtube.com/watch?v=${ref.video.youtubeId}${ref.atSec ? `&t=${ref.atSec}s` : ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-2"
                  >
                    {ref.video.series.title} — {ref.video.title}
                    {ref.atSec ? ` (${formatTime(ref.atSec)})` : ""}
                  </a>
                ) : ref.bookSourceRef ? (
                  (() => {
                    const target = sourceRefTargets.get(ref.bookSourceRef);
                    return target ? (
                      <Link
                        href={`/${target.corpusSlug}/${target.bookSlug}/${target.storySlug}`}
                        className="font-medium text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-2"
                      >
                        {ref.bookSourceRef}
                      </Link>
                    ) : (
                      ref.bookSourceRef
                    );
                  })()
                ) : null}
                {": "}
                {ref.note}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

// Grov sv→en-ordlista bara för att göra kandidatmatchningen mot Petersons
// (engelska) videotitlar användbar i denna prototyp. Ersätts av riktig
// segment-koppling i Phase 2.
const SV_TO_EN: Record<string, string> = {
  kain: "cain", abel: "abel", noa: "noah", jakob: "jacob", isak: "isaac",
  abraham: "abraham", sara: "sarah", lot: "lot", josef: "joseph",
  eva: "eve", adam: "adam", skapelsen: "genesis", sodom: "sodom",
  gomorra: "gomorrah", stege: "ladder", offer: "sacrifice",
  brottas: "wrestling", bröder: "brothers", torn: "tower", babel: "babel",
};

async function findCandidateVideos(storyTitle: string, _bookName: string) {
  const words = storyTitle.toLowerCase().split(/[^a-zåäö]+/).filter((w) => w.length > 2);
  const keywords = words.map((w) => SV_TO_EN[w] ?? w).filter((w) => w.length > 3);

  if (keywords.length === 0) return [];

  // Bara serier som är aktiverade (togglebar Exodus-modul är av som
  // standard, se PetersonSeries.enabledByDefault).
  const all = await prisma.petersonVideo.findMany({
    where: { series: { enabledByDefault: true } },
    include: { series: true },
  });
  return all.filter((v) => {
    const t = v.title.toLowerCase();
    return keywords.some((k) => t.includes(k));
  });
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
