import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fetchBiblePassage, externalBibleUrl } from "@/lib/bible";

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

  // Segment-nivå-koppling finns ännu inte (Phase 2). Tills vidare: visa en
  // grov, omärkt kandidatlista baserad på titel-matchning mot bokens
  // videoserier, så man ser vilka föreläsningar som *troligen* är relevanta.
  const candidateVideos =
    story.petersonSegments.length === 0
      ? await findCandidateVideos(story.title, story.book.name)
      : [];

  // Bibeltext hämtas on-demand (bara för scripture-korpusar, se README).
  const passage =
    story.book.corpus.kind === "scripture"
      ? await fetchBiblePassage(story.startRef, story.endRef)
      : null;

  // Slå upp versnivå-kommentarer per "kapitel:vers" så vi kan visa dem
  // direkt inline efter rätt vers när texten radbryts vers för vers.
  const verseNotesByVerse = new Map<
    string,
    { quote: string; summary: string; verseEnd: number | null }[]
  >();
  for (const seg of story.petersonSegments) {
    for (const note of seg.verseNotes) {
      const key = `${note.chapter}:${note.verse}`;
      const list = verseNotesByVerse.get(key) ?? [];
      list.push({ quote: note.quote, summary: note.summary, verseEnd: note.verseEnd });
      verseNotesByVerse.set(key, list);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href={`/${corpusSlug}/${bookSlug}`}
        className="text-sm text-[var(--text-faint)] transition hover:text-[var(--text)]"
      >
        ← {story.book.name}
      </Link>

      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        {story.title}
      </h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        {story.startRef}
        {story.endRef !== story.startRef ? `–${story.endRef}` : ""}
        {story.seriesTitle ? ` · Del av ${story.seriesTitle}` : ""}
      </p>

      {story.images.length > 0 && (
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-wide text-[var(--text-faint)]">
            Bildberättelse (parafras från bildkällan — inte bibeltext, se "Text" nedan för det)
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
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : story.book.corpus.kind === "scripture" ? (
          <p className="text-sm text-[var(--text-muted)]">
            Kunde inte hämta versstexten just nu (bible-api.com svarade inte). Prova ladda om sidan.
          </p>
        ) : story.quote || story.summary ? (
          <div>
            {story.quote && (
              <blockquote className="mb-3 border-l-2 border-[var(--border)] pl-4 font-serif text-[1.05rem] italic leading-relaxed text-[var(--text)]">
                "{story.quote}"
              </blockquote>
            )}
            {story.summary && (
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{story.summary}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            Ingen extern källtext kopplad för detta ramverkskapitel ännu.
          </p>
        )}

        {story.book.corpus.kind === "scripture" && (
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

      <section className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] p-6 shadow-sm">
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
                {ref.character && " — "}
                {ref.video ? `${ref.video.series.title} — ${ref.video.title}` : ref.bookSourceRef}
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
