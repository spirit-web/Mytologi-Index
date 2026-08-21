import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
      parallelLinks: { include: { parallel: { include: { theme: true, stories: { include: { story: { include: { book: true } } } } } } } },
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

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href={`/${corpusSlug}/${bookSlug}`}
        className="text-sm text-stone-400 hover:text-stone-600"
      >
        ← {story.book.name}
      </Link>

      <h1 className="mt-2 mb-1 text-3xl font-semibold tracking-tight text-stone-900">
        {story.title}
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        {story.startRef}
        {story.endRef !== story.startRef ? `–${story.endRef}` : ""}
        {story.seriesTitle ? ` · Del av ${story.seriesTitle}` : ""}
      </p>

      {(story.characters.length > 0 || story.themes.length > 0) && (
        <div className="mb-8 flex flex-wrap gap-1.5">
          {story.characters.map((c) => (
            <span
              key={c.character.name}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600"
            >
              {c.character.name}
            </span>
          ))}
          {story.themes.map((t) => (
            <span
              key={t.theme.name}
              className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700"
            >
              {t.theme.name}
            </span>
          ))}
        </div>
      )}

      <section className="mb-10 rounded-lg border border-stone-200 p-5">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-stone-400">
          Text
        </h2>
        <p className="text-sm text-stone-500">
          Verstext hämtas on-demand från en öppen bibel-API (t.ex. bible-api.com,
          World English Bible/public domain) — inte inlagd i databasen, för att
          undvika att lagra copyrightskyddad översättning. TODO: koppla in
          fetch mot {story.startRef}–{story.endRef}.
        </p>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50/40 p-5">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-amber-700">
          Jordan Peterson-guide
        </h2>

        {story.petersonSegments.length > 0 ? (
          <ul className="space-y-3">
            {story.petersonSegments.map((seg) => (
              <li key={seg.id} className="text-sm">
                <a
                  href={`https://youtube.com/watch?v=${seg.video.youtubeId}&t=${seg.startSec}s`}
                  className="font-medium text-amber-800 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {seg.video.title} — {formatTime(seg.startSec)}
                  {seg.endSec ? `–${formatTime(seg.endSec)}` : ""}
                </a>
                {seg.keyPoints && <p className="mt-1 text-stone-600">{seg.keyPoints}</p>}
              </li>
            ))}
          </ul>
        ) : candidateVideos.length > 0 ? (
          <div>
            <p className="mb-3 text-sm text-stone-500">
              Ingen exakt tidsstämpel är annoterad ännu (Phase 2). Troliga
              föreläsningar baserat på titel:
            </p>
            <ul className="space-y-2">
              {candidateVideos.map((v) => (
                <li key={v.id} className="text-sm text-stone-700">
                  {v.title}
                  <span className="ml-2 text-xs text-stone-400">
                    ({v.series.title}
                    {v.series.isPanelDiscussion ? " · panel" : ""}
                    {v.series.requiresPaidAccess ? " · betalvägg" : ""}, ej annoterad)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-stone-500">
            Ingen Peterson-föreläsning hittad/kopplad för denna berättelse ännu.
          </p>
        )}
      </section>

      {story.parallelLinks.length > 0 && (
        <section className="mt-6 rounded-lg border border-sky-200 bg-sky-50/40 p-5">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-sky-700">
            Liknande berättelser (arketyp)
          </h2>
          <ul className="space-y-4">
            {story.parallelLinks.map((link) => (
              <li key={link.parallel.id} className="text-sm">
                <p className="font-medium text-sky-900">
                  {link.parallel.title}
                  {link.parallel.theme && (
                    <span className="ml-2 text-xs font-normal text-sky-600">
                      #{link.parallel.theme.name}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-stone-600">{link.parallel.description}</p>
                <ul className="mt-2 space-y-1">
                  {link.parallel.stories
                    .filter((ps) => ps.storyId !== story.id)
                    .map((ps) => (
                      <li key={ps.storyId} className="text-stone-500">
                        ↳ <span className="text-stone-700">{ps.story.title}</span>{" "}
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
        <section className="mt-6 rounded-lg border border-stone-200 p-5">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-400">
            Peterson refererar hit från
          </h2>
          <ul className="space-y-2">
            {story.referencesAsTarget.map((ref) => (
              <li key={ref.id} className="text-sm text-stone-600">
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
