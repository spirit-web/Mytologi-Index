import Image from "next/image";
import Link from "next/link";
import { getGamificationStats, getCharacterStats, getDynamicBadges, BADGES } from "@/lib/gamification";

export default async function ProgressPage() {
  const [stats, characterStats] = await Promise.all([getGamificationStats(), getCharacterStats()]);

  const overallPct = pct(stats.totalCompleted, stats.totalStories);
  const petersonPct = pct(stats.petersonCompleted, stats.petersonTotal);
  // Bok-/cykel-emblem härleds live från databasen (se getDynamicBadges)
  // så en ny bok eller berättelsecykel får ett eget emblem automatiskt,
  // ihop med de fasta, bok-oberoende emblemen i BADGES.
  const allBadges = [...BADGES, ...getDynamicBadges(stats)];
  const earnedBadges = allBadges.filter((b) => b.isEarned(stats));
  const lockedBadges = allBadges.filter((b) => !b.isEarned(stats));
  const favorites = stats.stories.filter((s) => s.favorite);
  const earnedCharacterBadges = characterStats.filter((c) => c.completed === c.total);
  const lockedCharacterBadges = characterStats.filter((c) => c.completed !== c.total);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-[var(--text-faint)] transition hover:text-[var(--text)]">
        ← Berättelseindex
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        Ditt framsteg
      </h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">
        {stats.totalCompleted} av {stats.totalStories} berättelser avklarade · {stats.points} poäng ·{" "}
        {earnedBadges.length}/{allBadges.length} emblem
      </p>

      {/* Jordan Peterson-visdomsmätare */}
      <section className="mb-8 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] p-6 shadow-sm">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
            Jordan Peterson-visdom
          </h2>
          <span className="text-sm font-medium text-[var(--accent)]">{petersonPct}%</span>
        </div>
        <ProgressBar pct={petersonPct} tone="accent" />
        <p className="mt-2 text-xs text-[var(--text-faint)]">
          {stats.petersonCompleted} av {stats.petersonTotal} berättelser med verifierat
          Peterson-innehåll (tidsstämplat segment eller bokcitat) avklarade.
        </p>
      </section>

      {/* Övergripande + poäng */}
      <section className="mb-10 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-sm">
          <p className="mb-1 text-xs uppercase tracking-wide text-[var(--text-faint)]">Totalt</p>
          <p className="mb-2 font-serif text-2xl font-semibold text-[var(--text)]">{overallPct}%</p>
          <ProgressBar pct={overallPct} tone="neutral" />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-sm">
          <p className="mb-1 text-xs uppercase tracking-wide text-[var(--text-faint)]">Visdomspoäng</p>
          <p className="font-serif text-2xl font-semibold text-[var(--text)] tabular-nums">
            {stats.points}
          </p>
          <p className="mt-1 text-xs text-[var(--text-faint)]">
            {POINTS_HINT}
          </p>
        </div>
      </section>

      {/* Emblem */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
          Emblem ({earnedBadges.length}/{allBadges.length})
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[...earnedBadges, ...lockedBadges].map((badge) => {
            const earned = badge.isEarned(stats);
            const p = Math.round(badge.progress(stats) * 100);
            return (
              <div
                key={badge.slug}
                className={`rounded-xl border p-4 text-center shadow-sm ${
                  earned
                    ? "border-[var(--accent-border)] bg-[var(--accent-bg)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] opacity-60"
                }`}
                title={badge.description}
              >
                <div className={`mb-1.5 text-3xl ${earned ? "" : "grayscale"}`} aria-hidden>
                  {badge.emoji}
                </div>
                <p
                  className={`text-xs font-medium ${
                    earned ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {badge.name}
                </p>
                {!earned && (
                  <p className="mt-1 text-[10px] text-[var(--text-faint)]">
                    {Math.min(100, Math.max(0, p))}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Karaktärsemblem — ett per person, klar när ALLA berättelser med
          den karaktären (över hela appen, oavsett bok) är avklarade. */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
          Karaktärsemblem ({earnedCharacterBadges.length}/{characterStats.length})
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {[...earnedCharacterBadges, ...lockedCharacterBadges].map((c) => (
            <Link
              key={c.slug}
              href={`/personer/${c.slug}`}
              className={`rounded-xl border p-3 text-center shadow-sm transition ${
                c.completed === c.total
                  ? "border-[var(--success-border)] bg-[var(--success-bg)]"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] opacity-70 hover:opacity-100"
              }`}
              title={`${c.name}: ${c.completed}/${c.total} berättelser avklarade`}
            >
              {c.portraitPath ? (
                <Image
                  src={c.portraitPath}
                  alt=""
                  width={48}
                  height={48}
                  className={`mx-auto mb-1.5 h-12 w-12 rounded-full border object-cover ${
                    c.completed === c.total
                      ? "border-[var(--success)]"
                      : "border-[var(--border)] grayscale"
                  }`}
                />
              ) : (
                <span className="mx-auto mb-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] font-serif text-lg text-[var(--text-faint)]">
                  {c.name.charAt(0)}
                </span>
              )}
              <p
                className={`truncate text-xs font-medium ${
                  c.completed === c.total ? "text-[var(--success)]" : "text-[var(--text-muted)]"
                }`}
              >
                {c.name}
              </p>
              <p className="mt-0.5 text-[10px] tabular-nums text-[var(--text-faint)]">
                {c.completed}/{c.total}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Per bok */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
          Framsteg per bok
        </h2>
        <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-sm">
          {stats.byBook.map((b) => {
            const href = b.corpusSlug ? `/${b.corpusSlug}/${b.slug}` : null;
            const row = (
              <>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className={href ? "text-[var(--text)] group-hover:underline" : "text-[var(--text)]"}>
                    {b.name}
                  </span>
                  <span className="text-xs text-[var(--text-faint)] tabular-nums">
                    {b.completed}/{b.total}
                  </span>
                </div>
                <ProgressBar pct={pct(b.completed, b.total)} tone="neutral" thin />
              </>
            );
            return href ? (
              <Link key={b.slug} href={href} className="group block">
                {row}
              </Link>
            ) : (
              <div key={b.slug}>{row}</div>
            );
          })}
        </div>
      </section>

      {/* Extra viktiga */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
          Extra viktiga ({favorites.length})
        </h2>
        {favorites.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            Inga berättelser markerade som extra viktiga ännu — klicka på ☆ på en berättelses sida
            för att spara den här.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
            {favorites.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/${s.corpusSlug}/${s.bookSlug}/${s.slug}`}
                  className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[var(--accent-bg)]"
                >
                  <span className="flex items-center gap-2 font-medium text-[var(--text)]">
                    <span aria-hidden className="text-[var(--link)]">★</span>
                    {s.title}
                  </span>
                  <span className="shrink-0 text-xs text-[var(--text-faint)]">
                    {s.bookName}
                    {s.completed ? " · ✓ klar" : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const POINTS_HINT = "10p/berättelse, +10p med Peterson-innehåll, +5p per extra viktig.";

function pct(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

function ProgressBar({ pct, tone, thin }: { pct: number; tone: "accent" | "neutral"; thin?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-[var(--border-soft)] ${thin ? "h-1.5" : "h-2.5"}`}
    >
      <div
        className={`h-full rounded-full transition-all ${
          tone === "accent" ? "bg-[var(--accent)]" : "bg-[var(--link)]"
        }`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}
