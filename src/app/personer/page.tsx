import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PersonerPage() {
  const characters = await prisma.character.findMany({
    include: {
      _count: { select: { appearances: true, references: true } },
    },
    orderBy: { name: "asc" },
  });

  const bibliska = characters.filter((c) => c._count.appearances > 0);
  const refererade = characters.filter((c) => c._count.appearances === 0 && c._count.references > 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-[var(--text-faint)] transition hover:text-[var(--text)]">
        ← Berättelseindex
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        Personer
      </h1>
      <p className="mb-10 max-w-xl text-sm text-[var(--text-muted)]">
        Alla karaktärer som förekommer i berättelserna, och alla personer
        utanför texterna själva som Jordan Peterson refererar till för att
        illustrera sina poänger.
      </p>

      {bibliska.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Karaktärer i berättelserna ({bibliska.length})
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {bibliska.map((c) => (
              <PersonCard key={c.id} character={c} />
            ))}
          </div>
        </section>
      )}

      {refererade.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Personer Peterson refererar till ({refererade.length})
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {refererade.map((c) => (
              <PersonCard key={c.id} character={c} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function PersonCard({
  character,
}: {
  character: {
    slug: string;
    name: string;
    portraitPath: string | null;
    _count: { appearances: number; references: number };
  };
}) {
  const total = character._count.appearances + character._count.references;
  return (
    <Link
      href={`/personer/${character.slug}`}
      className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 transition hover:bg-[var(--accent-bg)]"
    >
      {character.portraitPath ? (
        <Image
          src={character.portraitPath}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-bg)] text-xs font-medium text-[var(--accent)]">
          {character.name[0]}
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-[var(--text)]">{character.name}</span>
        <span className="block text-xs text-[var(--text-faint)]">
          {character._count.appearances > 0 && `${character._count.appearances} berättelser`}
          {character._count.appearances > 0 && character._count.references > 0 && " · "}
          {character._count.references > 0 && `${character._count.references} referenser`}
          {total === 0 && "—"}
        </span>
      </span>
    </Link>
  );
}
