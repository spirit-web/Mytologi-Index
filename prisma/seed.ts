// Seed-data för Genesis-berättelseindexet + metadata om Jordan Petersons
// videoserier (utan exakta tidsstämplar ännu — det är Phase 2, se README).
//
// Källor för berättelseindelning: standard bibelvetenskaplig kapitel-
// indelning. Källor för Peterson-serierna: se README "Källor".

import { PrismaClient } from "@prisma/client";
import captionsByCode from "./image-captions.json";

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

  // --- Story-bilder ----------------------------------------------------
  // Källa: FreeBibleimages.org (se README "Bildkällor" för fullständig
  // researchlogg + licensanmärkningar). Filerna är nedladdade till
  // public/images/genesis/<story-slug>/ — INTE hotlänkade mot deras CDN
  // (se README för resonemang). CC BY-NC (personligt bruk tillåtet,
  // kommersiellt bruk EJ tillåtet) — kolla licensen per set på nytt om
  // appen någonsin blir delad/publik. Bildtexter (caption) är källans
  // egna sceninformation, sparade i image-captions.json (hämtade via
  // <img alt>-attribut på källsidorna).
  const captions = captionsByCode as Record<string, string[]>;
  const isJunkCaption = (c: string | undefined) => !c || /^Slide \d+$/.test(c.trim());

  const lambsongsCredit = { credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC" };

  // fileStart..fileEnd = vilka nedladdade filnummer (från källsetet) som
  // används; orderStart = första visningsordning i story:ns bildgalleri.
  // Detta gör det möjligt att t.ex. dela ETT käll-set (FB_RG_Lot) mellan
  // två stories genom att peka olika filnummerintervall mot varsin story.
  const storyImageSets: Array<{
    storySlug: string;
    code: string;
    fileStart: number;
    fileEnd: number;
    orderStart: number;
    credit: string;
    creditUrl: string;
  }> = [
    { storySlug: "creation", code: "FB_LS_Creation_Days", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-creation-days/" },
    { storySlug: "garden-of-eden", code: "FB_FN_Adam_Eve", fileStart: 1, fileEnd: 11, orderStart: 1, credit: "Fishnet Bible Stories (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/fn-adam-eve/" },
    { storySlug: "cain-and-abel", code: "FB_LS_Cain_Abel", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-cain-abel/" },
    { storySlug: "cain-and-abel", code: "FB_LS_Cain_Anger", fileStart: 1, fileEnd: 9, orderStart: 10, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-cain-anger/" },
    { storySlug: "noahs-flood", code: "FB_LS_Noah_Ark", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-noah-ark/" },
    { storySlug: "tower-of-babel", code: "FB_LS_Tower_Babel", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-tower-babel/" },
    { storySlug: "call-of-abram", code: "FB_RP_Abraham_Calling", fileStart: 1, fileEnd: 21, orderStart: 1, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rp-abraham-calling/" },
    // FB_RG_Lot delas mellan två stories (Gen 13 vs. Gen 19) via filnummerintervall.
    { storySlug: "abraham-and-lot", code: "FB_RG_Lot", fileStart: 1, fileEnd: 3, orderStart: 1, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-lot/" },
    { storySlug: "sodom-and-gomorrah", code: "FB_RG_Lot", fileStart: 4, fileEnd: 9, orderStart: 1, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-lot/" },
    { storySlug: "covenant-with-abram", code: "FB_LS_Abram", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-abram/" },
    { storySlug: "binding-of-isaac", code: "FB_LS_Abraham_Isaac", fileStart: 1, fileEnd: 10, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-abraham-isaac/" },
    { storySlug: "jacobs-ladder", code: "FB_LS_Jacob_Ladder", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jacob-ladder/" },
    { storySlug: "jacob-wrestling", code: "FB_LS_Jacob_Israel", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jacob-israel/" },
    { storySlug: "joseph-and-his-brothers", code: "FB_LS_Joseph_Dreams", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-joseph-dreams/" },
    { storySlug: "joseph-and-his-brothers", code: "FB_LS_Joseph_Coat", fileStart: 1, fileEnd: 10, orderStart: 10, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-joseph-coat/" },
    { storySlug: "joseph-and-his-brothers", code: "FB_LS_Joseph_Brothers", fileStart: 1, fileEnd: 9, orderStart: 20, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-joseph-brothers/" },
  ];

  for (const set of storyImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: genesis.id, slug: set.storySlug } });
    for (let fileNum = set.fileStart; fileNum <= set.fileEnd; fileNum++) {
      const order = set.orderStart + (fileNum - set.fileStart);
      // Filen ligger fysiskt kvar under sitt UR-SPRUNGLIGA filnummer i
      // story-mappen (så vi slapp ladda ner FB_RG_Lot två gånger) — path
      // pekar därför på fileNum, medan `order` är visningsordningen.
      const path = `/images/genesis/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const rawCaption = captions[set.code]?.[fileNum - 1];
      const caption = isJunkCaption(rawCaption) ? null : rawCaption;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  // --- Karaktärsporträtt -------------------------------------------
  // Arkivet erbjuder scenbilder, inga fristående porträtt — återanvänder
  // därför en lämplig bild ur en story där karaktären är central och
  // faktiskt syns (valda genom att läsa scenbeskrivningarna ovan, inte
  // bara "bild nr. 1" rakt av). `esau` har ingen bra bild i nuvarande
  // set (bara omnämnd, syns inte i bildmaterialet) — lämnas utan porträtt
  // hellre än ett missvisande.
  const portraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "adam", storySlug: "garden-of-eden", imgOrder: 1 },
    { slug: "eve", storySlug: "garden-of-eden", imgOrder: 1 },
    { slug: "cain", storySlug: "cain-and-abel", imgOrder: 3 },
    { slug: "abel", storySlug: "cain-and-abel", imgOrder: 5 },
    { slug: "noah", storySlug: "noahs-flood", imgOrder: 2 },
    { slug: "abraham", storySlug: "covenant-with-abram", imgOrder: 1 },
    { slug: "sarah", storySlug: "binding-of-isaac", imgOrder: 2 },
    { slug: "lot", storySlug: "abraham-and-lot", imgOrder: 1 },
    { slug: "isaac", storySlug: "binding-of-isaac", imgOrder: 5 },
    { slug: "jacob", storySlug: "jacobs-ladder", imgOrder: 3 },
    { slug: "joseph", storySlug: "joseph-and-his-brothers", imgOrder: 2 },
  ];

  for (const p of portraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: genesis.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({
      where: { storyId_order: { storyId: story.id, order: p.imgOrder } },
    });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  // --- PetersonSegment: verkliga tidsstämplar från Genesis-serien ----
  // Hittade genom att ladda ner auto-genererade undertexter (yt-dlp) för
  // alla 15 videor och söka efter var Peterson faktiskt börjar läsa/
  // diskutera respektive bibeltext (inte bara nämner den i förbifarten).
  // startSec = där han börjar den substantiella genomgången av just den
  // berättelsen. endSec lämnas obestämt (ej annoterat) — dessa lektioner
  // fortsätter ofta in i sidospår eller Q&A som inte är kartlagt än.
  // keyPoints är egna, korta sammanfattningar. quote är ETT kort, utvalt
  // ordagrant citat (inte ett fullständigt transkript, se README,
  // upphovsrättsgräns) — källa: auto-genererade YouTube-undertexter, kan
  // innehålla enstaka transkriberingsfel (ASR), bör proofreadas innan de
  // sprids vidare. Inte alla segment har hunnit få ett bra citat än.
  type VerseNote = {
    chapter: number;
    verse: number;
    verseEnd?: number;
    order: number;
    quote: string;
    summary: string;
  };

  const segments: Array<{
    storySlug: string;
    youtubeId: string;
    startSec: number;
    keyPoints: string;
    quote?: string;
    verseNotes?: VerseNote[];
  }> = [
    {
      storySlug: "creation",
      youtubeId: "hdrLQ7DpiWs",
      startSec: 18 * 60 + 55,
      keyPoints:
        "Läser Genesis 1:1–2 rakt av och börjar sedan bryta ner nyckelorden " +
        "(kaos/ordning, formlöshet, Guds ande över vattnet) — påpekar att " +
        "avsnittet är tätt packat och kräver bakgrund från andra urtexter " +
        "för att förstås fullt ut.",
      quote:
        "This is a hard narrative section to get a handle on, because in " +
        "order to understand it properly you have to actually look behind it.",
      verseNotes: [
        {
          chapter: 1,
          verse: 14,
          order: 1,
          quote:
            "That's a remarkable bit of writing there, too, because you " +
            "just think about how bloody long it took our caveman " +
            "ancestors to look at the night sky and start to figure out " +
            "that there were repeating patterns across years.",
          summary:
            "Kopplar 'ljusen på himlavalvet till tecken och tider' till " +
            "den enorma mänskliga prestationen att observera natthimlen " +
            "tillräckligt noga för att kartlägga årstider — nämner " +
            "megalitiska monument som Stonehenge som bevis på hur gammal " +
            "den kunskapen är.",
        },
      ],
    },
    {
      storySlug: "garden-of-eden",
      youtubeId: "Ifi5KkXig3s",
      startSec: 59 * 60 + 4,
      keyPoints:
        "Läser Genesis 2:7 (Gud formar människan av jord och blåser liv i " +
        "henne) och kopplar andetag/liv till begrepp som psyke, ande och " +
        "inspiration.",
      quote: "The breath is life, right? That's psyche, that's spirit, that's inspiration.",
      verseNotes: [
        {
          chapter: 2,
          verse: 25,
          order: 1,
          quote:
            "Someone who wrote that would only write it like that if they " +
            "were surprised that they weren't ashamed — because why would " +
            "you point it out otherwise?",
          summary:
            "Läser meningen 'de var nakna och skämdes inte' som en subtil " +
            "ledtråd: att författaren påpekar frånvaron av skam antyder " +
            "att skam är det förväntade tillståndet — vilket sätter upp " +
            "kontrasten till vad som händer efter syndafallet.",
        },
        {
          chapter: 3,
          verse: 7,
          order: 2,
          quote:
            "What sort of eye-opening is that? What does it mean to " +
            "realize that you're naked? It means to realize that you're " +
            "vulnerable.",
          summary:
            "Tolkar 'ögonen öppnades' som uppkomsten av självmedvetenhet " +
            "om den egna sårbarheten — jämför med hur ett djur i en hjord " +
            "inte förstår skillnaden mellan ett liggande och ett jagande " +
            "lejon, medan människan 'vaknar upp' till att vara permanent " +
            "sårbar.",
        },
      ],
    },
    {
      storySlug: "cain-and-abel",
      youtubeId: "44f3mxcsI50",
      startSec: 60 * 60 + 1 * 60 + 27,
      keyPoints:
        "Poängterar att Kain och Abel är de första människorna som föds av " +
        "människor (till skillnad från Adam och Eva, skapade direkt av " +
        "Gud) — helt postlapsariska, redan utkastade ur paradiset, redan " +
        "självmedvetna.",
      quote:
        "Cain and Abel are the first two human beings, because Adam and Eve " +
        "were made by God and they were born in Paradise.",
      verseNotes: [
        {
          chapter: 4,
          verse: 4,
          order: 1,
          quote:
            "There's a hint that Abel's putting a little bit more into the " +
            "whole sacrificial thing than Cain — but there's also a hint " +
            "that maybe God is just liking him a little better.",
          summary:
            "Betonar textens inbyggda tvetydighet: vi vet inte säkert om " +
            "Abels offer var kvalitativt bättre eller om Gud helt enkelt " +
            "gynnade honom mer — och kopplar det till livets godtycklighet, " +
            "som hur hans egna barn fått väldigt olika 'öden' trots " +
            "liknande karaktär.",
        },
        {
          chapter: 4,
          verse: 5,
          order: 2,
          quote:
            "Cain is not a happy clam that his hard work is being rejected " +
            "by God — now that's worth thinking about, because you think " +
            "about how human that story is.",
          summary:
            "Läser Kains vrede som djupt mänsklig och igenkännbar: känslan " +
            "av att bli orättvist förbisedd trots ansträngning — och hur " +
            "det bittra, cyniska svaret på det (istället för " +
            "självrannsakan) är precis vad som leder honom vidare mot " +
            "katastrof.",
        },
        {
          chapter: 4,
          verse: 9,
          order: 3,
          quote:
            "If you want to understand that, I would recommend you read " +
            "Dostoevsky's Crime and Punishment — it says what happens " +
            "psychologically if you commit the ultimate crime. It's " +
            "amazing, it's absolutely amazing.",
          summary:
            "Kopplar Kains undvikande svar ('är jag min brors väktare?') " +
            "direkt till Dostojevskijs Brott och straff, som han kallar " +
            "'kanske det bästa som någonsin skrivits' — båda skildrar den " +
            "psykologiska konsekvensen av att begå det yttersta brottet.",
        },
      ],
    },
    {
      storySlug: "noahs-flood",
      youtubeId: "wNjbasba-Qw",
      startSec: 0,
      keyPoints:
        "Hela föreläsningen (del 1 av 2 om Noa) är komparativ mytologi " +
        "snarare än radgenomgång — jämför syndaflodsberättelser tvärs " +
        "kulturer (bl.a. med hänvisning till Mircea Eliade) innan del 2 " +
        "(nästa video) går in i själva bibeltexten.",
    },
    {
      storySlug: "noahs-flood",
      youtubeId: "6gFjB9FTN58",
      startSec: 33 * 60 + 15,
      keyPoints:
        "Går igenom Genesis 6 (Guds vrede över människans ondska, Noas " +
        "rättfärdighet) och lyfter fram frasen 'Noa vandrade med Gud' som " +
        "en 'Adam utan syndafallet'-parallel.",
      quote: "Noah is Adam without the fall, essentially.",
      verseNotes: [
        {
          chapter: 6,
          verse: 9,
          order: 1,
          quote: "Noah is Adam without the fall, essentially.",
          summary:
            "Läser 'Noa vandrade med Gud' som en direkt spegling av Adam " +
            "innan syndafallet — Noa är vad en människa kan vara om hon " +
            "förblir rättfärdig, och det är precis det som gör att Gud " +
            "skonar honom undan floden.",
        },
      ],
    },
    {
      storySlug: "tower-of-babel",
      youtubeId: "UoQdp2prfmM",
      startSec: 16 * 60 + 17,
      keyPoints:
        "Läser Babels torn-berättelsen och tolkar tornbygget som ett " +
        "hybris-projekt: ett försök att nå det gudomliga genom ren " +
        "teknisk/social makt istället för genom rätt relation till det " +
        "transcendenta.",
      verseNotes: [
        {
          chapter: 11,
          verse: 7,
          verseEnd: 9,
          order: 1,
          quote:
            "It's a very difficult story to understand — on the face of " +
            "it, it doesn't seem to show God in a very good light, " +
            "although that happens fairly frequently in the Old Testament.",
          summary:
            "Erkänner öppet att berättelsen är svårtolkad moraliskt " +
            "(varför skulle Gud aktivt sabotera mänsklig enighet och " +
            "kommunikation?) och uppmanar att läsa den 'i textens anda' " +
            "snarare än bokstavligt som ett godtyckligt straff.",
        },
      ],
    },
    {
      storySlug: "call-of-abram",
      youtubeId: "GmuzUZTJ0GA",
      startSec: 33 * 60 + 14,
      keyPoints:
        "Läser Guds kallelse ('drag ut ur ditt land...') fras för fras — " +
        "att lämna det trygga och kända är kallelsens kärna, jämför med " +
        "1920-talets amerikanska exilförfattare i Paris.",
      quote: "Go somewhere you don't understand — that's the first thing.",
      verseNotes: [
        {
          chapter: 12,
          verse: 1,
          order: 1,
          quote: "Go somewhere you don't understand — that's the first thing. Get thee out of thy country.",
          summary:
            "Läser varje frasled i kallelsen som betydelsebärande: att " +
            "lämna det man förstår och det trygga/kända är kallelsens " +
            "absoluta kärna, snarare än en bokstavlig geografisk " +
            "instruktion.",
        },
      ],
    },
    {
      // Upptäckt vid uppföljande transkriptgenomgång: samma video (ep9)
      // fortsätter förbi kallelsen och in i Genesis 13 (Lot-separationen)
      // — tidigare saknade denna story helt Peterson-koppling.
      storySlug: "abraham-and-lot",
      youtubeId: "GmuzUZTJ0GA",
      startSec: 89 * 60 + 33,
      keyPoints:
        "Läser striden mellan Abrams och Lots herdar (Genesis 13) som en " +
        "'komisk mellanakt': båda har blivit rika, och just därför kan de " +
        "inte längre samsas — en ironisk vändning snarare än ren tragedi, " +
        "innan Abram löser det genom att låta Lot välja mark först.",
      quote:
        "He's wealthy, and so is his nephew — and now they can't get " +
        "along because they have too much stuff. That's quite comical, " +
        "actually — I think it's a comic interlude here.",
      verseNotes: [
        {
          chapter: 13,
          verse: 7,
          verseEnd: 8,
          order: 1,
          quote:
            "Now they can't get along because they have too much stuff — " +
            "that's quite comical, actually. I think it's a comic " +
            "interlude here.",
          summary:
            "Läser konflikten om betesmark som en ironisk, nästan komisk " +
            "vändning: rikedom som borde vara en lösning blir istället " +
            "källan till en ny konflikt mellan släktingar.",
        },
      ],
    },
    {
      storySlug: "covenant-with-abram",
      youtubeId: "3Y6bCqT85Pc",
      startSec: 57 * 60 + 52,
      keyPoints:
        "Läser förbundsceremonin i Genesis 15 (den rykande ugnen och den " +
        "brinnande lågan som passerar mellan de itudelade offerdjuren) som " +
        "ett förbund beseglat med liv-och-död-symbolik.",
      verseNotes: [
        {
          chapter: 15,
          verse: 12,
          order: 1,
          quote:
            "There's a death that's associated with that, because you " +
            "have to let that part of you that's wrong die — and that's " +
            "the sacrifice.",
          summary:
            "Kopplar Abrahams djupa sömn och 'stora mörkrets fasa' till " +
            "egen erfarenhet av att lära sig något verkligt djupt: att " +
            "riktig insikt kräver att en del av en själv 'dör' — samma " +
            "princip som förbundsritualens offerdjur symboliserar.",
        },
      ],
    },
    {
      storySlug: "sodom-and-gomorrah",
      youtubeId: "SKzpj0Ev8Xs",
      startSec: 60 * 60 + 14 * 60 + 4,
      keyPoints:
        "Börjar följa Abraham och budbärarna mot Sodom, men gör ett längre " +
        "sidospår om 'potential' innan han fortsätter mot stadens öde.",
      verseNotes: [
        {
          chapter: 18,
          verse: 23,
          verseEnd: 32,
          order: 1,
          quote:
            "God who's dispensing a fair bit of harsh justice in the Old " +
            "Testament is also someone who can be negotiated with — " +
            "weirdly enough, and that's what happens here.",
          summary:
            "Pekar på att bilden av Gamla testamentets Gud som bara " +
            "sträng och dömande är en 'för lågupplöst tolkning' — här " +
            "förhandlar Abraham faktiskt ner antalet rättfärdiga som " +
            "krävs för att skona staden, steg för steg från femtio.",
        },
      ],
    },
    {
      storySlug: "binding-of-isaac",
      youtubeId: "-yUP40gwht0",
      startSec: 24 * 60 + 17,
      keyPoints:
        "Läser hela offerscenen i Genesis 22 — Guds uppmaning att offra " +
        "Isak, vandringen till Moria — och noterar att det är en av " +
        "bibeltextens första förekomster av ordet 'tillbedjan'.",
      quote: "It's really one of the first times that we've come across the word 'worship'.",
      verseNotes: [
        {
          chapter: 22,
          verse: 5,
          order: 1,
          quote: "It's really one of the first times that we've come across the word 'worship', if I remember correctly.",
          summary:
            "Pekar ut att detta är en av bibeltextens första förekomster " +
            "av ordet 'tillbedjan' — kopplar akten att gå för att offra " +
            "sonen till den djupaste formen av underkastelse inför något " +
            "högre än en själv.",
        },
      ],
    },
    {
      storySlug: "jacobs-ladder",
      youtubeId: "A9JtQN_GoVI",
      startSec: 60 * 60 + 14 * 60 + 44,
      keyPoints:
        "Läser drömmen om stegen mellan himmel och jord med änglar som " +
        "vandrar upp och ner, och Guds löfte till Jakob — beskriver hur " +
        "bilden 'besatt Västerlandets fantasi' i konst och litteratur.",
      quote: "This story of Jacob's Ladder has really possessed the imagination of the West.",
      verseNotes: [
        {
          chapter: 28,
          verse: 12,
          order: 1,
          quote:
            "This story of Jacob's Ladder has really possessed the " +
            "imagination of the West, and there's a reason for that — " +
            "it's because it's an archetypal story.",
          summary:
            "Menar att stegen mellan himmel och jord är en av " +
            "mänsklighetens äldsta idéer, återfinns brett bland schamanska " +
            "kulturer och kan ses som ett kännetecken för psykedelisk " +
            "erfarenhet — en arketypisk bild av 'öppning till en alternativ " +
            "dimension' snarare än en bokstavlig fysisk plats.",
        },
        {
          chapter: 28,
          verse: 13,
          order: 2,
          quote:
            "God is beyond space and time — he's not in the universe, " +
            "he's outside the universe in some manner.",
          summary:
            "Tolkar Guds löfte till Jakob i ljuset av att bilden av Gud " +
            "'däruppe' är mänsklighetens bästa försök att begreppsliggöra " +
            "en extra-dimensionell upplevelse, inte en bokstavlig " +
            "platsangivelse i skyn.",
        },
      ],
    },
    {
      storySlug: "jacob-wrestling",
      youtubeId: "DRJKwDfDbco",
      startSec: 60 * 60 + 12 * 60 + 4,
      keyPoints:
        "Läser brottningsscenen vid Jabbok: Jakob brottas hela natten med " +
        "'en man/ängel/Gud', får höften ur led men vägrar släppa taget " +
        "förrän han blir välsignad och får ett nytt namn.",
      verseNotes: [
        {
          chapter: 32,
          verse: 28,
          order: 1,
          quote:
            "Israel means 'he who wrestles with God' or 'who struggles " +
            "with God' — and it's also so interesting that he actually " +
            "emerges victorious.",
          summary:
            "Tolkar namnbytet symboliskt: att brottas med det gudomliga " +
            "(eller själva begreppet det gudomliga) är vad människor i " +
            "grunden gör — och att Jakob faktiskt vinner tillräckligt för " +
            "att få en välsignelse säger något om mod, eller om att ha " +
            "sonat sina tidigare synder tillräckligt.",
        },
      ],
    },
    {
      storySlug: "joseph-and-his-brothers",
      youtubeId: "B7V8eZ1BLiI",
      startSec: 21 * 60 + 15,
      keyPoints:
        "Explicit startpunkt i föreläsningen ('nu börjar berättelsen om " +
        "Josef') — läser hur Jakob favoriserar Josef med den mångfärgade " +
        "kappan och kopplar det till det återkommande mönstret i Genesis " +
        "att föräldrars favorisering av ett barn leder till familjekatastrof.",
      quote:
        "Whenever there's marked preference on the part of parents for one " +
        "child over the other... that didn't work out so well.",
      verseNotes: [
        {
          chapter: 37,
          verse: 3,
          order: 1,
          quote:
            "You should be able to go have a drink in the pub with the " +
            "guys who are drywalling your house, and you should be able " +
            "to have a sophisticated conversation with someone who's more " +
            "educated — you should be equally comfortable in both " +
            "situations.",
          summary:
            "Tolkar den mångfärgade kappan som en symbol för mångsidighet " +
            "snarare än bara favorisering — bilden av en person som rör " +
            "sig obehindrat mellan olika sociala världar.",
        },
        {
          chapter: 37,
          verse: 4,
          order: 2,
          quote:
            "It isn't obvious that you do them any favors by overtly " +
            "making them your favorite... you definitely set up a Cain " +
            "and Abel-like scenario in the household.",
          summary:
            "Kopplar explicit ihop Josef-berättelsen med Kain och Abel: " +
            "att öppet favorisera ett barn skapar samma sorts " +
            "syskonrivalitet-scenario, oavsett tidsera eller kultur.",
        },
        {
          chapter: 37,
          verse: 20,
          order: 3,
          quote:
            "There's an echo of the Cain and Abel story there, obviously " +
            "— it's so interesting how often that motif of pulling down " +
            "an ideal manifests itself in these old stories. It's the " +
            "pattern established in the Cain and Abel story, it just " +
            "repeats and repeats.",
          summary:
            "Ser tydligt eko av Kain och Abel i böbrödernas komplott mot " +
            "Josef: mönstret att vilja krossa den som uppfattas som " +
            "gynnad eller 'utvald' återkommer gång på gång i dessa " +
            "urgamla berättelser.",
        },
        {
          chapter: 37,
          verse: 21,
          verseEnd: 22,
          order: 4,
          quote: "It's like Ruben's the good guy in this story.",
          summary:
            "Lyfter fram Ruben som den i brödraskaran som faktiskt " +
            "försöker rädda Josef genom att övertala de andra att kasta " +
            "honom i en tom brunn istället för att döda honom direkt.",
        },
      ],
    },
  ];

  for (const seg of segments) {
    const story = await prisma.story.findFirstOrThrow({
      where: { bookId: genesis.id, slug: seg.storySlug },
    });
    const video = await prisma.petersonVideo.findUniqueOrThrow({
      where: { youtubeId: seg.youtubeId },
    });
    const petersonSegment = await prisma.petersonSegment.upsert({
      where: { videoId_storyId: { videoId: video.id, storyId: story.id } },
      update: { startSec: seg.startSec, keyPoints: seg.keyPoints, quote: seg.quote },
      create: {
        videoId: video.id,
        storyId: story.id,
        startSec: seg.startSec,
        keyPoints: seg.keyPoints,
        quote: seg.quote,
      },
    });

    for (const note of seg.verseNotes ?? []) {
      await prisma.verseCommentary.upsert({
        where: {
          segmentId_chapter_verse: {
            segmentId: petersonSegment.id,
            chapter: note.chapter,
            verse: note.verse,
          },
        },
        update: {
          verseEnd: note.verseEnd,
          order: note.order,
          quote: note.quote,
          summary: note.summary,
        },
        create: {
          segmentId: petersonSegment.id,
          chapter: note.chapter,
          verse: note.verse,
          verseEnd: note.verseEnd,
          order: note.order,
          quote: note.quote,
          summary: note.summary,
        },
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
      `${segments.length} tidsstämplade segment, 1 exempel-Parallel.`
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
