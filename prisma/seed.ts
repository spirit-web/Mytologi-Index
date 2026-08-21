// Seed-data för Genesis-berättelseindexet + metadata om Jordan Petersons
// videoserier (utan exakta tidsstämplar ännu — det är Phase 2, se README).
//
// Källor för berättelseindelning: standard bibelvetenskaplig kapitel-
// indelning. Källor för Peterson-serierna: se README "Källor".

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Korpusar --------------------------------------------------
  const bible = await prisma.corpus.upsert({
    where: { slug: "bible" },
    update: {},
    create: { slug: "bible", name: "Bibeln", kind: "scripture" },
  });

  // Placeholder-korpus för framework-blocket. Inga stories seedade ännu —
  // se README "Nästa steg" (kräver research av kapitel-/föreläsningslista).
  await prisma.corpus.upsert({
    where: { slug: "maps-of-meaning" },
    update: {},
    create: {
      slug: "maps-of-meaning",
      name: "Maps of Meaning",
      kind: "framework",
      description:
        "Petersons eget teoretiska ramverk (boken + 2017 University of " +
        "Toronto-föreläsningarna) samt 12 Rules for Life som dess populära " +
        "uppföljare. Kapitel/föreläsningar blir Story-poster vars " +
        "Reference-länkar visar vilka myter/tänkare han illustrerar med.",
    },
  });

  const genesis = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "genesis" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "genesis",
      name: "Första Moseboken (Genesis)",
      order: 1,
      testament: "old",
    },
  });

  // --- Peterson-serier -------------------------------------------
  const genesisSeries = await prisma.petersonSeries.upsert({
    where: { slug: "biblical-series-genesis" },
    update: {},
    create: {
      slug: "biblical-series-genesis",
      title: "Biblical Series: Genesis",
      requiresPaidAccess: false,
      isPanelDiscussion: false,
      enabledByDefault: true,
      notes: "Solo-föreläsningar, fritt på YouTube (2017).",
    },
  });

  const christSeries = await prisma.petersonSeries.upsert({
    where: { slug: "death-resurrection-of-christ" },
    update: {},
    create: {
      slug: "death-resurrection-of-christ",
      title: "The Death and Resurrection of Christ: A Commentary in Five Parts",
      requiresPaidAccess: false,
      isPanelDiscussion: false,
      enabledByDefault: true,
      notes: "Fristående föreläsning i fem delar, fritt på YouTube (2018).",
    },
  });

  // Exodus: togglebar modul enligt beslut i chatten — av som standard
  // p.g.a. betalvägg + panelformat, men aktiverbar. Bygger struktur runt
  // vilka stories PANELEN diskuterar (fler röster än bara Peterson är ok).
  const exodusSeries = await prisma.petersonSeries.upsert({
    where: { slug: "exodus" },
    update: {},
    create: {
      slug: "exodus",
      title: "Exodus",
      requiresPaidAccess: true,
      isPanelDiscussion: true,
      panelists: "Douglas Hedley, Os Guinness, James Orr, Dennis Prager, Stephen Blackwood, Jonathan Pageau",
      enabledByDefault: false,
      notes:
        "16 fullständiga avsnitt bakom betalvägg på DailyWire+ (2021–2023). " +
        "Videorna nedan är istället de FRIA officiella klippen (kortare " +
        "höjdpunkter, en per avsnitt) från Petersons YouTube-kanal — hittade " +
        "via archive.org:s mirror av kanalen, en stickprovsverifierad mot " +
        "oEmbed 2026-08-21 (övriga inte individuellt verifierade, se README). " +
        "PetersonSegment.speaker markerar vem i panelen som pratar.",
    },
  });

  // Fria officiella klipp, ett per Exodus-avsnitt (avsnitt 11 saknas — inget
  // klipp hittat än). Källa: archive.org-mirror av "Jordan B Peterson"-
  // YouTube-kanalen (identifierare youtube-<ID>), se README "Källor".
  const exodusClips: Array<{ order: number; title: string; youtubeId: string }> = [
    { order: 1, title: "Tyrant Contra God", youtubeId: "GEASnFvLxhU" },
    { order: 2, title: "Transforming Evil Into Good", youtubeId: "7idDtmKtyZU" },
    { order: 3, title: "Chaos and Order", youtubeId: "6q2D5-H71yY" },
    { order: 4, title: "The 10 Plagues of Egypt", youtubeId: "ybkyraDi7Qs" },
    { order: 5, title: "Pharaoh, Stalin, and Tyranny", youtubeId: "6PSHDHKpQEk" },
    { order: 6, title: "The Difference Between Pagan and Sacred Ritual", youtubeId: "29OXOl57Tl8" },
    { order: 7, title: "Are You in Egypt, the Desert, or the Promised Land?", youtubeId: "IkKMJPgALmI" },
    { order: 8, title: "Why Moses Climbed Mount Sinai", youtubeId: "hDT32GJd2Ms" },
    { order: 9, title: "10 Rules For Life", youtubeId: "ZNplOLbanz8" },
    { order: 10, title: "\"I Have Been Convinced of The Existence of the Devil\"", youtubeId: "CDTFRTBWA28" },
    { order: 12, title: "The Importance of Sacrifice and Ritual", youtubeId: "L4tHBpX0_UQ" },
    { order: 13, title: "When You Worship What You Should Sacrifice", youtubeId: "DCJAYRPSpTA" },
    { order: 14, title: "The Fire of Hell and the Love of God", youtubeId: "4VDRYKd3FZc" },
    { order: 15, title: "Was Egypt the Land of Milk and Honey?", youtubeId: "I3C4ci-N21M" },
    { order: 16, title: "Authority Hails From Above, Not From Within", youtubeId: "CTIP5i-jyBs" },
    { order: 17, title: "Wisdom Begins With The Fear of the Lord", youtubeId: "hp1mobf6u9s" },
  ];

  for (const clip of exodusClips) {
    await prisma.petersonVideo.upsert({
      where: { youtubeId: clip.youtubeId },
      update: { title: `Exodus Episode ${clip.order}: ${clip.title}`, seriesId: exodusSeries.id, seriesOrder: clip.order },
      create: {
        youtubeId: clip.youtubeId,
        title: `Exodus Episode ${clip.order}: ${clip.title}`,
        seriesId: exodusSeries.id,
        seriesOrder: clip.order,
      },
    });
  }

  // YouTube-ID:n verifierade 2026-08-21 mot Petersons officiella kanal
  // (author_name "Jordan B Peterson") via YouTubes oEmbed-endpoint —
  // se README "Källor". Alla 15 bekräftade.
  const genesisEpisodes: Array<{ order: number; title: string; youtubeId: string }> = [
    { order: 1, title: "Introduction to the Idea of God", youtubeId: "f-wWBGo6a2w" },
    { order: 2, title: "Genesis 1: Chaos & Order", youtubeId: "hdrLQ7DpiWs" },
    { order: 3, title: "God and the Hierarchy of Authority", youtubeId: "R_GPAl_q2QQ" },
    { order: 4, title: "Adam and Eve: Self-Consciousness, Evil, and Death", youtubeId: "Ifi5KkXig3s" },
    { order: 5, title: "Cain and Abel: The Hostile Brothers", youtubeId: "44f3mxcsI50" },
    { order: 6, title: "The Psychology of the Flood", youtubeId: "wNjbasba-Qw" },
    { order: 7, title: "Walking with God: Noah and the Flood", youtubeId: "6gFjB9FTN58" },
    { order: 8, title: "The Phenomenology of the Divine", youtubeId: "UoQdp2prfmM" },
    { order: 9, title: "The Call to Abraham", youtubeId: "GmuzUZTJ0GA" },
    { order: 10, title: "Abraham: Father of Nations", youtubeId: "3Y6bCqT85Pc" },
    { order: 11, title: "Sodom and Gomorrah", youtubeId: "SKzpj0Ev8Xs" },
    { order: 12, title: "The Great Sacrifice: Abraham and Isaac", youtubeId: "-yUP40gwht0" },
    { order: 13, title: "Jacob's Ladder", youtubeId: "A9JtQN_GoVI" },
    { order: 14, title: "Jacob: Wrestling with God", youtubeId: "DRJKwDfDbco" },
    { order: 15, title: "Joseph and the Coat of Many Colors", youtubeId: "B7V8eZ1BLiI" },
  ];

  for (const ep of genesisEpisodes) {
    await prisma.petersonVideo.upsert({
      where: { youtubeId: ep.youtubeId },
      update: { title: `Biblical Series ${ep.order}: ${ep.title}`, seriesId: genesisSeries.id, seriesOrder: ep.order },
      create: {
        youtubeId: ep.youtubeId,
        title: `Biblical Series ${ep.order}: ${ep.title}`,
        seriesId: genesisSeries.id,
        seriesOrder: ep.order,
      },
    });
  }

  // Till skillnad från Genesis-serien är detta INTE fem separata videor —
  // Peterson lade ut de fem delarna som EN sammanslagen video med
  // kapitelmarkeringar. youtubeId bekräftad mot officiella kanalen.
  // Exakta kapitel-tidsstämplar (chapterStartSec) är TODO — kräver att
  // videobeskrivningen/kapitellistan hämtas manuellt, se README.
  const christVideo = await prisma.petersonVideo.upsert({
    where: { youtubeId: "xPIanlF6IwM" },
    update: {},
    create: {
      youtubeId: "xPIanlF6IwM",
      title: "Compilation: The Death and Resurrection of Christ: A Commentary in Five Parts",
      seriesId: christSeries.id,
      seriesOrder: 1,
    },
  });
  const christParts = [
    "The Nature of Experience",
    "Some Axioms of the Christian Revolutionary Story",
    "Narratives and Sacrifice",
    "On the Ark of the Covenant, the Cathedral and the Cross",
    "The Psychological Meaning of the Death and Resurrection of Christ",
  ];
  void christVideo;
  void christParts; // dokumenterar delarna tills kapitel-segment finns, se README

  // --- Karaktärer ------------------------------------------------------
  const characterNames = [
    "adam", "eve", "cain", "abel", "noah", "abraham", "sarah", "lot",
    "isaac", "jacob", "esau", "joseph",
  ] as const;
  const displayName: Record<string, string> = {
    adam: "Adam", eve: "Eva", cain: "Kain", abel: "Abel", noah: "Noa",
    abraham: "Abraham", sarah: "Sara", lot: "Lot", isaac: "Isak",
    jacob: "Jakob", esau: "Esau", joseph: "Josef",
  };
  const characters: Record<string, { id: string }> = {};
  for (const slug of characterNames) {
    characters[slug] = await prisma.character.upsert({
      where: { slug },
      update: {},
      create: { slug, name: displayName[slug] },
    });
  }

  // --- Teman -------------------------------------------------------
  const themeDefs = [
    { slug: "chaos-order", name: "Kaos & ordning" },
    { slug: "sacrifice", name: "Uppoffring" },
    { slug: "hierarchy", name: "Hierarki & auktoritet" },
    { slug: "sibling-rivalry", name: "Syskonrivalitet" },
    { slug: "covenant", name: "Förbund/löfte" },
    { slug: "testing-of-faith", name: "Prövning av tro" },
    { slug: "self-consciousness", name: "Självmedvetenhet & skam" },
  ] as const;
  const themes: Record<string, { id: string }> = {};
  for (const t of themeDefs) {
    themes[t.slug] = await prisma.theme.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }

  // --- Stories -----------------------------------------------------
  type StoryDef = {
    slug: string;
    title: string;
    startRef: string;
    endRef: string;
    orderInBook: number;
    seriesSlug?: string;
    seriesTitle?: string;
    seriesOrder?: number;
    characterSlugs: string[];
    themeSlugs: string[];
  };

  const stories: StoryDef[] = [
    {
      slug: "creation",
      title: "Skapelsen",
      startRef: "Genesis 1:1", endRef: "Genesis 2:3",
      orderInBook: 1,
      characterSlugs: [],
      themeSlugs: ["chaos-order"],
    },
    {
      slug: "garden-of-eden",
      title: "Adam och Eva i Edens lustgård",
      startRef: "Genesis 2:4", endRef: "Genesis 3:24",
      orderInBook: 2,
      characterSlugs: ["adam", "eve"],
      themeSlugs: ["self-consciousness"],
    },
    {
      slug: "cain-and-abel",
      title: "Kain och Abel",
      startRef: "Genesis 4:1", endRef: "Genesis 4:16",
      orderInBook: 3,
      characterSlugs: ["cain", "abel", "adam", "eve"],
      themeSlugs: ["sibling-rivalry", "sacrifice"],
    },
    {
      slug: "noahs-flood",
      title: "Noa och syndafloden",
      startRef: "Genesis 6:1", endRef: "Genesis 9:29",
      orderInBook: 4,
      seriesSlug: "noah", seriesTitle: "Noa-cykeln", seriesOrder: 1,
      characterSlugs: ["noah"],
      themeSlugs: ["chaos-order", "covenant"],
    },
    {
      slug: "tower-of-babel",
      title: "Babels torn",
      startRef: "Genesis 11:1", endRef: "Genesis 11:9",
      orderInBook: 5,
      characterSlugs: [],
      themeSlugs: ["hierarchy"],
    },
    {
      slug: "call-of-abram",
      title: "Kallelsen av Abram",
      startRef: "Genesis 12:1", endRef: "Genesis 12:20",
      orderInBook: 6,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 1,
      characterSlugs: ["abraham", "sarah"],
      themeSlugs: ["covenant"],
    },
    {
      slug: "abraham-and-lot",
      title: "Abraham och Lot skiljs åt",
      startRef: "Genesis 13:1", endRef: "Genesis 13:18",
      orderInBook: 7,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 2,
      characterSlugs: ["abraham", "lot"],
      themeSlugs: ["hierarchy"],
    },
    {
      slug: "covenant-with-abram",
      title: "Förbundet med Abram",
      startRef: "Genesis 15:1", endRef: "Genesis 15:21",
      orderInBook: 8,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 3,
      characterSlugs: ["abraham"],
      themeSlugs: ["covenant"],
    },
    {
      slug: "sodom-and-gomorrah",
      title: "Sodom och Gomorra",
      startRef: "Genesis 18:16", endRef: "Genesis 19:29",
      orderInBook: 9,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 4,
      characterSlugs: ["abraham", "lot"],
      themeSlugs: ["chaos-order"],
    },
    {
      slug: "binding-of-isaac",
      title: "Isaks offer (Akedah)",
      startRef: "Genesis 22:1", endRef: "Genesis 22:19",
      orderInBook: 10,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 5,
      characterSlugs: ["abraham", "isaac"],
      themeSlugs: ["sacrifice", "testing-of-faith"],
    },
    {
      slug: "jacobs-ladder",
      title: "Jakobs stege",
      startRef: "Genesis 28:10", endRef: "Genesis 28:22",
      orderInBook: 11,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 1,
      characterSlugs: ["jacob"],
      themeSlugs: ["hierarchy"],
    },
    {
      slug: "jacob-wrestling",
      title: "Jakob brottas med Gud",
      startRef: "Genesis 32:22", endRef: "Genesis 32:32",
      orderInBook: 12,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 2,
      characterSlugs: ["jacob", "esau"],
      themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "joseph-and-his-brothers",
      title: "Josef och hans bröder",
      startRef: "Genesis 37:1", endRef: "Genesis 45:28",
      orderInBook: 13,
      characterSlugs: ["joseph", "jacob"],
      themeSlugs: ["sibling-rivalry", "sacrifice"],
    },
  ];

  for (const s of stories) {
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: genesis.id, slug: s.slug } },
      update: {},
      create: {
        bookId: genesis.id,
        slug: s.slug,
        title: s.title,
        startRef: s.startRef,
        endRef: s.endRef,
        orderInBook: s.orderInBook,
        seriesSlug: s.seriesSlug,
        seriesTitle: s.seriesTitle,
        seriesOrder: s.seriesOrder,
      },
    });

    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: characters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: characters[charSlug].id },
      });
    }

    for (const themeSlug of s.themeSlugs) {
      await prisma.storyTheme.upsert({
        where: { storyId_themeId: { storyId: story.id, themeId: themes[themeSlug].id } },
        update: {},
        create: { storyId: story.id, themeId: themes[themeSlug].id },
      });
    }
  }

  // --- Exempel-Parallel (visar konceptet med en enda post) -----------
  // Fler tvärtext-jämförelser (särskilt Bibeln↔Koranen) läggs till när
  // Koranen är indexerad, se README.
  const sacrificeTheme = themes["sacrifice"];
  const isaacStory = await prisma.story.findFirstOrThrow({ where: { slug: "binding-of-isaac" } });
  const cainAbelStory = await prisma.story.findFirstOrThrow({ where: { slug: "cain-and-abel" } });

  const sacrificeParallel = await prisma.parallel.upsert({
    where: { id: "seed-parallel-sacrifice" },
    update: {},
    create: {
      id: "seed-parallel-sacrifice",
      title: "Uppoffring som återkommande arketyp",
      description:
        "Peterson menar att gamla testamentet återkommande kretsar kring " +
        "uppoffringens psykologi: att medvetet ge upp något värdefullt nu " +
        "för något bättre senare. Kain & Abels offer och Abrahams offer av " +
        "Isak är två varianter av samma grundmönster — en 'rätt' vs. en " +
        "'fel'/ofullständig uppoffring.",
      themeId: sacrificeTheme.id,
    },
  });

  for (const [storyId, note] of [
    [cainAbelStory.id, "Kains bristfälliga offer vs. Abels fullständiga — vad som gör en uppoffring 'giltig'."],
    [isaacStory.id, "Abrahams villighet att offra det käraste han har, som yttersta prövning av tro."],
  ] as const) {
    await prisma.parallelStory.upsert({
      where: { parallelId_storyId: { parallelId: sacrificeParallel.id, storyId } },
      update: {},
      create: { parallelId: sacrificeParallel.id, storyId, note },
    });
  }

  console.log(
    `Seedat: ${stories.length} stories i Genesis, ` +
      `${genesisEpisodes.length + 1 + exodusClips.length} Peterson-videor, ` +
      `1 exempel-Parallel.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
