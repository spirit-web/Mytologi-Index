// Seed-data för Genesis-berättelseindexet + metadata om Jordan Petersons
// videoserier (utan exakta tidsstämplar ännu — det är Phase 2, se README).
//
// Källor för berättelseindelning: standard bibelvetenskaplig kapitel-
// indelning. Källor för Peterson-serierna: se README "Källor".

import { PrismaClient } from "@prisma/client";
import captionsByCode from "./image-captions.json";
import matthewCaptionsByCode from "./image-captions-matthew.json";
import exodusCaptionsByCode from "./image-captions-exodus.json";

const prisma = new PrismaClient();

async function main() {
  // --- Korpusar --------------------------------------------------
  const bible = await prisma.corpus.upsert({
    where: { slug: "bible" },
    update: {},
    create: { slug: "bible", name: "Bibeln", kind: "scripture" },
  });

  // Framework-korpusen — fylld i Fas 7, se längre ner i filen.
  const mapsOfMeaningCorpus = await prisma.corpus.upsert({
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

  // ======================================================================
  // FAS 5: Nya testamentet — Matteusevangeliet (passionsberättelsen)
  // ======================================================================
  // Peterson har ingen vers-för-vers-genomgång av evangelierna (till
  // skillnad från Genesis-serien) — "The Death and Resurrection of
  // Christ"-videon är EN sammanslagen, tematisk essä (byggd av äldre
  // blogginlägg) snarare än en bibelläsning. Verifierat genom att ladda
  // ner och grep:a transkriptet efter narrativa ankare (Gethsemane,
  // Judas, Pilatus, Golgota, tomma graven m.m.) — inga träffar alls
  // förutom EN riktig bibelverscitering: Matteus 27:46 ("Eli Eli lama
  // sabaktani"), som han läser rakt upp i slutet av kapitlet "Narratives
  // and Sacrifice". Resten av videons fem kapitel är tematiska
  // reflektioner, inte scenvis textgenomgång — kopplas därför in på
  // segment-nivå (helt kapitel → hel story) snarare än vers-för-vers.
  const matthew = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "matthew" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "matthew",
      name: "Matteusevangeliet",
      order: 2,
      testament: "new",
    },
  });

  const ntCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "jesus", name: "Jesus" },
    { slug: "maria", name: "Maria" },
    { slug: "josef-ny", name: "Josef (Jesu fosterfar)" },
    { slug: "johannes-doparen", name: "Johannes Döparen" },
    { slug: "judas", name: "Judas Iskariot" },
    { slug: "petrus", name: "Petrus" },
    { slug: "pontius-pilatus", name: "Pontius Pilatus" },
    { slug: "maria-magdalena", name: "Maria Magdalena" },
  ];
  const ntCharacters: Record<string, { id: string }> = {};
  for (const c of ntCharacterDefs) {
    ntCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const ntThemeDefs = [
    { slug: "betrayal", name: "Förräderi" },
    { slug: "compassion", name: "Medkänsla" },
    { slug: "kingdom-of-god", name: "Guds rike" },
  ] as const;
  const ntThemes: Record<string, { id: string }> = {};
  for (const t of ntThemeDefs) {
    ntThemes[t.slug] = await prisma.theme.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }

  type NtStoryDef = {
    slug: string;
    title: string;
    startRef: string;
    endRef: string;
    orderInBook: number;
    characterSlugs: string[];
    themeSlugs: string[];
    seriesSlug?: string;
    seriesTitle?: string;
    seriesOrder?: number;
  };

  const ntStories: NtStoryDef[] = [
    {
      slug: "nativity", title: "Jesu födelse",
      startRef: "Matthew 1:18", endRef: "Matthew 2:12", orderInBook: 1,
      characterSlugs: ["jesus", "maria", "josef-ny"], themeSlugs: [],
    },
    {
      slug: "baptism-of-jesus", title: "Johannes döper Jesus",
      startRef: "Matthew 3:1", endRef: "Matthew 3:17", orderInBook: 2,
      characterSlugs: ["jesus", "johannes-doparen"], themeSlugs: [],
    },
    {
      slug: "temptation-in-wilderness", title: "Jesus frestas i öknen",
      startRef: "Matthew 4:1", endRef: "Matthew 4:11", orderInBook: 3,
      characterSlugs: ["jesus"], themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "sermon-on-the-mount", title: "Bergspredikan (saligprisningarna)",
      startRef: "Matthew 5:1", endRef: "Matthew 5:12", orderInBook: 4,
      characterSlugs: ["jesus"], themeSlugs: ["kingdom-of-god"],
    },
    {
      slug: "parable-of-the-sower", title: "Liknelsen om såningsmannen",
      startRef: "Matthew 13:1", endRef: "Matthew 13:23", orderInBook: 5,
      characterSlugs: ["jesus"], themeSlugs: [],
    },
    {
      slug: "calming-the-storm", title: "Jesus stillar stormen",
      startRef: "Matthew 8:18", endRef: "Matthew 8:27", orderInBook: 6,
      characterSlugs: ["jesus"], themeSlugs: ["chaos-order"],
    },
    {
      slug: "triumphal-entry", title: "Intåget i Jerusalem",
      startRef: "Matthew 21:1", endRef: "Matthew 21:11", orderInBook: 7,
      characterSlugs: ["jesus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 1,
    },
    {
      slug: "last-supper", title: "Den sista måltiden",
      startRef: "Matthew 26:17", endRef: "Matthew 26:30", orderInBook: 8,
      characterSlugs: ["jesus", "judas", "petrus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 2,
    },
    {
      slug: "gethsemane", title: "Getsemane och tillfångatagandet",
      startRef: "Matthew 26:36", endRef: "Matthew 26:56", orderInBook: 9,
      characterSlugs: ["jesus", "judas", "petrus"], themeSlugs: ["betrayal"],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 3,
    },
    {
      slug: "trial-before-pilate", title: "Rättegången inför Pilatus",
      startRef: "Matthew 27:11", endRef: "Matthew 27:31", orderInBook: 10,
      characterSlugs: ["jesus", "pontius-pilatus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 4,
    },
    {
      slug: "crucifixion", title: "Korsfästelsen",
      startRef: "Matthew 27:32", endRef: "Matthew 27:44", orderInBook: 11,
      characterSlugs: ["jesus"], themeSlugs: ["sacrifice"],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 5,
    },
    {
      slug: "death-and-burial", title: "Jesu död och begravning",
      startRef: "Matthew 27:45", endRef: "Matthew 27:66", orderInBook: 12,
      characterSlugs: ["jesus", "maria-magdalena"], themeSlugs: ["sacrifice"],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 6,
    },
    {
      slug: "resurrection", title: "Uppståndelsen",
      startRef: "Matthew 28:1", endRef: "Matthew 28:20", orderInBook: 13,
      characterSlugs: ["jesus", "maria-magdalena", "petrus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 7,
    },
  ];

  for (const s of ntStories) {
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: matthew.id, slug: s.slug } },
      update: {},
      create: {
        bookId: matthew.id,
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
        where: { storyId_characterId: { storyId: story.id, characterId: ntCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: ntCharacters[charSlug].id },
      });
    }
    for (const themeSlug of s.themeSlugs) {
      const theme = themes[themeSlug] ?? ntThemes[themeSlug];
      await prisma.storyTheme.upsert({
        where: { storyId_themeId: { storyId: story.id, themeId: theme.id } },
        update: {},
        create: { storyId: story.id, themeId: theme.id },
      });
    }
  }

  // --- NT story-bilder (samma FreeBibleimages-mönster som Genesis) ---
  const ntCaptions = matthewCaptionsByCode as Record<string, string[]>;
  const ntImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "nativity", code: "FB_LS_Jesus_Born", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jesus-born/" },
    { storySlug: "baptism-of-jesus", code: "FB_LS_John_Baptist", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-john-baptist/" },
    { storySlug: "temptation-in-wilderness", code: "FB_LS_Jesus_Tempted", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jesus-tempted/" },
    { storySlug: "sermon-on-the-mount", code: "FB_GNPI_033_Beatitudes", count: 12, credit: "Good News Productions Int. (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/gnpi-033-beatitudes/" },
    { storySlug: "parable-of-the-sower", code: "FB_LS_Parable_Sower", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-parable-sower/" },
    { storySlug: "calming-the-storm", code: "FB_GNPI_043_Jesus_Storm", count: 8, credit: "Good News Productions Int. (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/gnpi-043-jesus-storm/" },
    { storySlug: "triumphal-entry", code: "FB_LS_Palm_Sunday", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-palm-sunday/" },
    { storySlug: "last-supper", code: "FB_LS_Last_Supper", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-last-supper/" },
    { storySlug: "gethsemane", code: "FB_LS_Jesus_Gethsemane", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jesus-gethsemane/" },
    { storySlug: "trial-before-pilate", code: "FB_LS_Pontius_Pilate", count: 11, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-pontius-pilate/" },
    { storySlug: "crucifixion", code: "FB_GNPI_096_Jesus_Crucifixion", count: 11, credit: "Good News Productions Int. (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/gnpi-096-jesus-crucifixion/" },
    { storySlug: "death-and-burial", code: "FB_GNPI_098_Jesus_Dies", count: 11, credit: "Good News Productions Int. (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/gnpi-098-jesus-dies/" },
    { storySlug: "resurrection", code: "FB_LS_Jesus_Alive_2", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jesus-alive-2/" },
  ];

  for (const set of ntImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: matthew.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/matthew/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = ntCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const ntPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "jesus", storySlug: "baptism-of-jesus", imgOrder: 6 },
    { slug: "maria", storySlug: "nativity", imgOrder: 7 },
    { slug: "josef-ny", storySlug: "nativity", imgOrder: 2 },
    { slug: "johannes-doparen", storySlug: "baptism-of-jesus", imgOrder: 2 },
    { slug: "judas", storySlug: "gethsemane", imgOrder: 6 },
    { slug: "petrus", storySlug: "gethsemane", imgOrder: 7 },
    { slug: "pontius-pilatus", storySlug: "trial-before-pilate", imgOrder: 3 },
    { slug: "maria-magdalena", storySlug: "resurrection", imgOrder: 4 },
  ];
  for (const p of ntPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: matthew.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({
      where: { storyId_order: { storyId: story.id, order: p.imgOrder } },
    });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  // --- Peterson-koppling: "Death and Resurrection of Christ" ---------
  // EN video, fem kapitelmarkeringar (verifierade via yt-dlp --print
  // chapters). Bara kapitel 3 ("Narratives and Sacrifice") innehåller en
  // konkret bibelverscitering — resten är tematisk, kopplas in ändå på
  // segmentnivå men utan VerseCommentary.
  const christSegments: Array<{
    storySlug: string;
    startSec: number;
    keyPoints: string;
    quote?: string;
    verseNote?: { chapter: number; verse: number; quote: string; summary: string };
  }> = [
    {
      storySlug: "death-and-burial",
      startSec: 390, // kapitel "Narratives and Sacrifice"
      keyPoints:
        "Bygger upp en teori om uppoffring genom hela Gamla testamentet " +
        "(Eden, Kain och Abel, Abraham) och landar i att Kristus offrar " +
        "sig själv 'till förtvivlans yttersta punkt på korset' — " +
        "jämför med Michelangelos Pietà (Maria som håller sin döda son) " +
        "som bild för uppoffringens mest extrema form.",
      quote:
        "In turn, Mary's son Christ offers himself to God and the world " +
        "to betrayal, torture and death, to the very point of despair on " +
        "the cross, where he cries out those terrible words from Matthew " +
        "27:46: my God, my God, why hast thou forsaken me?",
      verseNote: {
        chapter: 27,
        verse: 46,
        quote:
          "That is the archetypal story of the man who gives his all for " +
          "the sake of the better, who offers up his life for the " +
          "advancement of being.",
        summary:
          "Läser ropet på korset som den arketypiska formuleringen av " +
          "total uppoffring — 'ett skede vid gränsen, där inget mer " +
          "extremt kan föreställas', och menar att just därför blir " +
          "berättelsen arketypisk: Gud offrar samtidigt sin son medan " +
          "sonen offrar sig själv.",
      },
    },
    {
      storySlug: "crucifixion",
      startSec: 2056, // kapitel "Ark of the Covenant, Cathedral, Cross"
      keyPoints:
        "Tematisk (inte scenvis) essä om korset som arkitektoniskt/" +
        "symboliskt koncept: förbundsarken → templet → katedralen → " +
        "korset, som alla markerar 'bron mellan det ändliga och det " +
        "oändliga' — uppmanar lyssnaren att 'ta upp sitt eget korset " +
        "tragedi och svek' snarare än att bara läsa berättelsen som historia.",
      quote:
        "Pick up the cross of your tragedy and betrayal, accept its " +
        "terrible weight, hoist it onto your shoulders and struggle " +
        "impossibly upward toward the kingdom of God on the hill.",
    },
    {
      storySlug: "resurrection",
      startSec: 2506, // kapitel "The Psychological Meaning of the Death and Resurrection of Christ"
      keyPoints:
        "Sista, mest utbyggda kapitlet — en psykologisk tolkning av " +
        "uppståndelsen som arketyp för förmågan att acceptera lidande " +
        "och död utan att förfalla till bitterhet och hämndlystnad, " +
        "snarare än en historisk återberättelse av påskmorgonen.",
    },
  ];

  for (const seg of christSegments) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: matthew.id, slug: seg.storySlug } });
    const petersonSegment = await prisma.petersonSegment.upsert({
      where: { videoId_storyId: { videoId: christVideo.id, storyId: story.id } },
      update: { startSec: seg.startSec, keyPoints: seg.keyPoints, quote: seg.quote },
      create: {
        videoId: christVideo.id,
        storyId: story.id,
        startSec: seg.startSec,
        keyPoints: seg.keyPoints,
        quote: seg.quote,
      },
    });
    if (seg.verseNote) {
      await prisma.verseCommentary.upsert({
        where: {
          segmentId_chapter_verse: {
            segmentId: petersonSegment.id,
            chapter: seg.verseNote.chapter,
            verse: seg.verseNote.verse,
          },
        },
        update: { order: 1, quote: seg.verseNote.quote, summary: seg.verseNote.summary },
        create: {
          segmentId: petersonSegment.id,
          chapter: seg.verseNote.chapter,
          verse: seg.verseNote.verse,
          order: 1,
          quote: seg.verseNote.quote,
          summary: seg.verseNote.summary,
        },
      });
    }
  }

  console.log(`Seedat Matteusevangeliet: ${ntStories.length} stories, ${christSegments.length} Peterson-segment.`);

  // ======================================================================
  // FAS 6: Andra Moseboken (Exodus) på djupet
  // ======================================================================
  // Bygger ett riktigt story-index för Exodus-narrativet (tidigare fanns
  // bara video-metadata för de 16 fria panelklippen, ingen Story-koppling
  // alls). Försökte hämta transkript för de tydligaste klippen (samma
  // metod som för Genesis/Kristus-videorna) men fyra av dem kräver
  // YouTube-inloggning (`yt-dlp`: "Please sign in") — vi har inga
  // inloggningsuppgifter och ska inte försöka kringgå det. Segment-
  // koppling görs därför bara för klipp där TITELN entydigt pekar på en
  // specifik story (ingen gissning), med startSec=0 (ovverifierad exakt
  // position) — ärligare än att låtsas ha grävt fram en tidsstämpel vi
  // inte har. Övriga 12 klipp finns kvar som bläddringsbara videor i
  // Exodus-serien (redan seedad ovan) utan tvingad story-koppling.
  const exodus = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "exodus" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "exodus",
      name: "Andra Moseboken (Exodus)",
      order: 2, // mellan Genesis (1) och Matteus (flyttad till 3 nedan)
      testament: "old",
    },
  });
  await prisma.book.update({ where: { id: matthew.id }, data: { order: 3 } });

  const exCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "mose", name: "Mose" },
    { slug: "farao", name: "Farao" },
    { slug: "aron", name: "Aron" },
    { slug: "mirjam", name: "Mirjam" },
  ];
  const exCharacters: Record<string, { id: string }> = {};
  for (const c of exCharacterDefs) {
    exCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type ExStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const exStories: ExStoryDef[] = [
    { slug: "moses-in-the-basket", title: "Mose i vassen", startRef: "Exodus 2:1", endRef: "Exodus 2:10", orderInBook: 1, characterSlugs: ["mose", "mirjam"], themeSlugs: [] },
    { slug: "burning-bush", title: "Den brinnande busken", startRef: "Exodus 3:1", endRef: "Exodus 4:17", orderInBook: 2, characterSlugs: ["mose"], themeSlugs: [] },
    { slug: "ten-plagues", title: "De tio plågorna", startRef: "Exodus 7:14", endRef: "Exodus 11:10", orderInBook: 3, characterSlugs: ["mose", "aron", "farao"], themeSlugs: ["chaos-order"] },
    { slug: "passover-and-exodus", title: "Påsken och uttåget", startRef: "Exodus 12:1", endRef: "Exodus 12:42", orderInBook: 4, characterSlugs: ["mose", "farao"], themeSlugs: ["sacrifice"] },
    { slug: "crossing-the-red-sea", title: "Vandringen genom Röda havet", startRef: "Exodus 14:1", endRef: "Exodus 14:31", orderInBook: 5, characterSlugs: ["mose", "farao"], themeSlugs: ["chaos-order", "testing-of-faith"] },
    { slug: "ten-commandments", title: "De tio budorden på Sinai", startRef: "Exodus 19:16", endRef: "Exodus 20:21", orderInBook: 6, characterSlugs: ["mose"], themeSlugs: ["kingdom-of-god"] },
    { slug: "golden-calf", title: "Guldkalven", startRef: "Exodus 32:1", endRef: "Exodus 32:35", orderInBook: 7, characterSlugs: ["mose", "aron"], themeSlugs: ["betrayal"] },
  ];

  for (const s of exStories) {
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: exodus.id, slug: s.slug } },
      update: {},
      create: {
        bookId: exodus.id, slug: s.slug, title: s.title,
        startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook,
      },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: exCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: exCharacters[charSlug].id },
      });
    }
    for (const themeSlug of s.themeSlugs) {
      const theme = themes[themeSlug] ?? ntThemes[themeSlug];
      await prisma.storyTheme.upsert({
        where: { storyId_themeId: { storyId: story.id, themeId: theme.id } },
        update: {},
        create: { storyId: story.id, themeId: theme.id },
      });
    }
  }

  // --- Exodus story-bilder --------------------------------------------
  const exCaptions = exodusCaptionsByCode as Record<string, string[]>;
  const exImageSets: Array<{ storySlug: string; code: string; count: number; offset: number; credit: string; creditUrl: string }> = [
    { storySlug: "moses-in-the-basket", code: "FB_LS_Baby_Moses", count: 8, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-baby-moses/" },
    { storySlug: "burning-bush", code: "FB_LS_Burning_Bush", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-burning-bush/" },
    { storySlug: "ten-plagues", code: "FB_LS_Plagues_1", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-plagues-1/" },
    { storySlug: "ten-plagues", code: "FB_LS_Plagues_2", count: 9, offset: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-plagues-2/" },
    { storySlug: "passover-and-exodus", code: "FB_LS_Passover", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-passover/" },
    { storySlug: "crossing-the-red-sea", code: "FB_Moses_Red_Sea", count: 15, offset: 0, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/moses-red-sea/" },
    { storySlug: "ten-commandments", code: "FB_RG_Moses_10_Commandments", count: 15, offset: 0, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-moses-10-commandments/" },
    { storySlug: "golden-calf", code: "FB_LS_Golden_Calf", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-golden-calf/" },
  ];
  for (const set of exImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: exodus.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const order = set.offset + fileNum;
      const path = `/images/exodus/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = exCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const exPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "mose", storySlug: "burning-bush", imgOrder: 6 },
    { slug: "mirjam", storySlug: "moses-in-the-basket", imgOrder: 5 },
    { slug: "farao", storySlug: "ten-plagues", imgOrder: 3 },
    { slug: "aron", storySlug: "golden-calf", imgOrder: 5 },
  ];
  for (const p of exPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: exodus.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  // --- Peterson-koppling: bara de klipp vars TITEL entydigt pekar på en
  // specifik story (se motivering i kommentaren ovanför blocket).
  const exSegmentLinks: Array<{ storySlug: string; clipOrder: number; keyPoints: string }> = [
    {
      storySlug: "ten-plagues", clipOrder: 4,
      keyPoints:
        "Panelklipp om de tio plågorna. Otranskriberat (klippet kräver " +
        "YouTube-inloggning för undertexter) — kopplingen bygger bara på " +
        "klippets egen titel, ej verifierad mot innehållet vers för vers.",
    },
    {
      storySlug: "ten-commandments", clipOrder: 8,
      keyPoints:
        "Panelklipp om varför Mose klättrade berget Sinai. Otranskriberat " +
        "(kräver inloggning) — kopplingen bygger bara på klippets titel.",
    },
    {
      storySlug: "ten-commandments", clipOrder: 9,
      keyPoints:
        "Panelklipp kopplar de tio budorden till '10 Rules For Life'. " +
        "Otranskriberat (kräver inloggning) — kopplingen bygger bara på " +
        "klippets titel.",
    },
    {
      storySlug: "golden-calf", clipOrder: 13,
      keyPoints:
        "Panelklipp om att dyrka det man borde offra — matchar " +
        "guldkalvens tema (avgudadyrkan istället för uppoffring). " +
        "Otranskriberat (kräver inloggning) — kopplingen bygger bara på " +
        "klippets titel.",
    },
  ];
  for (const link of exSegmentLinks) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: exodus.id, slug: link.storySlug } });
    const clip = exodusClips.find((c) => c.order === link.clipOrder)!;
    const video = await prisma.petersonVideo.findUniqueOrThrow({ where: { youtubeId: clip.youtubeId } });
    await prisma.petersonSegment.upsert({
      where: { videoId_storyId: { videoId: video.id, storyId: story.id } },
      update: { startSec: 0, keyPoints: link.keyPoints },
      create: { videoId: video.id, storyId: story.id, startSec: 0, keyPoints: link.keyPoints },
    });
  }

  console.log(`Seedat Andra Moseboken: ${exStories.length} stories, ${exSegmentLinks.length} Peterson-segment (titel-baserade, ej vers-nivå).`);

  // ======================================================================
  // FAS 7: Maps of Meaning + 12 Rules for Life (framework-korpusen)
  // ======================================================================
  // Till skillnad från Bibeln är det här Petersons EGET material — inte
  // en text han kommenterar. Varje "Story" är alltså ett kapitel/en
  // föreläsning i sig själv, med ett self-referentiellt PetersonSegment
  // (videon ÄR kapitlet, startSec 0) snarare än en vers-kommentar till en
  // extern text. Ingen bibeltext hämtas (kind: "framework", se bible.ts).
  //
  // "Maps of Meaning"-boken (1999) har bara 5 kapitel + för-/efterord —
  // för kort för ett meningsfullt index. Använder istället 2017 års
  // University of Toronto-föreläsningsserie (samma titel, 12 delar),
  // fritt på YouTube utan inloggningskrav (verifierat). YouTube-ID:n
  // hämtade direkt ur den officiella spellistan via `yt-dlp
  // --flat-playlist` (inte gissade/sökta som för Exodus-klippen).
  // Beskrivningarna bygger på att faktiskt läsa öppningen (~5–10 min)
  // av transkriptet för 11 av 12 föreläsningar — INTE en fullständig
  // genomlyssning av alla ~2,5 timmar per avsnitt. Avsnitt 7 hade inga
  // undertexter alls tillgängliga (yt-dlp: "no subtitles") — dess
  // beskrivning är därför enbart titel-baserad, tydligt markerad som
  // sådan.
  const mapsSeries = await prisma.petersonSeries.upsert({
    where: { slug: "maps-of-meaning-2017" },
    update: {},
    create: {
      slug: "maps-of-meaning-2017",
      title: "Maps of Meaning: The Architecture of Belief (2017)",
      requiresPaidAccess: false,
      isPanelDiscussion: false,
      enabledByDefault: true,
      notes: "12 universitetsföreläsningar (University of Toronto), fritt på YouTube.",
    },
  });

  const mapsOfMeaningBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: mapsOfMeaningCorpus.id, slug: "maps-of-meaning-2017" } },
    update: {},
    create: {
      corpusId: mapsOfMeaningCorpus.id,
      slug: "maps-of-meaning-2017",
      name: "Maps of Meaning (2017 års föreläsningsserie)",
      order: 1,
    },
  });

  const rulesBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: mapsOfMeaningCorpus.id, slug: "12-rules-for-life" } },
    update: {},
    create: {
      corpusId: mapsOfMeaningCorpus.id,
      slug: "12-rules-for-life",
      name: "12 Rules for Life",
      order: 2,
    },
  });

  type MomLecture = { order: number; slug: string; title: string; youtubeId: string; summary: string };
  const momLectures: MomLecture[] = [
    {
      order: 1, slug: "context-and-background", title: "Kontext och bakgrund", youtubeId: "I8Xc2_FtpHI",
      summary:
        "Berättar teorins ursprungshistoria: sin generations kärnvapenrädsla " +
        "under kalla kriget och ett besök i en nedlagd amerikansk robotsilo, " +
        "som fick honom att fundera på varför människor är beredda att " +
        "riskera världen för sina trosuppfattningar. Introducerar även " +
        "hierarki/ojämlikhet (Pareto-fördelningen) som ett återkommande " +
        "naturligt mönster.",
    },
    {
      order: 2, slug: "marionettes-and-individuals-1", title: "Marionetter och individer (del 1)", youtubeId: "EN2lyN7rM4E",
      summary:
        "Går igenom Disneys Pinocchio scen för scen som en karta över hur " +
        "en 'marionett' (styrd utifrån/av sina impulser) förvandlas till " +
        "ett verkligt, autonomt subjekt. Utgångspunkt: vi uppfattar " +
        "världen genom ett narrativt raster, eftersom grundproblemet är " +
        "hur man ska HANDLA, inte bara vad som objektivt finns.",
    },
    {
      order: 3, slug: "marionettes-and-individuals-2", title: "Marionetter och individer (del 2)", youtubeId: "Us979jCjHu8",
      summary:
        "Fortsätter Pinocchio-analysen: Blå Fen, Jeppe, och Räven/Katten/" +
        "Kusken som avslöjar sig som något demoniskt. Kopplar det till " +
        "Jungs idé om att människans 'skugga' sträcker sig ända ner till " +
        "det ondskefulla — att bli medveten om egna destruktiva impulser " +
        "är nödvändigt snarare än farligt att förneka.",
    },
    {
      order: 4, slug: "marionettes-and-individuals-3", title: "Marionetter och individer (del 3)", youtubeId: "bV16NEWld8Q",
      summary:
        "Avslutar Pinocchio-genomgången och binder ihop filmens narrativa " +
        "struktur med föreläsningsseriens större ramverk innan mer " +
        "konkreta/tekniska detaljer introduceras i nästa avsnitt.",
    },
    {
      order: 5, slug: "story-and-metastory-1", title: "Berättelse och metaberättelse (del 1)", youtubeId: "RudKmwzDpNY",
      summary:
        "Introducerar berättelsen som 'den enklaste användbara " +
        "informationsenheten' för handling och perception, och " +
        "metaberättelsen som en berättelse om HUR berättelser förändras. " +
        "Går igenom sovjetisk psykofysiologisk forskning (Sokolov, " +
        "Vinogradova, byggt på Lurias arbete) om hjärnans reaktion på " +
        "avvikelser från förväntan.",
    },
    {
      order: 6, slug: "story-and-metastory-2", title: "Berättelse och metaberättelse (del 2)", youtubeId: "nsZ8XqHPjI4",
      summary:
        "Fortsätter bygga ut modellen för hur berättelser fungerar som " +
        "kartor över handling, med fler exempel på hur metaberättelser " +
        "beskriver övergången mellan olika sådana kartor.",
    },
    {
      order: 7, slug: "images-of-story-and-metastory", title: "Bilder av berättelse och metaberättelse", youtubeId: "F3n5qtj89QE",
      summary:
        "(Ej transkriberad — inga undertexter tillgängliga för just detta " +
        "avsnitt.) Beskrivningen bygger enbart på titeln och sammanhanget " +
        "mellan föreläsning 6 och 8 — troligen bildmässiga/visuella " +
        "exempel som brygga mellan de teoretiska avsnitten och den " +
        "kommande neuropsykologiska genomgången. Inte verifierad mot " +
        "faktiskt innehåll.",
    },
    {
      order: 8, slug: "neuropsychology-of-symbolic-representation", title: "Symbolers neuropsykologi", youtubeId: "Nb5cBkbQpGY",
      summary:
        "Om hur trossystem reglerar känslor — inte genom att direkt " +
        "minska dödsångest, utan genom att orientera individen så att " +
        "handling matchar det sociala samspelet med andra. Går in på " +
        "varför människor är beredda att försvara och strida för sina " +
        "trossystem.",
    },
    {
      order: 9, slug: "patterns-of-symbolic-representation", title: "Mönster i symbolisk representation", youtubeId: "yXZSeiAl4PI",
      summary:
        "Fördjupar sig i Jungs arketyp-begrepp (med rötter i Platons " +
        "idélära) och hur arketyper kan förstås biologiskt, socialt och " +
        "individuellt samtidigt — och varför Jung själv aldrig gav en " +
        "helt entydig definition av begreppet.",
    },
    {
      order: 10, slug: "genesis-and-the-buddha", title: "Genesis och Buddha", youtubeId: "7XtEZvLo-Sc",
      summary:
        "Tolkar skapelseberättelserna i Första Moseboken (det finns två) " +
        "parallellt med berättelsen om Buddha, som exempel på samma " +
        "arketypiska berättelsestruktur: ett fungerande utgångsläge, " +
        "uppkomsten av ett problem, och en förändring/lösning — kopplat " +
        "till en pragmatisk sanningsteori (mot bakgrund av en debatt med " +
        "Sam Harris).",
    },
    {
      order: 11, slug: "the-flood-and-the-tower", title: "Floden och tornet", youtubeId: "T4fjSrVCDvA",
      summary:
        "Bygger vidare på trossystemens psykologi efter tre månaders " +
        "undervisning: vad ett trossystem egentligen är, varför människor " +
        "är beredda att strida för det, och om det finns ett sätt att " +
        "bedöma olika trossystems relativa kvalitet (kopplat till frågan " +
        "om moralisk relativism kontra kalla krigets ideologiska konflikt).",
    },
    {
      order: 12, slug: "final-the-divinity-of-the-individual", title: "Final: individens gudomlighet", youtubeId: "6V1eMvGGcXQ",
      summary:
        "Föreläsningsseriens avslutning — binder ihop terminen kring " +
        "idén om den enskilda individens värde/helighet som den yttersta " +
        "motvikten till totalitära system.",
    },
  ];

  for (const lecture of momLectures) {
    const video = await prisma.petersonVideo.upsert({
      where: { youtubeId: lecture.youtubeId },
      update: { title: `2017 Maps of Meaning ${lecture.order}: ${lecture.title}`, seriesId: mapsSeries.id, seriesOrder: lecture.order },
      create: {
        youtubeId: lecture.youtubeId,
        title: `2017 Maps of Meaning ${lecture.order}: ${lecture.title}`,
        seriesId: mapsSeries.id,
        seriesOrder: lecture.order,
      },
    });
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: mapsOfMeaningBook.id, slug: lecture.slug } },
      update: {},
      create: {
        bookId: mapsOfMeaningBook.id,
        slug: lecture.slug,
        title: lecture.title,
        startRef: `Föreläsning ${lecture.order}`,
        endRef: `Föreläsning ${lecture.order}`,
        summary: lecture.summary,
        orderInBook: lecture.order,
      },
    });
    await prisma.petersonSegment.upsert({
      where: { videoId_storyId: { videoId: video.id, storyId: story.id } },
      update: { startSec: 0, keyPoints: lecture.summary },
      create: { videoId: video.id, storyId: story.id, startSec: 0, keyPoints: lecture.summary },
    });
  }

  // --- 12 Rules for Life -------------------------------------------
  // Ingen enskild kanonisk video per regel (Peterson diskuterar dem " +
  // spritt över hundratals poddavsnitt/intervjuer) — se README
  // "discovery-fas" för Nietzsche/Dostojevskij-liknande material. Bara
  // textindex än så länge, ingen PetersonSegment-koppling.
  const rules: Array<{ order: number; slug: string; title: string; summary: string }> = [
    { order: 1, slug: "stand-up-straight", title: "Stå rak i ryggen med axlarna tillbaka", summary: "Om att möta livet med rest hållning — kopplat till hierarkiforskning på hummer och serotonin/status." },
    { order: 2, slug: "treat-yourself-like-someone-you-are-responsible-for", title: "Behandla dig själv som någon du är ansvarig för att hjälpa", summary: "Om att bry sig lika mycket om sig själv som om andra man tycker om." },
    { order: 3, slug: "make-friends-with-people-who-want-the-best-for-you", title: "Skaffa dig vänner som vill dig väl", summary: "Om att inte acceptera destruktiva relationer av missriktad lojalitet." },
    { order: 4, slug: "compare-yourself-to-who-you-were-yesterday", title: "Jämför dig med den du var igår, inte med någon annan idag", summary: "Om att sätta realistiska, personliga mått på framsteg istället för att jämföra sig med andra." },
    { order: 5, slug: "do-not-let-your-children-do-anything-that-makes-you-dislike-them", title: "Låt inte dina barn göra sånt som gör att du ogillar dem", summary: "Om föräldraskap, gränssättning och barns sociala kompetens." },
    { order: 6, slug: "set-your-house-in-order", title: "Sätt ditt eget hus i fullständig ordning innan du kritiserar världen", summary: "Om att ta tag i sitt eget liv innan man dömer andra eller samhället i stort." },
    { order: 7, slug: "pursue-what-is-meaningful", title: "Sträva efter det som är meningsfullt, inte det som är bekvämt", summary: "Om uppoffring och långsiktig mening framför kortsiktig bekvämlighet." },
    { order: 8, slug: "tell-the-truth", title: "Tala sanning — eller åtminstone ljug inte", summary: "Om språkets och ärlighetens roll för att hålla verkligheten sammanhållen." },
    { order: 9, slug: "assume-the-person-you-are-listening-to-might-know-something", title: "Utgå från att den du lyssnar på kanske vet något du inte vet", summary: "Om ödmjukhet i samtal och terapeutiskt lyssnande." },
    { order: 10, slug: "be-precise-in-your-speech", title: "Var precis i ditt tal", summary: "Om att definiera problem noggrant istället för att låta dem vaga ut till något överväldigande." },
    { order: 11, slug: "do-not-bother-children-skateboarding", title: "Stör inte barn som åker skateboard", summary: "Om risktagande, mod och att inte överbeskydda unga." },
    { order: 12, slug: "pet-a-cat", title: "Klappa en katt när du möter en på gatan", summary: "Om att uppmärksamma små stunder av glädje mitt i livets svårigheter." },
  ];
  for (const r of rules) {
    await prisma.story.upsert({
      where: { bookId_slug: { bookId: rulesBook.id, slug: r.slug } },
      update: {},
      create: {
        bookId: rulesBook.id,
        slug: r.slug,
        title: `Regel ${r.order}: ${r.title}`,
        startRef: `Regel ${r.order}`,
        endRef: `Regel ${r.order}`,
        summary: r.summary,
        orderInBook: r.order,
      },
    });
  }

  console.log(`Seedat Maps of Meaning: ${momLectures.length} föreläsningar, 12 Rules for Life: ${rules.length} regler.`);

  // --- Bokpresentationer -----------------------------------------
  // Traditionell attribuering (judisk/kristen tolkningstradition), inte
  // nödvändigtvis modern bibelforsknings-konsensus (som ofta ser flera
  // författare/senare sammanställning, t.ex. den "dokumentära hypotesen"
  // för Genesis/Exodus, eller daterar Matteus till ca 80–90 e.Kr. av en
  // okänd sammanställare snarare än aposteln själv). Båda perspektiven
  // nämns kort. Se README "Bokpresentationer" för avgränsning.
  const bookInfo: Array<{ id: string; description: string; authorship: string; traditions: string }> = [
    {
      id: genesis.id,
      description:
        "Skapelsen, mänsklighetens tidiga historia (syndafallet, Kain och " +
        "Abel, floden, Babel) och sedan patriarkernas historia — Abraham, " +
        "Isak, Jakob och Josef — fram till att israeliterna hamnar i Egypten.",
      authorship:
        "Traditionellt tillskriven Mose (ca 1200-talet f.Kr.), skriven för " +
        "att ge det framväxande israelitiska folket en ursprungsberättelse " +
        "och identitet. Modern bibelforskning ser den ofta som en " +
        "sammanställning av flera äldre källor, redigerad långt senare " +
        "(den s.k. dokumentära hypotesen).",
      traditions:
        "Judendom: första boken i Toran, central. Kristendom: första boken " +
        "i Gamla testamentet. Islam: Adam, Ibrahim (Abraham), Ishaq (Isak), " +
        "Yaqub (Jakob) och Yusuf (Josef) förekommer i Koranen med delvis " +
        "andra detaljer — Josefs historia återges särskilt utförligt i " +
        "sura 12 (Yusuf).",
    },
    {
      id: exodus.id,
      description:
        "Israeliternas slaveri i Egypten, Moses födelse och kallelse, de " +
        "tio plågorna, uttåget och vandringen genom Röda havet, mötet med " +
        "Gud vid Sinai (de tio budorden och förbundet), och guldkalvs-" +
        "avfallet.",
      authorship:
        "Traditionellt tillskriven Mose, som deltagare i händelserna. " +
        "Modern forskning ser den, liksom Genesis, som en senare " +
        "sammanställning av flera källor.",
      traditions:
        "Judendom: central i Toran — påsken (Pesach) firas till minne av " +
        "just uttåget. Kristendom: del av Gamla testamentet. Islam: Musa " +
        "(Mose) är den mest omnämnda profeten i Koranen — Farao, plågorna, " +
        "havsundret och kalv-avfallet (där Samiri snarare än Aron pekas ut " +
        "som skyldig) återkommer i flera suror, bl.a. Al-Baqarah, Al-A'raf " +
        "och Ta-Ha.",
    },
    {
      id: matthew.id,
      description:
        "Jesu födelse och släkttavla, hans undervisning, liknelser och " +
        "under, och till sist passionsveckan — tillfångatagande, rättegång, " +
        "korsfästelse och uppståndelse. Första av de fyra evangelierna i " +
        "Nya testamentets kanoniska ordning.",
      authorship:
        "Traditionellt tillskriven aposteln Matteus (Levi), en före detta " +
        "tullindrivare bland Jesu tolv lärjungar, skriven för en huvudsakligen " +
        "judisk-kristen läsekrets (starkt fokus på uppfyllda profetior från " +
        "Gamla testamentet). Modern forskning daterar den ofta till ca " +
        "80–90 e.Kr. och ifrågasätter direkt apostolisk författarskap, " +
        "möjligen byggd på Markusevangeliet plus en hypotetisk källa (\"Q\").",
      traditions:
        "Kristendom: central, en av de fyra evangelierna. Judendom: ingår " +
        "inte i judisk skrift (Nya testamentet är specifikt kristet). " +
        "Islam: Jesus (Isa) är en av de viktigaste profeterna i Koranen — " +
        "jungfrufödelsen och flera under nämns — men Koranen (sura 4:157) " +
        "förnekar att han korsfästes eller dog på korset, och Islam ser " +
        "honom som profet, inte Guds son. Matteusevangeliet som text ingår " +
        "alltså inte i islamsk skrift, även om huvudpersonen gör det.",
    },
    {
      id: mapsOfMeaningBook.id,
      description:
        "Petersons psykologiska tolkningsramverk för myt, religion och " +
        "berättelsestruktur — inte en religiös text i sig, utan en teori " +
        "om VARFÖR sådana texter fångar mänsklig erfarenhet.",
      authorship: "Jordan B. Peterson, föreläsningar hållna 2017 vid University of Toronto.",
      traditions:
        "Inte kopplad till någon specifik religiös tradition — men " +
        "diskuterar och drar på berättelser från många (kristendom, " +
        "judendom, buddhism m.fl.) som exempel på återkommande mönster.",
    },
    {
      id: rulesBook.id,
      description:
        "Petersons populära självhjälpsbok (2018) — tolv livsregler, var " +
        "och en utvecklad i ett eget kapitel, byggda på samma psykologiska " +
        "grundtankar som Maps of Meaning.",
      authorship: "Jordan B. Peterson, utgiven 2018.",
      traditions: "Inte en religiös text, men starkt påverkad av Petersons bibeltolkning.",
    },
  ];
  for (const b of bookInfo) {
    await prisma.book.update({
      where: { id: b.id },
      data: { description: b.description, authorship: b.authorship, traditions: b.traditions },
    });
  }

  // ======================================================================
  // FAS 8: Referens-index — vilka källor/personer Peterson faktiskt
  // använder för att illustrera sina poänger
  // ======================================================================
  // Byggd genom att gå tillbaka genom transkripten som redan lästs för
  // tidigare faser och plocka ut varje gång Peterson namnger en person
  // utanför själva bibeltexten. INGEN ny transkript-genomgång gjord för
  // just den här fasen — bara det som redan hittats i förbifarten.
  // Modellerar de refererade personerna som riktiga Character-poster
  // (inte bara Reference.externalLabel) så de får en egen indexsida
  // precis som bibliska karaktärer, även om de har noll story-framträdanden.
  // Nietzsche är INTE med trots att han är central för Peterson — hittade
  // ingen verifierad Nietzsche-referens i det transkript vi faktiskt läst
  // hittills (bara i inte-transkriberade avsnitt/klipp). Bättre att
  // utelämna än att gissa. En "Al Albert Barn"-referens i ep10 (troligen
  // bibelforskaren Robert Alter, men ASR-texten är för förvrängd för att
  // vara säker) utelämnad av samma skäl.
  const refCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "dostojevskij", name: "Fjodor Dostojevskij" },
    { slug: "carl-jung", name: "Carl Jung" },
    { slug: "sigmund-freud", name: "Sigmund Freud" },
    { slug: "platon", name: "Platon" },
    { slug: "sam-harris", name: "Sam Harris" },
    { slug: "alexander-luria", name: "Alexander Luria" },
    { slug: "michelangelo", name: "Michelangelo" },
  ];
  const refCharacters: Record<string, { id: string }> = {};
  for (const c of refCharacterDefs) {
    refCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type RefDef = {
    videoYoutubeId: string;
    storySlug?: string; // om referensen görs i samband med en specifik story
    characterSlug: string;
    note: string;
  };
  const references: RefDef[] = [
    {
      videoYoutubeId: "44f3mxcsI50", storySlug: "cain-and-abel", characterSlug: "dostojevskij",
      note:
        "Rekommenderar Dostojevskijs Brott och straff som — enligt honom " +
        "kanske den bästa skildringen som någonsin skrivits — av vad som " +
        "psykologiskt händer med en person som begår det yttersta brottet, " +
        "direkt kopplat till Kains mord på Abel.",
    },
    {
      videoYoutubeId: "Us979jCjHu8", storySlug: "marionettes-and-individuals-2", characterSlug: "carl-jung",
      note:
        "Använder Jungs idé om att människans 'skugga' sträcker sig ända " +
        "ner till det ondskefulla för att förklara varför Räven, Katten " +
        "och Kusken i Pinocchio till slut avslöjar sig som något demoniskt.",
    },
    {
      videoYoutubeId: "yXZSeiAl4PI", storySlug: "patterns-of-symbolic-representation", characterSlug: "carl-jung",
      note:
        "Går igenom hur Jung populariserade och vidareutvecklade " +
        "arketyp-begreppet (med rötter i Platons idélära) och varför Jung " +
        "själv aldrig gav en helt entydig definition av det.",
    },
    {
      videoYoutubeId: "yXZSeiAl4PI", storySlug: "patterns-of-symbolic-representation", characterSlug: "sigmund-freud",
      note:
        "Nämner Freuds idé om att människan är sammansatt av flera " +
        "'subpersonligheter' som en föregångare till Jungs arketyp-tänkande.",
    },
    {
      videoYoutubeId: "yXZSeiAl4PI", storySlug: "patterns-of-symbolic-representation", characterSlug: "platon",
      note: "Beskriver de platonska idéerna/formerna som i grunden själva arketyper.",
    },
    {
      videoYoutubeId: "7XtEZvLo-Sc", storySlug: "genesis-and-the-buddha", characterSlug: "sam-harris",
      note:
        "Refererar till en offentlig debatt med Sam Harris om en pragmatisk " +
        "sanningsteori — att en plan/karta 'valideras' genom att den " +
        "fungerar i handling, inte bara genom att korrespondera med fakta.",
    },
    {
      videoYoutubeId: "RudKmwzDpNY", storySlug: "story-and-metastory-1", characterSlug: "alexander-luria",
      note:
        "Beskriver Luria som 'kanske 1900-talets största neuropsykolog' " +
        "och hur hans studier av krigsskadade soldater lade grunden för " +
        "senare forskning (Sokolov, Vinogradova) om hjärnans reaktion på " +
        "avvikelser från förväntan — som föreläsningsseriens 'berättelse'-" +
        "begrepp bygger vidare på.",
    },
    {
      videoYoutubeId: "xPIanlF6IwM", storySlug: "death-and-burial", characterSlug: "michelangelo",
      note:
        "Använder Michelangelos skulptur Pietà (Maria som håller sin döda, " +
        "korsfäste son) som bild för den yttersta formen av uppoffring — " +
        "en mors villighet att låta sitt barn komma till världen trots att " +
        "hon vet vad som väntar.",
    },
  ];

  for (const r of references) {
    const video = await prisma.petersonVideo.findUniqueOrThrow({ where: { youtubeId: r.videoYoutubeId } });
    const story = r.storySlug ? await prisma.story.findFirst({ where: { slug: r.storySlug } }) : null;
    const characterId = refCharacters[r.characterSlug].id;
    await prisma.reference.upsert({
      where: { videoId_storyId_characterId: { videoId: video.id, storyId: story?.id ?? "", characterId } },
      update: { note: r.note },
      create: { videoId: video.id, storyId: story?.id, characterId, note: r.note },
    });
  }
  console.log(`Seedat referens-index: ${refCharacterDefs.length} refererade personer, ${references.length} referenser.`);

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
