import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fetchBiblePassage } from "@/lib/bible";

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
      petersonSegments: { include: { video: { include: { series: true } } } },
      referencesAsTarget: { include: { video: { include: { series: true } } } },
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

      {(story.characters.length > 0 || story.themes.length > 0) && (
        <div className="mb-8 flex flex-wrap gap-1.5">
          {story.characters.map((c) => (
            <span
              key={c.character.name}
              className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
            >
              {c.character.name}
            </span>
          ))}
          {story.themes.map((t) => (
            <span
              key={t.theme.name}
              className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-2.5 py-1 text-xs text-[var(--accent)]"
            >
              {t.theme.name}
            </span>
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
            {passage.truncated && (
              <p className="mb-3 text-sm text-[var(--text-muted)]">
                Berättelsen spänner över {passage.truncated.fullRangeLabel} — bible-api.com tillåter
                bara utdrag inom en kapitelgräns, så här visas öppningskapitlet.{" "}
                <a
                  href={passage.truncated.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--link)] underline underline-offset-2"
                >
                  Läs hela texten på BibleGateway →
                </a>
              </p>
            )}
            <div className="font-serif text-[1.05rem] leading-relaxed text-[var(--text)]">
              {passage.verses.map((v) => (
                <span key={`${v.chapter}:${v.verse}`}>
                  <sup className="mr-1 select-none text-[var(--text-faint)]">{v.verse}</sup>
                  {v.text}{" "}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            {story.book.corpus.kind === "scripture"
              ? "Kunde inte hämta versstexten just nu (bible-api.com svarade inte). Prova ladda om sidan."
              : "Ingen extern källtext kopplad för detta ramverkskapitel ännu."}
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
