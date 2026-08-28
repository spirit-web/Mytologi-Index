// Seed-data för Genesis-berättelseindexet + metadata om Jordan Petersons
// videoserier (utan exakta tidsstämplar ännu — det är Phase 2, se README).
//
// Källor för berättelseindelning: standard bibelvetenskaplig kapitel-
// indelning. Källor för Peterson-serierna: se README "Källor".

import { PrismaClient } from "@prisma/client";
import captionsByCode from "./image-captions.json";
import matthewCaptionsByCode from "./image-captions-matthew.json";
import exodusCaptionsByCode from "./image-captions-exodus.json";
import lukeCaptionsByCode from "./image-captions-luke.json";
import johnCaptionsByCode from "./image-captions-john.json";
import markCaptionsByCode from "./image-captions-mark.json";
import jonahCaptionsByCode from "./image-captions-jonah.json";
import ruthCaptionsByCode from "./image-captions-ruth.json";
import estherCaptionsByCode from "./image-captions-esther.json";
import danielCaptionsByCode from "./image-captions-daniel.json";
import samuelCaptionsByCode from "./image-captions-1samuel.json";
import deutCaptionsByCode from "./image-captions-deuteronomy.json";
import jeremiahCaptionsByCode from "./image-captions-jeremiah.json";
import joshuaCaptionsByCode from "./image-captions-joshua.json";
import samuel2CaptionsByCode from "./image-captions-2samuel.json";
import kings1CaptionsByCode from "./image-captions-1kings.json";
import numbersCaptionsByCode from "./image-captions-numbers.json";
import judgesCaptionsByCode from "./image-captions-judges.json";
import kings1Captions2ByCode from "./image-captions-1kings-2.json";
import kings2CaptionsByCode from "./image-captions-2kings.json";
import nehemiahCaptionsByCode from "./image-captions-nehemiah.json";
import actsCaptionsByCode from "./image-captions-acts.json";
import annunciationCaptionsByCode from "./image-captions-luke-annunciation.json";

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
    "isaac", "jacob", "esau", "joseph", "rebekah", "laban", "rachel", "leah",
    "hagar",
    // NY 2026-08-27: Dina (kap. 34) och Juda & Tamar (kap. 38) — direkt
    // efterfrågade av användaren, se README Fas 44.
    "dinah", "judah", "tamar",
  ] as const;
  const displayName: Record<string, string> = {
    adam: "Adam", eve: "Eva", cain: "Kain", abel: "Abel", noah: "Noa",
    abraham: "Abraham", sarah: "Sara", lot: "Lot", isaac: "Isak",
    jacob: "Jakob", esau: "Esau", joseph: "Josef", rebekah: "Rebecka",
    laban: "Laban", rachel: "Rakel", leah: "Lea", hagar: "Hagar",
    dinah: "Dina", judah: "Juda", tamar: "Tamar",
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
    { slug: "deception", name: "Svek & bedrägeri" },
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
      // NY 2026-08-27: fyller en lucka mellan förbundslöftet och Sodom —
      // Abrams och Sarais eget, mänskliga försök att "hjälpa" löftet på
      // traven genom Hagar, och de spänningar det utlöser.
      slug: "hagar-and-ishmael",
      title: "Hagar och Ismael föds",
      startRef: "Genesis 16:1", endRef: "Genesis 16:16",
      orderInBook: 9,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 4,
      characterSlugs: ["abraham", "sarah", "hagar"],
      themeSlugs: ["sibling-rivalry", "deception"],
    },
    {
      slug: "sodom-and-gomorrah",
      title: "Sodom och Gomorra",
      startRef: "Genesis 18:16", endRef: "Genesis 19:29",
      orderInBook: 10,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 5,
      characterSlugs: ["abraham", "lot"],
      themeSlugs: ["chaos-order"],
    },
    {
      // NY 2026-08-27: Isaks födelse (det utlovade löftesbarnet) och den
      // smärtsamma konsekvensen för Hagar och Ismael — avslutar deras
      // tråd som påbörjades i kap. 16.
      slug: "isaac-born-and-ishmael-sent-away",
      title: "Isak föds — Hagar och Ismael skickas bort",
      startRef: "Genesis 21:1", endRef: "Genesis 21:21",
      orderInBook: 11,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 6,
      characterSlugs: ["abraham", "sarah", "hagar", "isaac"],
      themeSlugs: ["sibling-rivalry", "chaos-order"],
    },
    {
      slug: "binding-of-isaac",
      title: "Isaks offer (Akedah)",
      startRef: "Genesis 22:1", endRef: "Genesis 22:19",
      orderInBook: 12,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 7,
      characterSlugs: ["abraham", "isaac"],
      themeSlugs: ["sacrifice", "testing-of-faith"],
    },
    {
      // NY 2026-08-27: Abraham-cykelns sista episod — hans tjänare finner
      // Rebecka åt Isak, en klassisk "typscen" (möte vid en brunn) som
      // återkommer för både Jakob (29:1-14) och Mose (Exodus 2:15-21).
      slug: "rebekah-at-the-well",
      title: "Rebecka vid brunnen",
      startRef: "Genesis 24:1", endRef: "Genesis 24:67",
      orderInBook: 13,
      seriesSlug: "abraham", seriesTitle: "Abraham-cykeln", seriesOrder: 8,
      characterSlugs: ["abraham", "isaac", "rebekah"],
      themeSlugs: ["covenant"],
    },
    {
      slug: "jacob-buys-birthright",
      title: "Jakob köper Esaus förstfödslorätt",
      startRef: "Genesis 25:19", endRef: "Genesis 25:34",
      orderInBook: 14,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 1,
      characterSlugs: ["jacob", "esau", "isaac", "rebekah"],
      themeSlugs: ["sibling-rivalry", "deception"],
    },
    {
      slug: "jacob-steals-blessing",
      title: "Jakob lurar till sig Isaks välsignelse",
      startRef: "Genesis 27:1", endRef: "Genesis 27:45",
      orderInBook: 15,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 2,
      characterSlugs: ["jacob", "esau", "isaac", "rebekah"],
      themeSlugs: ["deception", "hierarchy"],
    },
    {
      slug: "jacobs-ladder",
      title: "Jakobs stege",
      startRef: "Genesis 28:10", endRef: "Genesis 28:22",
      orderInBook: 16,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 3,
      characterSlugs: ["jacob"],
      themeSlugs: ["hierarchy"],
    },
    {
      slug: "jacob-serves-laban-for-rachel-and-leah",
      title: "Jakob arbetar för Rakel — men får Lea",
      startRef: "Genesis 29:1", endRef: "Genesis 30:24",
      orderInBook: 17,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 4,
      characterSlugs: ["jacob", "laban", "rachel", "leah"],
      themeSlugs: ["deception", "sibling-rivalry"],
    },
    {
      slug: "jacob-flees-laban",
      title: "Jakob blir rik och flyr från Laban",
      startRef: "Genesis 30:25", endRef: "Genesis 31:55",
      orderInBook: 18,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 5,
      characterSlugs: ["jacob", "laban", "rachel"],
      themeSlugs: ["deception", "chaos-order"],
    },
    {
      slug: "jacob-wrestling",
      title: "Jakob brottas med Gud",
      startRef: "Genesis 32:22", endRef: "Genesis 32:32",
      orderInBook: 19,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 6,
      characterSlugs: ["jacob", "esau"],
      themeSlugs: ["testing-of-faith"],
    },
    {
      // NY 2026-08-27: Jakob-cykelns försoningsavslut — löser upp
      // spänningen som såtts redan i "Jakob köper Esaus förstfödslorätt"
      // och "Jakob lurar till sig Isaks välsignelse".
      slug: "jacob-and-esau-reconciled",
      title: "Jakob och Esau försonas",
      startRef: "Genesis 33:1", endRef: "Genesis 33:20",
      orderInBook: 20,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 7,
      characterSlugs: ["jacob", "esau"],
      themeSlugs: ["sibling-rivalry"],
    },
    {
      // NY 2026-08-27: direkt efterfrågad av användaren ("känsligt
      // innehåll" men relevant, se README Fas 44). Avslutar Jakob-cykeln —
      // sker kronologiskt direkt efter försoningen med Esau (kap. 33) och
      // innan Josef-berättelsen inleds (kap. 37).
      slug: "dinah",
      title: "Dina och Sikem",
      startRef: "Genesis 34:1", endRef: "Genesis 34:31",
      orderInBook: 21,
      seriesSlug: "jacob", seriesTitle: "Jakob-cykeln", seriesOrder: 8,
      characterSlugs: ["jacob", "dinah"],
      themeSlugs: ["chaos-order", "deception"],
    },
    {
      slug: "joseph-and-his-brothers",
      title: "Josef och hans bröder",
      startRef: "Genesis 37:1", endRef: "Genesis 45:28",
      orderInBook: 22,
      characterSlugs: ["joseph", "jacob", "judah"],
      themeSlugs: ["sibling-rivalry", "sacrifice"],
    },
    {
      // NY 2026-08-27: direkt efterfrågad av användaren, se README Fas 44.
      // Kronologiskt ett sidospår mitt i Josef-berättelsen (avbryter kap.
      // 37 och 39) — indexerad som egen story eftersom den har en egen,
      // avslutad handling (och för att kunna sätta egna karaktärer/teman).
      slug: "judah-and-tamar",
      title: "Juda och Tamar",
      startRef: "Genesis 38:1", endRef: "Genesis 38:30",
      orderInBook: 23,
      characterSlugs: ["judah", "tamar"],
      themeSlugs: ["deception"],
    },
    {
      // Avslutar Första Moseboken: familjen flyttar till Egypten, Jakob
      // välsignar sina söner (den poetiska "stams-profetian" i kap. 49)
      // och dör, och till sist dör även Josef. Peterson gjorde aldrig ett
      // avsnitt om det här — hans Bibelserie slutade vid Josefs kappa
      // (ep. 15) — men texten läggs ändå in för att göra Genesis komplett.
      slug: "jacob-in-egypt-and-death",
      title: "Jakob i Egypten — välsignelsen och döden",
      startRef: "Genesis 46:1", endRef: "Genesis 50:26",
      orderInBook: 24,
      characterSlugs: ["jacob", "joseph"],
      themeSlugs: ["covenant"],
    },
  ];

  for (const s of stories) {
    // OBS: `update` måste faktiskt sätta samma fält som `create` — annars
    // no-opar upsert på redan seedade rader, vilket tidigare gjorde att
    // omordning av en berättelsecykel (t.ex. seriesOrder/orderInBook) inte
    // slog igenom på existerande rader (bara på nyskapade). Upptäckt och
    // fixat 2026-08-23 när Jakob-cykeln fick två nya avsnitt insorterade.
    const storyData = {
      title: s.title,
      startRef: s.startRef,
      endRef: s.endRef,
      orderInBook: s.orderInBook,
      seriesSlug: s.seriesSlug,
      seriesTitle: s.seriesTitle,
      seriesOrder: s.seriesOrder,
    };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: genesis.id, slug: s.slug } },
      update: storyData,
      create: { bookId: genesis.id, slug: s.slug, ...storyData },
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
    // Sant för set som delar EN story-mapp med andra set (t.ex. Josefs tre
    // bildset i samma mapp) — då döptes filerna om till sitt ORDER-nummer
    // vid nedladdning (se download-images.sh) för att undvika kollision,
    // så path måste också bygga på `order`, inte råa `fileNum`. Falskt
    // (default) för set som ligger ensamma i sin mapp under sina
    // ursprungliga filnummer (inkl. FB_RG_Lot, som medvetet laddades ner
    // en gång per story-mapp under originalnumrering).
    renamedToOrder?: boolean;
  }> = [
    { storySlug: "creation", code: "FB_LS_Creation_Days", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-creation-days/" },
    { storySlug: "garden-of-eden", code: "FB_FN_Adam_Eve", fileStart: 1, fileEnd: 11, orderStart: 1, credit: "Fishnet Bible Stories (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/fn-adam-eve/" },
    { storySlug: "cain-and-abel", code: "FB_LS_Cain_Abel", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-cain-abel/" },
    { storySlug: "cain-and-abel", code: "FB_LS_Cain_Anger", fileStart: 1, fileEnd: 9, orderStart: 10, renamedToOrder: true, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-cain-anger/" },
    { storySlug: "noahs-flood", code: "FB_LS_Noah_Ark", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-noah-ark/" },
    { storySlug: "tower-of-babel", code: "FB_LS_Tower_Babel", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-tower-babel/" },
    { storySlug: "call-of-abram", code: "FB_RP_Abraham_Calling", fileStart: 1, fileEnd: 21, orderStart: 1, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rp-abraham-calling/" },
    // FB_RG_Lot delas mellan två stories (Gen 13 vs. Gen 19) via filnummerintervall.
    { storySlug: "abraham-and-lot", code: "FB_RG_Lot", fileStart: 1, fileEnd: 3, orderStart: 1, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-lot/" },
    { storySlug: "sodom-and-gomorrah", code: "FB_RG_Lot", fileStart: 4, fileEnd: 9, orderStart: 1, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-lot/" },
    { storySlug: "covenant-with-abram", code: "FB_LS_Abram", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-abram/" },
    { storySlug: "hagar-and-ishmael", code: "FB_Hagar_Ishmael", fileStart: 1, fileEnd: 10, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/hagar-ishmael/" },
    { storySlug: "isaac-born-and-ishmael-sent-away", code: "FB_LS_Hagar_Ishmael", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-hagar-ishmael/" },
    { storySlug: "binding-of-isaac", code: "FB_LS_Abraham_Isaac", fileStart: 1, fileEnd: 10, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-abraham-isaac/" },
    { storySlug: "rebekah-at-the-well", code: "FB_LS_Isaac_Bride", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-isaac-bride/" },
    { storySlug: "jacob-buys-birthright", code: "FB_LS_Jacob_Esau", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-jacob-esau/" },
    { storySlug: "jacob-steals-blessing", code: "FB_Jacob_Deceives", fileStart: 1, fileEnd: 13, orderStart: 1, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/jacob-deceives/" },
    { storySlug: "jacobs-ladder", code: "FB_LS_Jacob_Ladder", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jacob-ladder/" },
    { storySlug: "jacob-serves-laban-for-rachel-and-leah", code: "FB_Jacob_Wedding", fileStart: 1, fileEnd: 14, orderStart: 1, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/jacob-wedding/" },
    { storySlug: "jacob-flees-laban", code: "FB_Jacob_Returns", fileStart: 1, fileEnd: 16, orderStart: 1, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/jacob-returns/" },
    { storySlug: "jacob-wrestling", code: "FB_LS_Jacob_Israel", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jacob-israel/" },
    { storySlug: "jacob-and-esau-reconciled", code: "FB_LS_Jacob_Esau_Forgive", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jacob-esau-forgive/" },
    { storySlug: "joseph-and-his-brothers", code: "FB_LS_Joseph_Dreams", fileStart: 1, fileEnd: 9, orderStart: 1, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-joseph-dreams/" },
    { storySlug: "joseph-and-his-brothers", code: "FB_LS_Joseph_Coat", fileStart: 1, fileEnd: 10, orderStart: 10, renamedToOrder: true, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-joseph-coat/" },
    { storySlug: "joseph-and-his-brothers", code: "FB_LS_Joseph_Brothers", fileStart: 1, fileEnd: 9, orderStart: 20, renamedToOrder: true, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-joseph-brothers/" },
    // Gen 46–50: Jakob flyttar till Egypten, familjeåterförening, Jakobs
    // välsignelse av sina söner och bådas död. Peterson gjorde aldrig
    // fler avsnitt efter "Joseph and the Coat of Many Colors" (ep. 15 var
    // seriens sista) så ingen video täcker det här — se README.
    { storySlug: "jacob-in-egypt-and-death", code: "FB_Joseph_Jacob", fileStart: 1, fileEnd: 19, orderStart: 1, credit: "FreeBibleimages.org, CC BY-SA 4.0", creditUrl: "https://www.freebibleimages.org/photos/joseph-jacob/" },
  ];

  for (const set of storyImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: genesis.id, slug: set.storySlug } });
    for (let fileNum = set.fileStart; fileNum <= set.fileEnd; fileNum++) {
      const order = set.orderStart + (fileNum - set.fileStart);
      // Filen ligger fysiskt kvar under sitt UR-SPRUNGLIGA filnummer i
      // story-mappen (så vi slapp ladda ner FB_RG_Lot två gånger) — path
      // pekar därför på fileNum, medan `order` är visningsordningen. Om
      // setet delar mapp med andra set (renamedToOrder) döptes filerna
      // om vid nedladdning, så path bygger då på `order` istället.
      const fileLabel = set.renamedToOrder ? order : fileNum;
      const path = `/images/genesis/${set.storySlug}/${String(fileLabel).padStart(2, "0")}.jpg`;
      const rawCaption = captions[set.code]?.[fileNum - 1];
      const caption = isJunkCaption(rawCaption) ? null : rawCaption;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  // --- Skapelsen: jordklotet från rymden (Wikimedia Commons) ----------
  // FreeBibleimages-setet för Skapelsen är bara enkla dag-för-dag-ikoner
  // (inget som visar själva jorden), så efterfrågad av användaren direkt
  // 2026-08-23: ett riktigt foto av jorden som omslagsbild. "The Blue
  // Marble" (Apollo 17, 1972) — NASA-material, public domain i USA.
  const creationStory = await prisma.story.findFirstOrThrow({ where: { bookId: genesis.id, slug: "creation" } });
  await prisma.storyImage.upsert({
    where: { storyId_order: { storyId: creationStory.id, order: 9 } },
    update: {
      path: "/images/genesis/creation/09.jpg",
      caption: "Jorden fotograferad från rymden (\"The Blue Marble\", Apollo 17, 1972) — inte en bild från själva bibelberättelsen, men vald som omslag för att direkt visa vad kapitlet handlar om.",
      credit: "NASA/Apollo 17 (Wikimedia Commons), public domain",
      creditUrl: "https://commons.wikimedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
    },
    create: {
      storyId: creationStory.id, order: 9,
      path: "/images/genesis/creation/09.jpg",
      caption: "Jorden fotograferad från rymden (\"The Blue Marble\", Apollo 17, 1972) — inte en bild från själva bibelberättelsen, men vald som omslag för att direkt visa vad kapitlet handlar om.",
      credit: "NASA/Apollo 17 (Wikimedia Commons), public domain",
      creditUrl: "https://commons.wikimedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
    },
  });

  // --- Omslagsbilder (thumbnailOrder) ---------------------------------
  // Många källset börjar med en abstrakt, enfärgad "titelkort"-siluett
  // (t.ex. ett gult moln med en svart figur) som är okej längre in i ett
  // bildgalleri men ser intetsägande ut som litet omslag i boklistan.
  // Bytt 2026-08-23 efter direkt feedback från användaren, som ville ha
  // omslag som "direkt gör att man minns berättelsen" — plockade istället
  // en mer detaljerad/färgstark bild längre in i samma redan nedladdade
  // bildset (ingen ny research, bara genomläsning av befintliga bilder).
  const genesisThumbnails: Record<string, number> = {
    creation: 9, // jordklotet, se ovan
    "cain-and-abel": 13, // Kains vrede vid altaret
    "noahs-flood": 5, // arken i vågorna
    "tower-of-babel": 3, // själva tornet syns i bakgrunden
    "jacob-wrestling": 7, // familjeåterförening (inget i setet visar själva brottningen)
    "hagar-and-ishmael": 4, // Hagar ensam vid källan i öknen
    "isaac-born-and-ishmael-sent-away": 4, // Hagar och Ismael vandrar oroligt ut i öknen
    "rebekah-at-the-well": 5, // Rebecka möter tjänaren vid brunnen
    "jacob-and-esau-reconciled": 8, // familjeåterförening och försoning
  };
  for (const [slug, order] of Object.entries(genesisThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: genesis.id, slug }, data: { thumbnailOrder: order } });
  }

  // --- Karaktärsporträtt -------------------------------------------
  // Arkivet erbjuder scenbilder, inga fristående porträtt — återanvänder
  // därför en lämplig bild ur en story där karaktären är central och
  // faktiskt syns (valda genom att läsa scenbeskrivningarna ovan, inte
  // bara "bild nr. 1" rakt av). `esau` fick tidigare ingen bild (inget
  // set täckte honom då) — löst 2026-08-23 genom att lägga till
  // birthright/välsignelse-berättelserna, som visar honom tydligt.
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
    { slug: "esau", storySlug: "jacob-buys-birthright", imgOrder: 2 },
    { slug: "rebekah", storySlug: "jacob-steals-blessing", imgOrder: 3 },
    { slug: "rachel", storySlug: "jacob-serves-laban-for-rachel-and-leah", imgOrder: 4 },
    { slug: "leah", storySlug: "jacob-serves-laban-for-rachel-and-leah", imgOrder: 9 },
    { slug: "laban", storySlug: "jacob-serves-laban-for-rachel-and-leah", imgOrder: 5 },
    { slug: "hagar", storySlug: "hagar-and-ishmael", imgOrder: 4 },
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
        {
          chapter: 1,
          verse: 3,
          order: 2,
          quote:
            "It's perfectly reasonable from an archetypal and " +
            "psychological perspective to consider the idea of the word " +
            "equivalent to the spoken truth.",
          summary:
            "I en Q&A-diskussion om 'Gud sade... och det blev' kopplar " +
            "Peterson ordet/Logos till sanning: om tillvaron i grunden är " +
            "god, måste ett ärligt förhållande till den också vara gott — " +
            "och då blir sant tal (att 'tala fram' något genom sanning, " +
            "inte manipulation) det som gör skapelsen god. Hänvisar till " +
            "Kierkegaard som den som brottades djupast med den idén.",
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
        "inspiration. Föreläsningen som helhet går även djupt in på " +
        "'den murade trädgården' som symbol för kultur/natur i balans " +
        "och på ormens dubbeltydiga roll — se versnoteringarna nedan " +
        "(2026-08-24, tillagt efter direkt fråga från användaren om mer " +
        "material kring Eden/ormen från denna redan nedladdade föreläsning).",
      quote: "The breath is life, right? That's psyche, that's spirit, that's inspiration.",
      verseNotes: [
        {
          chapter: 2,
          verse: 8,
          order: 1,
          quote: "The wall is culture and order, and the garden is nature.",
          summary:
            "'Paradis' kommer av ett persiskt ord för 'murad trädgård' — " +
            "muren är kultur/ordning, trädgården är natur, och tanken är " +
            "att människans rätta habitat är natur och kultur i balans, " +
            "inte det ena utan det andra (en ren vildmark är lika " +
            "livsfientlig som en ren betongöken). Avvisar uttryckligen " +
            "tolkningen att uppmaningen att 'råda över jorden' legitimerar " +
            "rovdrift — pekar istället på att människans roll uttryckligen " +
            "beskrivs som att 'sköta trädgården', dvs. aktivt förvalta så " +
            "att både natur och människor frodas. Nämner i förbigående att " +
            "'Eden' betyder 'välvattnad plats' — särskilt begripligt för " +
            "en ökenbefolkning.",
        },
        {
          chapter: 2,
          verse: 25,
          order: 2,
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
          verse: 1,
          order: 3,
          quote:
            "Subtle... crafty, cunning, sly, treacherous — it's something " +
            "that sort of sneaks along, something you don't really pick " +
            "up on that easily.",
          summary:
            "Gör en ordstudie av 'listig'/'subtle' (via Oxford English " +
            "Dictionary, i Jungiansk dröm-tolkningsstil — undersöka ett " +
            "ords alla bibetydelser) för att visa hur precist ordvalet " +
            "speglar ormens natur. Berör också en gnostisk läsart där " +
            "ormen (som lockar till medvetenhet) tolkas som en HÖGRE gud " +
            "än den ursprungliga, medvetet omedvetna skaparguden — en idé " +
            "som rensades bort ur klassisk kristendom men lämnat spår " +
            "kvar (bl.a. i tanken att syndafallet, hur tragiskt det än " +
            "var, var förutsättningen för Kristi födelse). Tillägger att " +
            "ormens koppling till Satan INTE är given i själva Adam och " +
            "Eva-texten (ingenting säger uttryckligen att ormen som " +
            "frestar Eva är 'ondskans upphovsman') — kallar sammanflätningen " +
            "av de två berättelserna 'lysande', och hänvisar till Gustave " +
            "Dorés etsningar till Miltons Paradise Lost.",
        },
        {
          chapter: 3,
          verse: 7,
          order: 4,
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
      storySlug: "jacob-buys-birthright",
      youtubeId: "A9JtQN_GoVI",
      startSec: 56 * 60 + 5,
      keyPoints:
        "Läser hur Jakob (mammas gosse, tältboende) utnyttjar att Esau " +
        "(pappas favorit, tuff jägare) kommer hem utsvulten från jakten, " +
        "och kräver hans förstfödslorätt i utbyte mot en skål linssoppa — " +
        "beskriver det som en 'omvänd uppoffring': att offra framtiden för " +
        "nuets begär, motsatsen till vad en sund uppoffring är.",
      quote:
        "Don't sell the future for the desires of the present, and don't " +
        "be casual about what you have.",
      verseNotes: [
        {
          chapter: 25,
          verse: 34,
          order: 1,
          quote:
            "It's sort of the opposite of a sacrifice, it's the reverse — " +
            "he sacrifices the future for the present.",
          summary:
            "Läser Esaus förstfödslorätts-försäljning som en 'omvänd " +
            "uppoffring': istället för att offra något i nuet för en bättre " +
            "framtid (den sunda modellen från t.ex. Kain och Abel) offrar " +
            "Esau framtiden för ett omedelbart begär — vilket enligt " +
            "Peterson utesluter möjligheten att förverkliga sin fulla " +
            "potential.",
        },
      ],
    },
    {
      storySlug: "jacob-steals-blessing",
      youtubeId: "A9JtQN_GoVI",
      startSec: 65 * 60 + 55,
      keyPoints:
        "Läser hur Rebecka och Jakob i detalj lurar den nästan blinde Isak " +
        "att välsigna Jakob istället för Esau (getskinn för att kännas " +
        "hårig, Esaus kläder för lukten) — kallar det 'major-league " +
        "betrayals' och lägger huvudansvaret hos Jakob, inte hos den lurade " +
        "Esau.",
      quote:
        "These are major-league betrayals that he's engaging in, and it's " +
        "not trivial — it's very treacherous behavior what he's doing.",
      verseNotes: [
        {
          chapter: 27,
          verse: 34,
          order: 1,
          quote:
            "The fact that this reduces him to tears is an indication of " +
            "the magnitude of the betrayal.",
          summary:
            "Påpekar att Esau, som annars framställs som en tuff, " +
            "självständig jägare, brister ut i gråt när han inser vad som " +
            "hänt — vilket Peterson läser som ett mått på hur allvarligt " +
            "sveket faktiskt var, inte som en svaghet hos Esau.",
        },
        {
          chapter: 27,
          verse: 41,
          order: 2,
          quote:
            "Dante put betrayal in the lowest part of hell — right beside " +
            "Satan himself.",
          summary:
            "Kopplar Esaus mordplan mot Jakob till Dantes Inferno, där " +
            "förräderi placeras som det värsta av alla brott — längst ner " +
            "i helvetet, näst intill Satan själv — som ett sätt att " +
            "förklara hur allvarligt Jakobs dubbla svek (förstfödslorätten " +
            "OCH välsignelsen) faktiskt var.",
        },
      ],
    },
    {
      storySlug: "jacob-serves-laban-for-rachel-and-leah",
      youtubeId: "DRJKwDfDbco",
      startSec: 56 * 60 + 52,
      keyPoints:
        "Läser hur Jakob (som lurade Esau) själv blir lurad av sin morbror " +
        "Laban — arbetar sju år för att få gifta sig med Rakel men blir " +
        "istället gift med hennes äldre syster Lea — och läser det som en " +
        "poetisk rättvisa/karma-mekanism: 'ingen ogärning går ostraffad'.",
      quote:
        "No bad deed goes unpunished — that's how things work, unless " +
        "you're a psychopath.",
      verseNotes: [
        {
          chapter: 29,
          verse: 25,
          order: 1,
          quote:
            "This is an inversion, because he's in the dark like Isaac was " +
            "when he fooled Isaac — so now it's Jacob's turn to be in the " +
            "dark.",
          summary:
            "Pekar på den symmetriska ironin: precis som Jakob lurade sin " +
            "blinde far Isak genom förklädnad, blir han själv lurad genom " +
            "att bruden är beslöjad/dold i mörkret — samma sorts bedrägeri " +
            "kommer tillbaka till honom.",
        },
        {
          chapter: 29,
          verse: 35,
          order: 2,
          quote:
            "It's from the tribe of Judah that Christ arises — Judah is " +
            "essentially promoted to the status of firstborn later in the " +
            "story.",
          summary:
            "Förklarar varför just Juda (Leas fjärde son) namnges särskilt " +
            "noga: eftersom Ruben, Simeon och Levi senare gör sig " +
            "skyldiga till allvarliga fel blir Juda i praktiken upphöjd " +
            "till förstfödslo-status — och det är från Judas stam som " +
            "(enligt kristen tolkningstradition) Kristus härstammar.",
        },
      ],
    },
    {
      storySlug: "jacob-flees-laban",
      youtubeId: "DRJKwDfDbco",
      startSec: 67 * 60 + 47,
      keyPoints:
        "Läser hur Jakob genom 'sympatisk magi' (spräckliga grenar framför " +
        "parande djur) blir förmögen på Labans bekostnad, flyr med sina " +
        "fruar när Labans söner blir avundsjuka, och hur Rakel stjäl sin " +
        "fars husgudar — innan Jakob och Laban till slut sluter fred och " +
        "reser en stenhög som vittne om överenskommelsen.",
      quote:
        "It's sort of like the karmic debt is being paid — he got " +
        "punished for his wrongdoing, and that's good enough as far as " +
        "he's concerned.",
      verseNotes: [
        {
          chapter: 31,
          verse: 19,
          order: 1,
          quote:
            "It's not exactly obvious why — it sounds to me mostly like a " +
            "little act of revenge, maybe with a bit of loneliness mixed " +
            "in.",
          summary:
            "Går igenom flera tolkningar av varför Rakel stjäl sin fars " +
            "husgudar (hämnd, saknad efter hemmet, eller att omöjliggöra " +
            "att Laban använder dem för att spå upp deras flyktväg) utan " +
            "att slå fast en enda förklaring — texten lämnar det medvetet " +
            "tvetydigt.",
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
    { slug: "andreas", name: "Andreas" },
    { slug: "jakob-apostel", name: "Jakob (Sebedeus son)" },
    { slug: "johannes-apostel", name: "Johannes (aposteln)" },
    // Samma slug som i Exodus-avsnittet — upsert med matchande slug
    // returnerar/uppdaterar bara samma rad, så Mose länkas ihop över
    // böcker (han dyker upp igen på förklaringsberget). "mose" hinner
    // inte deklareras i exCharacters än här i filen (Exodus seedas efter
    // Matteus), därför läggs den till separat på nytt här.
    { slug: "mose", name: "Mose" },
    { slug: "elia", name: "Elia" },
    { slug: "sackeus", name: "Sackeus" },
    // NY 2026-08-25. OBS namnkollision undviken medvetet: detta är Maria
    // FRÅN BETANIA (Martas syster), en annan person än "maria" ovan
    // (Jesu mor) — separat slug så de inte blandas ihop i indexet.
    { slug: "maria-av-betania", name: "Maria från Betania" },
    { slug: "marta", name: "Marta" },
    // Samma återknytningsmönster som Mose/Elia — Abraham dyker upp igen
    // som karaktär i Jesu liknelse, samma Character-rad som i Genesis.
    { slug: "abraham", name: "Abraham" },
    // NY 2026-08-27: en av de två lärjungarna på vägen till Emmaus,
    // uttryckligen namngiven i Luk. 24:18 (den andre förblir onämnd).
    { slug: "kleopas", name: "Kleopas" },
    // NY 2026-08-27, se README Fas 54: ärkeängeln som bebådar Jesu
    // födelse för Maria.
    { slug: "gabriel", name: "Gabriel" },
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
    { slug: "forgiveness", name: "Förlåtelse" },
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
      // NY 2026-08-23: fyller luckan mellan frestelsen och Bergspredikan.
      slug: "calling-of-first-disciples", title: "Jesus kallar sina första lärjungar",
      startRef: "Matthew 4:18", endRef: "Matthew 4:22", orderInBook: 4,
      characterSlugs: ["jesus", "petrus", "andreas", "jakob-apostel", "johannes-apostel"], themeSlugs: [],
    },
    {
      slug: "sermon-on-the-mount", title: "Bergspredikan (saligprisningarna)",
      startRef: "Matthew 5:1", endRef: "Matthew 5:12", orderInBook: 5,
      characterSlugs: ["jesus"], themeSlugs: ["kingdom-of-god"],
    },
    {
      slug: "calming-the-storm", title: "Jesus stillar stormen",
      startRef: "Matthew 8:18", endRef: "Matthew 8:27", orderInBook: 6,
      characterSlugs: ["jesus"], themeSlugs: ["chaos-order"],
    },
    {
      slug: "parable-of-the-sower", title: "Liknelsen om såningsmannen",
      startRef: "Matthew 13:1", endRef: "Matthew 13:23", orderInBook: 7,
      characterSlugs: ["jesus"], themeSlugs: [],
    },
    {
      // NY 2026-08-24: samma kapitel som såningsmannen, direkt efter.
      slug: "wheat-and-tares", title: "Liknelsen om vetet och ogräset",
      startRef: "Matthew 13:24", endRef: "Matthew 13:30", orderInBook: 8,
      characterSlugs: ["jesus"], themeSlugs: ["chaos-order"],
    },
    {
      // NY 2026-08-23: ett av de mest kända undren, tidigare inte med.
      slug: "feeding-the-5000", title: "Bespisningen av de fem tusen",
      startRef: "Matthew 14:13", endRef: "Matthew 14:21", orderInBook: 9,
      characterSlugs: ["jesus"], themeSlugs: ["compassion"],
    },
    {
      // NY 2026-08-23: direkt efterföljande scen i samma kapitel.
      slug: "walking-on-water", title: "Jesus går på vattnet",
      startRef: "Matthew 14:22", endRef: "Matthew 14:33", orderInBook: 10,
      characterSlugs: ["jesus", "petrus"], themeSlugs: ["testing-of-faith"],
    },
    {
      // NY 2026-08-24: föregår förklaringen på berget kronologiskt med
      // bara sex dagar (17:1) — Petrus första stora trosbekännelse.
      slug: "peters-confession", title: "Petrus bekännelse",
      startRef: "Matthew 16:13", endRef: "Matthew 16:20", orderInBook: 11,
      characterSlugs: ["jesus", "petrus"], themeSlugs: ["kingdom-of-god"],
    },
    {
      // NY 2026-08-23: teologisk vändpunkt (Petrus bekännelse följs
      // direkt av förklaringen på berget) — Mose och Elia återknyter
      // till samma Character-poster som i Exodus/framtida profetböcker.
      slug: "transfiguration", title: "Förklaringen på berget",
      startRef: "Matthew 17:1", endRef: "Matthew 17:13", orderInBook: 12,
      characterSlugs: ["jesus", "petrus", "jakob-apostel", "johannes-apostel", "mose", "elia"], themeSlugs: ["kingdom-of-god"],
    },
    {
      slug: "triumphal-entry", title: "Intåget i Jerusalem",
      startRef: "Matthew 21:1", endRef: "Matthew 21:11", orderInBook: 13,
      characterSlugs: ["jesus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 1,
    },
    {
      // NY 2026-08-27: dagen efter intåget (traditionellt "annandag"
      // i Passionsveckans kronologi) — ett av Petersons favoritexempel
      // på rättfärdig vrede/att sätta gränser mot korruption som fått
      // gro under ordnens täckmantel.
      slug: "cleansing-of-the-temple", title: "Tempelrensningen",
      startRef: "Matthew 21:12", endRef: "Matthew 21:17", orderInBook: 14,
      characterSlugs: ["jesus"], themeSlugs: ["chaos-order"],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 2,
    },
    {
      // NY 2026-08-24: föregår punden-liknelsen direkt i samma kapitel.
      slug: "ten-virgins", title: "Liknelsen om de tio brudtärnorna",
      startRef: "Matthew 25:1", endRef: "Matthew 25:13", orderInBook: 15,
      characterSlugs: ["jesus"], themeSlugs: ["testing-of-faith"],
    },
    {
      // NY 2026-08-24: en av Petersons mest citerade liknelser i eget
      // författarskap ("do your best with what you've been given").
      slug: "parable-of-the-talents", title: "Liknelsen om de anförtrodda punden",
      startRef: "Matthew 25:14", endRef: "Matthew 25:30", orderInBook: 16,
      characterSlugs: ["jesus"], themeSlugs: [],
    },
    {
      // NY 2026-08-27: avslutar samma kapitels tre-delade liknelse-
      // trilogi (brudtärnorna/punden/fåren och getterna) — en av de mest
      // citerade texterna i kristen etik ("vad ni har gjort mot en av
      // dessa minsta...").
      slug: "sheep-and-the-goats", title: "Fåren och getterna",
      startRef: "Matthew 25:31", endRef: "Matthew 25:46", orderInBook: 17,
      characterSlugs: ["jesus"], themeSlugs: ["compassion"],
    },
    {
      slug: "last-supper", title: "Den sista måltiden",
      startRef: "Matthew 26:17", endRef: "Matthew 26:30", orderInBook: 18,
      characterSlugs: ["jesus", "judas", "petrus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 3,
    },
    {
      slug: "gethsemane", title: "Getsemane och tillfångatagandet",
      startRef: "Matthew 26:36", endRef: "Matthew 26:56", orderInBook: 19,
      characterSlugs: ["jesus", "judas", "petrus"], themeSlugs: ["betrayal"],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 4,
    },
    {
      // NY 2026-08-24: händer under själva rättegången (26:57 ff.), men
      // fick en egen story eftersom den psykologiskt är en helt egen
      // vändpunkt för Petrus — svaghet under press, inte förräderi.
      slug: "peters-denial", title: "Petrus förnekar Jesus",
      startRef: "Matthew 26:69", endRef: "Matthew 26:75", orderInBook: 20,
      characterSlugs: ["jesus", "petrus"], themeSlugs: ["self-consciousness"],
    },
    {
      slug: "trial-before-pilate", title: "Rättegången inför Pilatus",
      startRef: "Matthew 27:11", endRef: "Matthew 27:31", orderInBook: 21,
      characterSlugs: ["jesus", "pontius-pilatus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 5,
    },
    {
      slug: "crucifixion", title: "Korsfästelsen",
      startRef: "Matthew 27:32", endRef: "Matthew 27:44", orderInBook: 22,
      characterSlugs: ["jesus"], themeSlugs: ["sacrifice"],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 6,
    },
    {
      slug: "death-and-burial", title: "Jesu död och begravning",
      startRef: "Matthew 27:45", endRef: "Matthew 27:66", orderInBook: 23,
      characterSlugs: ["jesus", "maria-magdalena"], themeSlugs: ["sacrifice"],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 7,
    },
    {
      slug: "resurrection", title: "Uppståndelsen",
      startRef: "Matthew 28:1", endRef: "Matthew 28:20", orderInBook: 24,
      characterSlugs: ["jesus", "maria-magdalena", "petrus"], themeSlugs: [],
      seriesSlug: "passion-week", seriesTitle: "Passionsveckan", seriesOrder: 8,
    },
  ];

  for (const s of ntStories) {
    // Se motsvarande OBS-kommentar vid Genesis story-loopen ovan — `update`
    // måste spegla `create`, annars no-opar upsert på existerande rader.
    const ntStoryData = {
      title: s.title,
      startRef: s.startRef,
      endRef: s.endRef,
      orderInBook: s.orderInBook,
      seriesSlug: s.seriesSlug,
      seriesTitle: s.seriesTitle,
      seriesOrder: s.seriesOrder,
    };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: matthew.id, slug: s.slug } },
      update: ntStoryData,
      create: { bookId: matthew.id, slug: s.slug, ...ntStoryData },
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
    { storySlug: "cleansing-of-the-temple", code: "FB_Jesus_Cleansing_Temple", count: 7, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/jesus-cleansing-temple/" },
    // "sheep-and-the-goats" (25:31-46) har medvetet INGA bilder — se
    // kommentaren om "Sheep and goats" ovan vid Fas 24 (2026-08-24):
    // sökt igenom flera gånger, alla hittade bildset hade "A.I.
    // adaptations prohibited". Snarare textbaserad än fel bildkälla.
    { storySlug: "last-supper", code: "FB_LS_Last_Supper", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-last-supper/" },
    { storySlug: "gethsemane", code: "FB_LS_Jesus_Gethsemane", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jesus-gethsemane/" },
    { storySlug: "trial-before-pilate", code: "FB_LS_Pontius_Pilate", count: 11, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-pontius-pilate/" },
    { storySlug: "crucifixion", code: "FB_GNPI_096_Jesus_Crucifixion", count: 11, credit: "Good News Productions Int. (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/gnpi-096-jesus-crucifixion/" },
    { storySlug: "death-and-burial", code: "FB_GNPI_098_Jesus_Dies", count: 11, credit: "Good News Productions Int. (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/gnpi-098-jesus-dies/" },
    { storySlug: "resurrection", code: "FB_LS_Jesus_Alive_2", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jesus-alive-2/" },
    // NY 2026-08-23. OBS: Lumo Project-bildset avsiktligt UNDVIKNA här
    // (och för "calling-of-first-disciples" nedan) — deras licens
    // förbjuder uttryckligen "AI adaptations", till skillnad från övriga
    // set på FreeBibleimages.
    { storySlug: "calling-of-first-disciples", code: "FB_WDV_Four_Fishermen", count: 10, credit: "Willem de Vink – Jesus Messiah project (freebibleimages.org), CC BY-SA", creditUrl: "https://freebibleimages.org/illustrations/wdv-four-fishermen/" },
    { storySlug: "feeding-the-5000", code: "FB_LS_Boy_Lunch", count: 10, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-boy-lunch/" },
    { storySlug: "walking-on-water", code: "FB_LS_Peter_Water", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-peter-water/" },
    { storySlug: "transfiguration", code: "FB_Jesus_Transfiguration", count: 11, credit: "Sweet Publishing / freebibleimages.org, CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/jesus-transfiguration/" },
    // NY 2026-08-24. Samma försiktighet med licenser: flera bildset för
    // "Unforgiving servant" och "Sheep and goats" hittades men samtliga
    // hade explicit "A.I. adaptations prohibited" — utelämnade helt
    // hellre än att chansa. Peters bekännelse, vete/ogräs och punden
    // nedan är alla Lambsongs (samma CC BY-NC, AI-adaptationer tillåtna,
    // som redan används genomgående).
    { storySlug: "peters-confession", code: "FB_LS_Peter_Rock", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/rg-peter-rock/" },
    { storySlug: "wheat-and-tares", code: "FB_LS_Wheat_Tares", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-wheat-tares/" },
    { storySlug: "parable-of-the-talents", code: "FB_LS_Parable_Talents", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-parable-talents/" },
    // NY 2026-08-24. Sökte även efter Bergspredikans "Fader vår" (Matt
    // 6:9-13) men enda hittade setet (GNPI_036) hade "A.I. adaptations
    // prohibited" — utelämnat av samma skäl som Unforgiving
    // servant/Sheep-and-goats i förra fasen.
    { storySlug: "ten-virgins", code: "FB_RG_Wise_Foolish", count: 9, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-wise-foolish/" },
    { storySlug: "peters-denial", code: "FB_LS_Peter_Rooster", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-peter-rooster/" },
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

  // --- Omslagsbilder (thumbnailOrder) — se motsvarande kommentar i
  // Genesis-blocket ovan. Bytt 2026-08-23 efter direkt feedback. ---
  const matthewThumbnails: Record<string, number> = {
    "baptism-of-jesus": 5, // Jesus döps i vattnet
    "temptation-in-wilderness": 7, // frestelsen: utsikt över "alla rikena"
    "parable-of-the-sower": 7, // det goda sädet växer
    resurrection: 7, // Maria möter den uppståndne Jesus
    "last-supper": 8, // brödet bryts vid bordet
    gethsemane: 3, // Jesus ber ensam vid klippan
    "trial-before-pilate": 8, // Pilatus tvår sina händer
    crucifixion: 3, // korsfästelsen själv
    "calling-of-first-disciples": 7, // Petrus vid det fyllda nätet, inte bara vyn över Kapernaum
    "walking-on-water": 4, // Petrus går mot Jesus på vattnet
    transfiguration: 4, // Jesu strålande, förvandlade gestalt
    "peters-confession": 6, // gruppscenen där Petrus svarar Jesus
    "wheat-and-tares": 6, // färgstark vete/ogräs-närbild, inte silhuett-titelkortet
    "parable-of-the-talents": 4, // guldmynten på bordet
    "ten-virgins": 8, // de fem brudtärnorna med sina oljelampor
    "peters-denial": 6, // den tredje anklagelsen, dramatisk gruppscen
    "cleansing-of-the-temple": 3, // Jesus välter växlarnas bord med piskan i hand
  };
  for (const [slug, order] of Object.entries(matthewThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: matthew.id, slug }, data: { thumbnailOrder: order } });
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
  // Lukasevangeliet — tredje evangeliet, ny bok i Bibel-korpusen.
  // ======================================================================
  // Fokuserar på de tre mest kända Lukas-unika berättelserna som INTE
  // finns i Matteus alls: Den barmhärtige samariten, Den förlorade sonen,
  // Sackeus. Bilder: alla tre Lambsongs (samma CC BY-NC, AI-adaptationer
  // tillåtna, som redan används genomgående) — se README.
  const luke = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "luke" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "luke",
      name: "Lukasevangeliet",
      order: 4,
      testament: "new",
    },
  });

  type LukeStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const lukeStories: LukeStoryDef[] = [
    {
      // NY 2026-08-27, se README Fas 54: Fas 7 av 7 i planen (den enda
      // med "Ev."-förbehåll i din lista — men du bad mig fortsätta med
      // hela listan, så den räknas som bekräftad). Kronologiskt Lukas
      // allra första scen — måste därför in FÖRE julberättelsen, vilket
      // knuffar allt annat +1 i orderInBook.
      slug: "annunciation", title: "Gabriels bebådelse",
      startRef: "Luke 1:26", endRef: "Luke 1:38", orderInBook: 1,
      characterSlugs: ["jesus", "maria", "gabriel"], themeSlugs: ["covenant", "testing-of-faith"],
    },
    {
      // NY 2026-08-27: Lukas egen, mest ikoniska julberättelse (herdarna,
      // ängla­skaran, krubban) — skiljer sig helt från Matteus vinkel
      // (de vise männen) och läggs till som en egen berättelse trots att
      // Matteus redan har "Jesu födelse", eftersom det är en annan scen
      // med annan bildkälla och annat fokus.
      slug: "shepherds-and-the-birth-of-jesus", title: "Herdarna och Jesu födelse",
      startRef: "Luke 2:1", endRef: "Luke 2:20", orderInBook: 2,
      characterSlugs: ["jesus", "maria", "josef-ny"], themeSlugs: [],
    },
    {
      // NY 2026-08-27: den enda bevarade episoden ur Jesu barndom/
      // ungdom i något evangelium.
      slug: "jesus-in-the-temple-at-twelve", title: "Tolvårige Jesus i templet",
      startRef: "Luke 2:41", endRef: "Luke 2:52", orderInBook: 3,
      characterSlugs: ["jesus", "maria", "josef-ny"], themeSlugs: [],
    },
    {
      slug: "good-samaritan", title: "Den barmhärtige samariten",
      startRef: "Luke 10:25", endRef: "Luke 10:37", orderInBook: 4,
      characterSlugs: ["jesus"], themeSlugs: ["compassion"],
    },
    {
      // NY 2026-08-25: direkt efterföljande scen i samma kapitel.
      slug: "mary-and-martha", title: "Maria och Marta",
      startRef: "Luke 10:38", endRef: "Luke 10:42", orderInBook: 5,
      characterSlugs: ["jesus", "maria-av-betania", "marta"], themeSlugs: [],
    },
    {
      // NY 2026-08-25: samma "förlorat och återfunnet"-trilogi (15:1-32)
      // som förlorade sonen, de två kortare liknelserna direkt före den.
      slug: "lost-sheep-and-coin", title: "Det förlorade fåret och det förlorade myntet",
      startRef: "Luke 15:1", endRef: "Luke 15:10", orderInBook: 6,
      characterSlugs: ["jesus"], themeSlugs: ["forgiveness"],
    },
    {
      slug: "prodigal-son", title: "Liknelsen om den förlorade sonen",
      startRef: "Luke 15:11", endRef: "Luke 15:32", orderInBook: 7,
      characterSlugs: ["jesus"], themeSlugs: ["forgiveness"],
    },
    {
      // NY 2026-08-25: Abraham återknyter till samma Character-rad som
      // i Genesis.
      slug: "rich-man-and-lazarus", title: "Den rike mannen och Lasarus",
      startRef: "Luke 16:19", endRef: "Luke 16:31", orderInBook: 8,
      characterSlugs: ["jesus", "abraham"], themeSlugs: ["compassion"],
    },
    {
      // NY 2026-08-27: en av Petersons favoritteman — självbedrägeri och
      // falsk rättfärdighet kontra ärlig ödmjukhet.
      slug: "pharisee-and-tax-collector", title: "Liknelsen om fariséen och publikanen",
      startRef: "Luke 18:9", endRef: "Luke 18:14", orderInBook: 9,
      characterSlugs: ["jesus"], themeSlugs: ["self-consciousness"],
    },
    {
      slug: "zacchaeus", title: "Sackeus i trädet",
      startRef: "Luke 19:1", endRef: "Luke 19:10", orderInBook: 10,
      characterSlugs: ["jesus", "sackeus"], themeSlugs: ["forgiveness"],
    },
    {
      // NY 2026-08-27: en av Lukas mest älskade berättelser, unik för
      // detta evangelium — den uppståndne Jesus okänd tills brödet bryts.
      slug: "road-to-emmaus", title: "Vandringen till Emmaus",
      startRef: "Luke 24:13", endRef: "Luke 24:35", orderInBook: 11,
      characterSlugs: ["jesus", "kleopas"], themeSlugs: ["testing-of-faith"],
    },
  ];
  for (const s of lukeStories) {
    const lukeStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: luke.id, slug: s.slug } },
      update: lukeStoryData,
      create: { bookId: luke.id, slug: s.slug, ...lukeStoryData },
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

  const lukeCaptions = { ...lukeCaptionsByCode, ...annunciationCaptionsByCode } as Record<string, string[]>;
  const lukeImageSets: Array<{ storySlug: string; code: string; count: number; offset?: number; credit: string; creditUrl: string }> = [
    { storySlug: "good-samaritan", code: "FB_LS_Good_Samaritan", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-good-samaritan/" },
    { storySlug: "prodigal-son", code: "FB_LS_Lost_Son", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-lost-son/" },
    { storySlug: "zacchaeus", code: "FB_LS_Zacchaeus", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-zacchaeus/" },
    // NY 2026-08-25.
    { storySlug: "mary-and-martha", code: "FB_LS_Martha_Mary", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-martha-mary/" },
    // Två källset i EN story-mapp (fåret 15:1-7 följt av myntet 15:8-10),
    // samma offset-mönster som tidigare kombinerade set.
    { storySlug: "lost-sheep-and-coin", code: "FB_RG_Lost_Sheep", count: 9, offset: 0, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-lost-sheep/" },
    { storySlug: "lost-sheep-and-coin", code: "FB_LS_Lost_Coin", count: 12, offset: 9, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-lost-coin/" },
    { storySlug: "rich-man-and-lazarus", code: "FB_RichMan_Lazarus", count: 11, credit: "Arabs for Christ (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/rich-man-lazarus/" },
    { storySlug: "shepherds-and-the-birth-of-jesus", code: "FB_LS_Shepherds_Angels", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-shepherds-angels/" },
    { storySlug: "jesus-in-the-temple-at-twelve", code: "FB_LS_Lost_Temple", count: 8, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-lost-temple/" },
    { storySlug: "pharisee-and-tax-collector", code: "FB_Pharisee_TaxCollector", count: 6, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://freebibleimages.org/illustrations/pharisee-tax-collector/" },
    { storySlug: "road-to-emmaus", code: "FB_LS_Emmaus", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-emmaus/" },
    // NY 2026-08-27, se README Fas 54.
    { storySlug: "annunciation", code: "FB_LS_Mary_Angel", count: 9, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-mary-angel/" },
  ];
  for (const set of lukeImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: luke.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const order = (set.offset ?? 0) + fileNum;
      const path = `/images/luke/${set.storySlug}/${String(order).padStart(2, "0")}.jpg`;
      const caption = lukeCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const lukePortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "sackeus", storySlug: "zacchaeus", imgOrder: 4 },
    { slug: "maria-av-betania", storySlug: "mary-and-martha", imgOrder: 6 },
    { slug: "marta", storySlug: "mary-and-martha", imgOrder: 7 },
    { slug: "kleopas", storySlug: "road-to-emmaus", imgOrder: 7 },
  ];
  for (const p of lukePortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: luke.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const lukeThumbnails: Record<string, number> = {
    "good-samaritan": 7, // samariten hjälper den skadade mannen, inte bara vägen
    "prodigal-son": 8, // fadern springer glatt emot sonen
    zacchaeus: 4, // Sackeus uppe i trädet — berättelsens mest ikoniska bild
    "mary-and-martha": 7, // Martas konflikt med Jesus, kärnan i berättelsen
    "lost-sheep-and-coin": 8, // herden firar att han hittat det förlorade fåret
    "rich-man-and-lazarus": 6, // den rike mannen i plågan, Abraham och Lasarus i fjärran
    "shepherds-and-the-birth-of-jesus": 7, // Jesusbarnet i krubban
    "jesus-in-the-temple-at-twelve": 3, // pojken Jesus omgiven av de lärde i templet
    "pharisee-and-tax-collector": 5, // publikanen ber med sänkt blick
    "road-to-emmaus": 7, // brödet bryts — ögonblicket de känner igen Jesus
    annunciation: 4, // Gabriel talar till en förskräckt Maria
  };
  for (const [slug, order] of Object.entries(lukeThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: luke.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Lukasevangeliet: ${lukeStories.length} stories.`);

  // ======================================================================
  // Johannesevangeliet — fjärde evangeliet, ny bok i Bibel-korpusen.
  // ======================================================================
  // Helt fristående jämfört med de tre synoptiska evangelierna (Matteus/
  // Markus/Lukas) — ingen av dessa fem berättelser finns i Matteus eller
  // Lukas. Prologen (1:1-18, "I begynnelsen var Ordet") är medvetet
  // textbaserad UTAN bildgalleri — hittade inget bra scenbaserat bildset
  // för ett filosofiskt/teologiskt stycke (skiljer sig från de fyra
  // narrativa scenerna), men den är för tematiskt central (Logos-temat
  // som redan återkommer i appens Genesis- och Maps of Meaning-material,
  // se Jacques Derrida-referensen vid Skapelsen) för att utelämnas helt.
  const john = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "john" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "john",
      name: "Johannesevangeliet",
      order: 5,
      testament: "new",
    },
  });

  const johnCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "nikodemus", name: "Nikodemus" },
    { slug: "samariska-kvinnan", name: "Kvinnan vid Sykars brunn" },
    // Samma Character-rader som redan finns från Lukas — Maria från
    // Betania och Marta är systrar till Lasarus, återknyter över böcker.
    { slug: "maria-av-betania", name: "Maria från Betania" },
    { slug: "marta", name: "Marta" },
    { slug: "jesus", name: "Jesus" },
    // Egen slug (inte bara "lasarus") för att skilja från den namngivne
    // tiggaren i Jesu liknelse i Lukas 16 — olika personer, samma namn.
    { slug: "lasarus-fran-betania", name: "Lasarus från Betania" },
    // Samma Character-rader som i Matteus — johnCharacters är en egen
    // map, inte samma som ntCharacters, så de listas på nytt här.
    { slug: "petrus", name: "Petrus" },
    { slug: "judas", name: "Judas Iskariot" },
    { slug: "tomas", name: "Tomas" },
  ];
  const johnCharacters: Record<string, { id: string }> = {};
  for (const c of johnCharacterDefs) {
    johnCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type JohnStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const johnStories: JohnStoryDef[] = [
    {
      slug: "john-prologue", title: "I begynnelsen var Ordet",
      startRef: "John 1:1", endRef: "John 1:18", orderInBook: 1,
      characterSlugs: ["jesus"], themeSlugs: ["kingdom-of-god"],
    },
    {
      slug: "wedding-at-cana", title: "Bröllopet i Kana",
      startRef: "John 2:1", endRef: "John 2:11", orderInBook: 2,
      characterSlugs: ["jesus"], themeSlugs: [],
    },
    {
      slug: "nicodemus", title: "Nikodemus och den nya födelsen",
      startRef: "John 3:1", endRef: "John 3:21", orderInBook: 3,
      characterSlugs: ["jesus", "nikodemus"], themeSlugs: ["kingdom-of-god"],
    },
    {
      slug: "woman-at-the-well", title: "Kvinnan vid Sykars brunn",
      startRef: "John 4:1", endRef: "John 4:42", orderInBook: 4,
      characterSlugs: ["jesus", "samariska-kvinnan"], themeSlugs: ["compassion"],
    },
    {
      // NY 2026-08-27: en av evangeliernas mest citerade scener ("den
      // av eder som är utan synd...") — saknas i de äldsta handskrifterna
      // men ingår i 1917 års text liksom i de flesta traditionella biblar.
      slug: "woman-caught-in-adultery", title: "Kvinnan som ertappades med äktenskapsbrott",
      startRef: "John 8:1", endRef: "John 8:11", orderInBook: 5,
      characterSlugs: ["jesus"], themeSlugs: ["compassion", "self-consciousness"],
    },
    {
      // NY 2026-08-27: ett helt kapitel ägnas åt denna botade mannens
      // eskalerande förhör inför fariséerna — ovanligt utförligt även
      // för Johannes mått.
      slug: "man-born-blind", title: "Mannen som var född blind",
      startRef: "John 9:1", endRef: "John 9:41", orderInBook: 6,
      characterSlugs: ["jesus"], themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "lazarus-raised", title: "Lasarus uppväcks från de döda",
      startRef: "John 11:1", endRef: "John 11:44", orderInBook: 7,
      characterSlugs: ["jesus", "maria-av-betania", "marta", "lasarus-fran-betania"], themeSlugs: ["testing-of-faith"],
    },
    {
      // NY 2026-08-25.
      slug: "washing-of-feet", title: "Jesus tvättar lärjungarnas fötter",
      startRef: "John 13:1", endRef: "John 13:17", orderInBook: 8,
      characterSlugs: ["jesus", "petrus", "judas"], themeSlugs: [],
    },
    {
      // NY 2026-08-25.
      slug: "doubting-thomas", title: "Tomas som tvivlade",
      startRef: "John 20:19", endRef: "John 20:29", orderInBook: 9,
      characterSlugs: ["jesus", "tomas"], themeSlugs: ["testing-of-faith"],
    },
    {
      // NY 2026-08-27: Petrus upprättelse vid Galileiska sjön — svarar
      // direkt mot hans tredubbla förnekelse hos Matteus (26:69-75) med
      // en tredubbel bekräftelse, en av NT:s tydligaste "gottgörelse"-
      // berättelser.
      slug: "peter-restored", title: "Petrus upprättas",
      startRef: "John 21:1", endRef: "John 21:25", orderInBook: 10,
      characterSlugs: ["jesus", "petrus"], themeSlugs: ["forgiveness"],
    },
  ];
  for (const s of johnStories) {
    const johnStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: john.id, slug: s.slug } },
      update: johnStoryData,
      create: { bookId: john.id, slug: s.slug, ...johnStoryData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: johnCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: johnCharacters[charSlug].id },
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

  const johnCaptions = johnCaptionsByCode as Record<string, string[]>;
  const johnImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "wedding-at-cana", code: "FB_LS_Jesus_Wedding", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-jesus-wedding/" },
    { storySlug: "nicodemus", code: "FB_LS_Nicodemus", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-nicodemus/" },
    { storySlug: "woman-at-the-well", code: "FB_Jesus_Samaritan_Woman", count: 14, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/jesus-samaritan-woman/" },
    { storySlug: "lazarus-raised", code: "FB_LS_Lazarus", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-lazarus/" },
    // NY 2026-08-25.
    { storySlug: "washing-of-feet", code: "FB_LS_Washing_Feet", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-washing-feet/" },
    { storySlug: "doubting-thomas", code: "FB_LS_Thomas_Doubts", count: 9, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-thomas-doubts/" },
    // NY 2026-08-27. OBS: GNPI-bildseten för både "woman-adultery" och
    // "peter-restored" hittades men förbjuder uttryckligen AI-adaptioner
    // — Arabs for Christ-alternativ användes istället för båda.
    { storySlug: "woman-caught-in-adultery", code: "FB_Jesus_Question_Adultery", count: 10, credit: "Arabs for Christ (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/jesus-question-adultery/" },
    { storySlug: "man-born-blind", code: "FB_Blind_Man", count: 10, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/blind-man/" },
    { storySlug: "peter-restored", code: "FB_Peter_Reinstated", count: 16, credit: "Arabs for Christ (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/peter-reinstated/" },
    // ("john-prologue" har medvetet inget bildset, se kommentaren ovan.)
  ];
  for (const set of johnImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: john.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/john/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = johnCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const johnPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "nikodemus", storySlug: "nicodemus", imgOrder: 2 },
    { slug: "samariska-kvinnan", storySlug: "woman-at-the-well", imgOrder: 4 },
    { slug: "lasarus-fran-betania", storySlug: "lazarus-raised", imgOrder: 8 },
    { slug: "tomas", storySlug: "doubting-thomas", imgOrder: 5 },
  ];
  for (const p of johnPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: john.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const johnThumbnails: Record<string, number> = {
    "wedding-at-cana": 6, // vattnet blir vin — själva undret
    nicodemus: 2, // Nikodemus möte med Jesus, inte en okänslig titelbild
    "woman-at-the-well": 4, // Jesus och kvinnan vid brunnen, berättelsens kärna
    "lazarus-raised": 8, // Lasarus vid liv, insvept i bindlar, med Maria och Marta
    "washing-of-feet": 4, // Jesus tvättar en lärjunges fötter — själva kärnscenen
    "doubting-thomas": 5, // Jesus visar sina sårmärken, "rör vid mina händer"
    "woman-caught-in-adultery": 5, // Jesus böjer sig ner och skriver i sanden
    "man-born-blind": 2, // Jesus stryker lera på den blinde mannens ögon
    "peter-restored": 10, // Jesus och Petrus samtalar enskilt vid sjön
  };
  for (const [slug, order] of Object.entries(johnThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: john.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Johannesevangeliet: ${johnStories.length} stories.`);

  // ======================================================================
  // Markusevangeliet — sjätte boken, ny bok i Bibel-korpusen.
  // ======================================================================
  // Bara en första grund (3 berättelser) — snarare än att duplicera
  // synoptiskt material som redan finns via Matteus (bespisningen,
  // stormen, förklaringen ...), valdes tre berättelser som INTE finns
  // någon annanstans i appen än: Blinde Bartimaios, änkans två skärvar,
  // och den rike unge mannen. (Legion/den besatte mannen i Gerasa
  // hittades bara med en licens som uttryckligen förbjuder
  // "A.I. adaptations" — utelämnad, se README.)
  const mark = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "mark" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "mark",
      name: "Markusevangeliet",
      order: 6,
      testament: "new",
    },
  });

  const markCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "jesus", name: "Jesus" },
    { slug: "petrus", name: "Petrus" },
    { slug: "bartimaios", name: "Bartimaios" },
  ];
  const markCharacters: Record<string, { id: string }> = {};
  for (const c of markCharacterDefs) {
    markCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type MarkStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const markStories: MarkStoryDef[] = [
    {
      // NY 2026-08-27: unik för Markus (inget annat evangelium har den) —
      // det enda undret Jesus utför i två steg, ofta lyft fram (av bl.a.
      // Peterson-anhängare) som en bild för hur klarsyn/insikt ibland
      // kommer gradvis, inte på en gång.
      slug: "blind-man-at-bethsaida", title: "Den blinde mannen i Betsaida",
      startRef: "Mark 8:22", endRef: "Mark 8:26", orderInBook: 1,
      characterSlugs: ["jesus"], themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "rich-young-ruler", title: "Den rike unge mannen",
      startRef: "Mark 10:17", endRef: "Mark 10:31", orderInBook: 2,
      characterSlugs: ["jesus", "petrus"], themeSlugs: [],
    },
    {
      slug: "blind-bartimaeus", title: "Blinde Bartimaios",
      startRef: "Mark 10:46", endRef: "Mark 10:52", orderInBook: 3,
      characterSlugs: ["jesus", "bartimaios"], themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "widows-mite", title: "Änkans två skärvar",
      startRef: "Mark 12:41", endRef: "Mark 12:44", orderInBook: 4,
      characterSlugs: ["jesus"], themeSlugs: ["sacrifice"],
    },
  ];
  for (const s of markStories) {
    const markStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: mark.id, slug: s.slug } },
      update: markStoryData,
      create: { bookId: mark.id, slug: s.slug, ...markStoryData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: markCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: markCharacters[charSlug].id },
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

  const markCaptions = markCaptionsByCode as Record<string, string[]>;
  const markImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    // NY 2026-08-27. OBS: sökte även efter Legion/den besatte mannen i
    // Gerasa (Mark 5:1-20) och den döve/stumme mannen (Mark 7:31-37) —
    // enda hittade bildseten för båda var Lumo Project Films, som
    // uttryckligen förbjuder AI-adaptioner. Ingen Lambsongs/Sweet
    // Publishing/Richard Gunther-motsvarighet hittades för någon av dem,
    // så båda utelämnas (Legion redan noterat sedan Fas 33).
    { storySlug: "blind-man-at-bethsaida", code: "FB_RG_Blind_Man", count: 7, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-blind-man/" },
    { storySlug: "rich-young-ruler", code: "FB_Jesus_Rich_Man", count: 11, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/jesus-rich-man/" },
    { storySlug: "blind-bartimaeus", code: "FB_LS_Blind_Bartimaeus", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-blind-bartimaeus/" },
    { storySlug: "widows-mite", code: "FB_LS_Widow_Coins", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-widow-coins/" },
  ];
  for (const set of markImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: mark.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/mark/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = markCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const markPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    // Bild 8: Bartimaios med öppna ögon, botad och leende mot Jesus —
    // mer ikoniskt än en tidig bild där han fortfarande är blind.
    { slug: "bartimaios", storySlug: "blind-bartimaeus", imgOrder: 8 },
  ];
  for (const p of markPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: mark.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const markThumbnails: Record<string, number> = {
    "blind-man-at-bethsaida": 6, // mannen ser klart efter Jesu andra beröring.
    "rich-young-ruler": 2, // Rike mannen ansikte mot ansikte med Jesus.
    "blind-bartimaeus": 8, // Bartimaios botad, ser Jesus för första gången.
    "widows-mite": 5, // Änkan släpper sitt mynt i offerkistan.
  };
  for (const [slug, order] of Object.entries(markThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: mark.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Markusevangeliet: ${markStories.length} stories.`);

  // ======================================================================
  // Jona — sjunde boken, den första "mindre profeten" i korpusen. Kort
  // (4 kapitel) och mycket känd, så hela boken seedas i ett svep som
  // fyra sammanhängande berättelser (kallelse/flykt, fisken, Nineves
  // omvändelse, Jonas vrede) istället för utvalda utdrag.
  // ======================================================================
  const jonah = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "jonah" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "jonah",
      name: "Jona",
      order: 7,
      testament: "old",
    },
  });

  const jonahCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "jona", name: "Jona" },
    { slug: "konungen-i-nineve", name: "Konungen av Nineve" },
  ];
  const jonahCharacters: Record<string, { id: string }> = {};
  for (const c of jonahCharacterDefs) {
    jonahCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type JonahStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const jonahStories: JonahStoryDef[] = [
    {
      slug: "jonahs-calling-and-flight", title: "Jonas kallelse och flykt",
      startRef: "Jonah 1:1", endRef: "Jonah 1:16", orderInBook: 1,
      characterSlugs: ["jona"], themeSlugs: ["chaos-order", "testing-of-faith"],
    },
    {
      slug: "jonah-in-the-fish", title: "Jona i fiskens buk",
      startRef: "Jonah 2:1", endRef: "Jonah 2:11", orderInBook: 2,
      characterSlugs: ["jona"], themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "nineveh-repents", title: "Nineve omvänder sig",
      startRef: "Jonah 3:1", endRef: "Jonah 3:10", orderInBook: 3,
      characterSlugs: ["jona", "konungen-i-nineve"], themeSlugs: ["forgiveness", "compassion"],
    },
    {
      slug: "jonahs-anger-and-gods-lesson", title: "Jonas vrede och Guds lärdom",
      startRef: "Jonah 4:1", endRef: "Jonah 4:11", orderInBook: 4,
      characterSlugs: ["jona"], themeSlugs: ["forgiveness"],
    },
  ];
  for (const s of jonahStories) {
    const jonahStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: jonah.id, slug: s.slug } },
      update: jonahStoryData,
      create: { bookId: jonah.id, slug: s.slug, ...jonahStoryData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: jonahCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: jonahCharacters[charSlug].id },
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

  const jonahCaptions = jonahCaptionsByCode as Record<string, string[]>;
  // Ett enda bildset (FB_RG_Jonah, 26 bilder) täcker hela boken — delas
  // mellan de fyra berättelserna via fileStart/fileEnd/orderStart, precis
  // som t.ex. FB_RG_Lot delas mellan "abraham-and-lot" och
  // "sodom-and-gomorrah" i Genesis-avsnittet ovan.
  const jonahImageSets: Array<{ storySlug: string; code: string; fileStart: number; fileEnd: number; orderStart: number; credit: string; creditUrl: string }> = [
    { storySlug: "jonahs-calling-and-flight", code: "FB_RG_Jonah", fileStart: 1, fileEnd: 11, orderStart: 1, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-jonah/" },
    { storySlug: "jonah-in-the-fish", code: "FB_RG_Jonah", fileStart: 12, fileEnd: 15, orderStart: 12, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-jonah/" },
    { storySlug: "nineveh-repents", code: "FB_RG_Jonah", fileStart: 16, fileEnd: 18, orderStart: 16, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-jonah/" },
    { storySlug: "jonahs-anger-and-gods-lesson", code: "FB_RG_Jonah", fileStart: 19, fileEnd: 26, orderStart: 19, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-jonah/" },
  ];
  for (const set of jonahImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: jonah.id, slug: set.storySlug } });
    for (let fileNum = set.fileStart; fileNum <= set.fileEnd; fileNum++) {
      const order = set.orderStart + (fileNum - set.fileStart);
      // Bildfilerna ligger i story-mappen under sitt URSPRUNGLIGA
      // filnummer (samma laddades ner separat per story-mapp) — path
      // bygger alltså på fileNum, medan `order` är visningsordningen.
      const path = `/images/jonah/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = jonahCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const jonahPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    // Bild 16: Jona ser ut över Nineve — tydligt ansikte, mitt i sin roll
    // som motvillig profet.
    { slug: "jona", storySlug: "nineveh-repents", imgOrder: 16 },
  ];
  for (const p of jonahPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: jonah.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const jonahThumbnails: Record<string, number> = {
    "jonahs-calling-and-flight": 6, // Stormen — sjömännen i skräck.
    "jonah-in-the-fish": 13, // Den stora fisken sväljer Jona.
    "nineveh-repents": 16, // Jona ser ut över Nineve.
    "jonahs-anger-and-gods-lesson": 22, // Jona njuter av skuggan under plantan.
  };
  for (const [slug, order] of Object.entries(jonahThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: jonah.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Jona: ${jonahStories.length} stories.`);

  // ======================================================================
  // Rut — åttonde boken. Precis som Jona kort (4 kapitel) och mycket
  // känd, seedas hela boken i ett svep som fyra sammanhängande
  // berättelser. Tre bildset (Sweet Publishing, samma konstnärsstil
  // genom hela boken) delar upp kapitlen: Part1=kap 1, Part2=kap 2,
  // Part3=kap 3-4 (delas i sin tur mellan de två sista berättelserna).
  // ======================================================================
  const ruth = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "ruth" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "ruth",
      name: "Rut",
      order: 8,
      testament: "old",
    },
  });

  const ruthCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "rut", name: "Rut" },
    { slug: "noomi", name: "Noomi" },
    { slug: "boas", name: "Boas" },
  ];
  const ruthCharacters: Record<string, { id: string }> = {};
  for (const c of ruthCharacterDefs) {
    ruthCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type RuthStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const ruthStories: RuthStoryDef[] = [
    {
      slug: "naomi-and-ruths-loyalty", title: "Noomi och Ruts trohet",
      startRef: "Ruth 1:1", endRef: "Ruth 1:22", orderInBook: 1,
      characterSlugs: ["rut", "noomi"], themeSlugs: ["covenant", "sacrifice"],
    },
    {
      slug: "ruth-gleans-in-boaz-field", title: "Rut plockar ax på Boas åker",
      startRef: "Ruth 2:1", endRef: "Ruth 2:23", orderInBook: 2,
      characterSlugs: ["rut", "boas", "noomi"], themeSlugs: ["compassion"],
    },
    {
      slug: "ruth-at-the-threshing-floor", title: "Rut vid tröskplatsen",
      startRef: "Ruth 3:1", endRef: "Ruth 3:18", orderInBook: 3,
      characterSlugs: ["rut", "boas", "noomi"], themeSlugs: ["covenant"],
    },
    {
      slug: "boaz-marries-ruth", title: "Boas gifter sig med Rut",
      startRef: "Ruth 4:1", endRef: "Ruth 4:22", orderInBook: 4,
      characterSlugs: ["rut", "boas"], themeSlugs: ["compassion"],
    },
  ];
  for (const s of ruthStories) {
    const ruthStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: ruth.id, slug: s.slug } },
      update: ruthStoryData,
      create: { bookId: ruth.id, slug: s.slug, ...ruthStoryData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: ruthCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: ruthCharacters[charSlug].id },
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

  const ruthCaptions = ruthCaptionsByCode as Record<string, string[]>;
  const ruthImageSets: Array<{ storySlug: string; code: string; fileStart: number; fileEnd: number; orderStart: number; credit: string; creditUrl: string }> = [
    { storySlug: "naomi-and-ruths-loyalty", code: "FB_Ruth_Part1", fileStart: 1, fileEnd: 13, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/ruth-1/" },
    { storySlug: "ruth-gleans-in-boaz-field", code: "FB_Ruth_Part2", fileStart: 1, fileEnd: 11, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/ruth-2/" },
    // FB_Ruth_Part3 delas mellan de två sista berättelserna: bild 1-5 är
    // tröskplats-scenen (kap 3), bild 6-11 är stadsporten/bröllopet (kap 4).
    { storySlug: "ruth-at-the-threshing-floor", code: "FB_Ruth_Part3", fileStart: 1, fileEnd: 5, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/ruth-3/" },
    { storySlug: "boaz-marries-ruth", code: "FB_Ruth_Part3", fileStart: 6, fileEnd: 11, orderStart: 6, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/ruth-3/" },
  ];
  for (const set of ruthImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: ruth.id, slug: set.storySlug } });
    for (let fileNum = set.fileStart; fileNum <= set.fileEnd; fileNum++) {
      const order = set.orderStart + (fileNum - set.fileStart);
      // Filerna ligger i respektive story-mapp under sitt URSPRUNGLIGA
      // filnummer (samma kod laddades ner separat per story-mapp där den
      // delas, precis som FB_RG_Lot i Genesis-avsnittet).
      const path = `/images/ruth/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = ruthCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const ruthPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    // Bild 10 i Part1: Ruts trohetslöfte ("Dit du går vill också jag gå") — hennes mest ikoniska ögonblick.
    { slug: "rut", storySlug: "naomi-and-ruths-loyalty", imgOrder: 10 },
    // Bild 6 i Part1: Noomi i samtal med sina sonhustrur, tydligt ansikte.
    { slug: "noomi", storySlug: "naomi-and-ruths-loyalty", imgOrder: 6 },
    // Bild 4 i Part2: Boas talar vänligt med Rut på åkern.
    { slug: "boas", storySlug: "ruth-gleans-in-boaz-field", imgOrder: 4 },
  ];
  for (const p of ruthPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: ruth.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const ruthThumbnails: Record<string, number> = {
    "naomi-and-ruths-loyalty": 10, // Ruts trohetslöfte till Noomi.
    "ruth-gleans-in-boaz-field": 4, // Boas talar med Rut på åkern.
    "ruth-at-the-threshing-floor": 5, // Rut och Boas ansikte mot ansikte i natten.
    "boaz-marries-ruth": 11, // Glad familjescen med den nyfödde Obed.
  };
  for (const [slug, order] of Object.entries(ruthThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: ruth.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Rut: ${ruthStories.length} stories.`);

  // ======================================================================
  // Ester — nionde boken. Rikast handling hittills av de korta OT-
  // böckerna (10 kapitel), seedas som sex berättelser. Tre bildset
  // (Sweet Publishing, samma serie som Rut, CC BY-SA, AI tillåtet)
  // täcker hela boken, ett set per två kapitel-par — varje set delas i
  // sin tur mellan två berättelser via fileStart/fileEnd. OBS: boken
  // nämner aldrig Gud/HERREN vid namn i grundtexten (ett känt drag hos
  // Ester) — normalize_divine_name.py hittade konsekvent noll träffar,
  // vilket är korrekt, inte ett tecken på ett missat extraheringsfel.
  // ======================================================================
  const esther = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "esther" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "esther",
      name: "Ester",
      order: 9,
      testament: "old",
    },
  });

  const estherCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "ester", name: "Ester" },
    { slug: "mordokai", name: "Mordokai" },
    { slug: "haman", name: "Haman" },
    { slug: "ahasveros", name: "Ahasveros (Xerxes)" },
    { slug: "vasti", name: "Vasti" },
  ];
  const estherCharacters: Record<string, { id: string }> = {};
  for (const c of estherCharacterDefs) {
    estherCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type EstherStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const estherStories: EstherStoryDef[] = [
    {
      slug: "vashti-and-the-search-for-a-queen", title: "Vasti och sökandet efter en ny drottning",
      startRef: "Esther 1:1", endRef: "Esther 2:23", orderInBook: 1,
      characterSlugs: ["ester", "mordokai", "ahasveros", "vasti"], themeSlugs: ["hierarchy"],
    },
    {
      slug: "hamans-decree-against-the-jews", title: "Hamans påbud mot judarna",
      startRef: "Esther 3:1", endRef: "Esther 3:15", orderInBook: 2,
      characterSlugs: ["haman", "mordokai", "ahasveros"], themeSlugs: ["deception", "hierarchy"],
    },
    {
      slug: "esther-risks-her-life", title: "Ester riskerar sitt liv",
      startRef: "Esther 4:1", endRef: "Esther 5:14", orderInBook: 3,
      characterSlugs: ["ester", "mordokai", "haman"], themeSlugs: ["sacrifice", "testing-of-faith"],
    },
    {
      slug: "the-kings-sleepless-night", title: "Kungens sömnlösa natt",
      startRef: "Esther 6:1", endRef: "Esther 6:14", orderInBook: 4,
      characterSlugs: ["ahasveros", "mordokai", "haman"], themeSlugs: ["chaos-order"],
    },
    {
      slug: "haman-falls", title: "Hamans fall",
      startRef: "Esther 7:1", endRef: "Esther 8:17", orderInBook: 5,
      characterSlugs: ["ester", "haman", "ahasveros"], themeSlugs: ["betrayal", "deception"],
    },
    {
      slug: "purim-established", title: "Purimfesten instiftas",
      startRef: "Esther 9:1", endRef: "Esther 10:3", orderInBook: 6,
      characterSlugs: ["mordokai", "ester"], themeSlugs: ["covenant"],
    },
  ];
  for (const s of estherStories) {
    const estherStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: esther.id, slug: s.slug } },
      update: estherStoryData,
      create: { bookId: esther.id, slug: s.slug, ...estherStoryData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: estherCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: estherCharacters[charSlug].id },
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

  const estherCaptions = estherCaptionsByCode as Record<string, string[]>;
  const estherImageSets: Array<{ storySlug: string; code: string; fileStart: number; fileEnd: number; orderStart: number; credit: string; creditUrl: string }> = [
    { storySlug: "vashti-and-the-search-for-a-queen", code: "FB_Esther_Part_1", fileStart: 1, fileEnd: 13, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/esther-1/" },
    { storySlug: "hamans-decree-against-the-jews", code: "FB_Esther_Part_1", fileStart: 14, fileEnd: 21, orderStart: 14, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/esther-1/" },
    { storySlug: "esther-risks-her-life", code: "FB_Esther_Part_2", fileStart: 1, fileEnd: 14, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/esther-2/" },
    { storySlug: "the-kings-sleepless-night", code: "FB_Esther_Part_2", fileStart: 15, fileEnd: 22, orderStart: 15, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/esther-2/" },
    { storySlug: "haman-falls", code: "FB_Esther_Part_3", fileStart: 1, fileEnd: 11, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/esther-3/" },
    { storySlug: "purim-established", code: "FB_Esther_Part_3", fileStart: 12, fileEnd: 16, orderStart: 12, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/esther-3/" },
  ];
  for (const set of estherImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: esther.id, slug: set.storySlug } });
    for (let fileNum = set.fileStart; fileNum <= set.fileEnd; fileNum++) {
      const order = set.orderStart + (fileNum - set.fileStart);
      // orderStart == fileStart för alla set här (ingen mappdelning
      // mellan flera koder), så order == fileNum rakt av — filerna ligger
      // i respektive story-mapp under sitt ursprungliga filnummer.
      const path = `/images/esther/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = estherCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const estherPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "ester", storySlug: "vashti-and-the-search-for-a-queen", imgOrder: 11 }, // Ester krönt till drottning.
    { slug: "ahasveros", storySlug: "hamans-decree-against-the-jews", imgOrder: 17 }, // Kungen i eftertänksam närbild.
    { slug: "haman", storySlug: "esther-risks-her-life", imgOrder: 13 }, // Haman skryter för sin hustru och sina vänner.
    { slug: "mordokai", storySlug: "the-kings-sleepless-night", imgOrder: 20 }, // Mordokai hedrad på kungens häst.
  ];
  for (const p of estherPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: esther.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const estherThumbnails: Record<string, number> = {
    "vashti-and-the-search-for-a-queen": 11, // Ester krönt till drottning.
    "hamans-decree-against-the-jews": 17, // Kungen i eftertänksam närbild.
    "esther-risks-her-life": 9, // Ester sträcker fram handen mot kungens gyllene spira.
    "the-kings-sleepless-night": 20, // Mordokai på kungens häst, Haman leder den.
    "haman-falls": 3, // "Denne skändlige Haman" — anklagelsen inför kungen.
    "purim-established": 16, // Purimfestens glada firande.
  };
  for (const [slug, order] of Object.entries(estherThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: esther.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Ester: ${estherStories.length} stories.`);

  // ======================================================================
  // Daniel — tionde boken. De sex klassiska berättande kapitlen (1-6)
  // seedas som sex berättelser; kapitel 7-12 är apokalyptiska syner
  // (fyra vilddjuren, väduren och bocken, de sjuttio årsveckorna) snarare
  // än berättelser i egentlig mening och lämnas utanför, samma avgränsning
  // som redan gjorts för andra profetböcker/uppenbarelselitteratur i den
  // här appen.
  //
  // OBS bildkvalitet vid extraktion: Daniel är ovanligt tungt
  // korsreferens-annoterad i källkorpusen — 65 av bokens 196 verser hade
  // en akademisk korsreferens ("1 Mos. 10,10.", "Dan. 6,28. 10,1." osv.)
  // hopklistrad direkt i versslutet av extraherings-scriptet. Städat bort
  // manuellt/med regex innan denna fas (se scratchpad-scriptet från
  // sessionen där boken lades till). Dessutom hade 1:1 helt tappat sin
  // riktiga text till en XML-strukturkvirk (kapitelrubriken nästlad i
  // FÖREGÅENDE vers-element) och fick sin text återställd manuellt direkt
  // från källkoden — samma kvirk (fast för en SISTA vers) hittades även
  // vid gränsen 3:30/4:1.
  // ======================================================================
  const daniel = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "daniel" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "daniel",
      name: "Daniel",
      order: 10,
      testament: "old",
    },
  });

  const danielCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "daniel", name: "Daniel" },
    { slug: "hananja", name: "Hananja (Sadrak)" },
    { slug: "misael", name: "Misael (Mesak)" },
    { slug: "asarja", name: "Asarja (Abed-Nego)" },
    { slug: "nebukadnessar", name: "Nebukadnessar" },
    { slug: "belsassar", name: "Belsassar" },
    { slug: "darejaves", name: "Darejaves" },
  ];
  const danielCharacters: Record<string, { id: string }> = {};
  for (const c of danielCharacterDefs) {
    danielCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type DanielStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const danielStories: DanielStoryDef[] = [
    {
      slug: "daniel-refuses-the-kings-food", title: "Daniel vägrar kungens mat",
      startRef: "Daniel 1:1", endRef: "Daniel 1:21", orderInBook: 1,
      characterSlugs: ["daniel", "hananja", "misael", "asarja", "nebukadnessar"], themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "nebuchadnezzars-statue-dream", title: "Nebukadnessars dröm om bildstoden",
      startRef: "Daniel 2:1", endRef: "Daniel 2:49", orderInBook: 2,
      characterSlugs: ["daniel", "nebukadnessar"], themeSlugs: ["chaos-order"],
    },
    {
      slug: "the-fiery-furnace", title: "Den brinnande ugnen",
      startRef: "Daniel 3:1", endRef: "Daniel 3:30", orderInBook: 3,
      characterSlugs: ["hananja", "misael", "asarja", "nebukadnessar"], themeSlugs: ["testing-of-faith", "sacrifice"],
    },
    {
      slug: "nebuchadnezzars-madness", title: "Nebukadnessars vansinne",
      startRef: "Daniel 4:1", endRef: "Daniel 4:34", orderInBook: 4,
      characterSlugs: ["nebukadnessar", "daniel"], themeSlugs: ["self-consciousness"],
    },
    {
      slug: "belshazzars-feast", title: "Belsassars gästabud",
      startRef: "Daniel 5:1", endRef: "Daniel 5:30", orderInBook: 5,
      characterSlugs: ["belsassar", "daniel"], themeSlugs: ["hierarchy", "chaos-order"],
    },
    {
      slug: "daniel-in-the-lions-den", title: "Daniel i lejongropen",
      startRef: "Daniel 6:1", endRef: "Daniel 6:28", orderInBook: 6,
      characterSlugs: ["daniel", "darejaves"], themeSlugs: ["testing-of-faith", "betrayal"],
    },
  ];
  for (const s of danielStories) {
    const danielStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: daniel.id, slug: s.slug } },
      update: danielStoryData,
      create: { bookId: daniel.id, slug: s.slug, ...danielStoryData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: danielCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: danielCharacters[charSlug].id },
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

  const danielCaptions = danielCaptionsByCode as Record<string, string[]>;
  const danielImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "daniel-refuses-the-kings-food", code: "FB_Daniel_Food", count: 11, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/daniel-food/" },
    { storySlug: "nebuchadnezzars-statue-dream", code: "FB_BS_Nebuchadnezzar_Statue", count: 15, credit: "Bible Scenes / Jeremy Park (freebibleimages.org), CC BY", creditUrl: "https://www.freebibleimages.org/illustrations/bs-nebuchadnezzar-statue/" },
    { storySlug: "the-fiery-furnace", code: "FB_LS_ThreeMen_Fire", count: 9, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-three-men-fire/" },
    { storySlug: "nebuchadnezzars-madness", code: "FB_LS_Proud_King", count: 7, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-proud-king/" },
    { storySlug: "belshazzars-feast", code: "FB_BS_Writing_Wall", count: 16, credit: "Bible Scenes / Jeremy Park (freebibleimages.org), CC BY", creditUrl: "https://www.freebibleimages.org/illustrations/bs-writing-wall/" },
    { storySlug: "daniel-in-the-lions-den", code: "FB_LS_Daniel_Lions", count: 8, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-daniel-lions/" },
  ];
  for (const set of danielImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: daniel.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/daniel/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = danielCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  // OBS: "belsassar" saknar porträtt medvetet — hela Bible Scenes-setet
  // för Belsassars gästabud (FB_BS_Writing_Wall) är atmosfäriska
  // arkitektur-/skriften-på-väggen-bilder utan en enda mänsklig figur,
  // kontrollerat genom att titta igenom alla 16 bilder.
  const danielPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "daniel", storySlug: "daniel-in-the-lions-den", imgOrder: 2 },
    { slug: "nebukadnessar", storySlug: "nebuchadnezzars-madness", imgOrder: 1 },
  ];
  for (const p of danielPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: daniel.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const danielThumbnails: Record<string, number> = {
    "daniel-refuses-the-kings-food": 9, // Daniel förhandlar med vaktaren om tio dagars grönsaker
    "nebuchadnezzars-statue-dream": 4, // bildstodens gyllene huvud
    "the-fiery-furnace": 7, // de tre männen oskadda i elden
    "nebuchadnezzars-madness": 3, // kungen lever som ett djur
    "belshazzars-feast": 2, // handen som skriver på väggen
    "daniel-in-the-lions-den": 7, // Daniel kastad i lejongropen, ber
  };
  for (const [slug, order] of Object.entries(danielThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: daniel.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Daniel: ${danielStories.length} stories.`);

  // ======================================================================
  // Första Samuelsboken — elfte boken. Den enskilt starkaste obearbetade
  // kandidaten i hela Gamla testamentet (se den publicerade Bibel-
  // överblicken 2026-08-27): Hannas bön, Samuels kallelse, Saul och David
  // smorda till kungar, David och Goljat, Jonatans vänskap, Sauls fall.
  //
  // OBS samma datakvalitetsmönster som Daniel: källtexten är tungt
  // korsreferens-annoterad — 94 av bokens 299 verser (över de tolv
  // extraherade kapitlen 1, 3, 9, 10, 15-20, 24, 31) hade akademiska
  // korsreferenser hopklistrade i versslutet, städat med samma
  // flerstegs-regex som för Daniel. Två verser (3:2, en av flera i den
  // här boken) hade dessutom HELA sin text tappad till samma XML-
  // strukturkvirk som Dan 1:1 — återställda manuellt direkt från
  // källkoden.
  // ======================================================================
  const samuel = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "1-samuel" } },
    update: {},
    create: {
      corpusId: bible.id,
      slug: "1-samuel",
      name: "Första Samuelsboken",
      order: 11,
      testament: "old",
    },
  });

  const samuelCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "hanna", name: "Hanna" },
    { slug: "elkana", name: "Elkana" },
    { slug: "eli", name: "Eli" },
    { slug: "samuel", name: "Samuel" },
    { slug: "saul", name: "Saul" },
    { slug: "david", name: "David" },
    { slug: "jonatan", name: "Jonatan" },
    { slug: "isai", name: "Isai" },
    { slug: "goljat", name: "Goljat" },
  ];
  const samuelCharacters: Record<string, { id: string }> = {};
  for (const c of samuelCharacterDefs) {
    samuelCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  type SamuelStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const samuelStories: SamuelStoryDef[] = [
    {
      slug: "hannah-and-the-birth-of-samuel", title: "Hanna och Samuels födelse",
      startRef: "1 Samuel 1:1", endRef: "1 Samuel 1:28", orderInBook: 1,
      characterSlugs: ["hanna", "elkana", "eli", "samuel"], themeSlugs: ["testing-of-faith", "sacrifice"],
    },
    {
      slug: "god-calls-samuel", title: "Gud kallar Samuel",
      startRef: "1 Samuel 3:1", endRef: "1 Samuel 3:21", orderInBook: 2,
      characterSlugs: ["samuel", "eli"], themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "saul-anointed-king", title: "Saul smörjs till kung",
      startRef: "1 Samuel 9:1", endRef: "1 Samuel 10:27", orderInBook: 3,
      characterSlugs: ["saul", "samuel"], themeSlugs: ["hierarchy", "kingdom-of-god"],
    },
    {
      slug: "saul-rejected-as-king", title: "Saul förkastas som kung",
      startRef: "1 Samuel 15:1", endRef: "1 Samuel 15:35", orderInBook: 4,
      characterSlugs: ["saul", "samuel"], themeSlugs: ["hierarchy"],
    },
    {
      slug: "david-anointed-king", title: "David smörjs till kung",
      startRef: "1 Samuel 16:1", endRef: "1 Samuel 16:13", orderInBook: 5,
      characterSlugs: ["david", "samuel", "isai"], themeSlugs: ["hierarchy", "kingdom-of-god"],
    },
    {
      slug: "david-and-goliath", title: "David och Goljat",
      startRef: "1 Samuel 17:1", endRef: "1 Samuel 17:58", orderInBook: 6,
      characterSlugs: ["david", "goljat", "saul"], themeSlugs: ["testing-of-faith", "chaos-order"],
    },
    {
      slug: "david-and-jonathans-friendship", title: "Davids och Jonatans vänskap",
      startRef: "1 Samuel 18:1", endRef: "1 Samuel 20:42", orderInBook: 7,
      characterSlugs: ["david", "jonatan", "saul"], themeSlugs: ["covenant", "betrayal"],
    },
    {
      slug: "david-spares-sauls-life", title: "David skonar Sauls liv",
      startRef: "1 Samuel 24:1", endRef: "1 Samuel 24:22", orderInBook: 8,
      characterSlugs: ["david", "saul"], themeSlugs: ["forgiveness", "hierarchy"],
    },
    {
      slug: "death-of-saul", title: "Sauls död",
      startRef: "1 Samuel 31:1", endRef: "1 Samuel 31:13", orderInBook: 9,
      characterSlugs: ["saul", "jonatan"], themeSlugs: ["chaos-order"],
    },
  ];
  for (const s of samuelStories) {
    const samuelStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: samuel.id, slug: s.slug } },
      update: samuelStoryData,
      create: { bookId: samuel.id, slug: s.slug, ...samuelStoryData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: samuelCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: samuelCharacters[charSlug].id },
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

  const samuelCaptions = samuelCaptionsByCode as Record<string, string[]>;
  const samuelImageSets: Array<{ storySlug: string; code: string; fileStart: number; fileEnd: number; orderStart: number; credit: string; creditUrl: string }> = [
    { storySlug: "hannah-and-the-birth-of-samuel", code: "FB_LS_Hannah_Prayer", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-hannah-prayer/" },
    { storySlug: "god-calls-samuel", code: "FB_LS_Samuel_Eli", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-samuel-eli/" },
    { storySlug: "saul-anointed-king", code: "FB_Samuel_Saul", fileStart: 1, fileEnd: 18, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/samuel-saul/" },
    { storySlug: "saul-rejected-as-king", code: "FB_Saul_Amalekites", fileStart: 1, fileEnd: 18, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/saul-amalekites/" },
    { storySlug: "david-anointed-king", code: "FB_LS_David_Anointed", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-david-anointed/" },
    { storySlug: "david-and-goliath", code: "FB_LS_David_Goliath", fileStart: 1, fileEnd: 7, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-david-goliath/" },
    { storySlug: "david-and-jonathans-friendship", code: "FB_David_Jonathan", fileStart: 1, fileEnd: 24, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/david-jonathan/" },
    { storySlug: "david-spares-sauls-life", code: "FB_LS_David_Cave", fileStart: 1, fileEnd: 8, orderStart: 1, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-david-cave/" },
    // Delar av ett större set (16 bilder om Sauls sista dagar, 28-31 +
    // 2 Sam 1-2) — bara bild 10-14 (själva slutstriden/döden/begravningen,
    // 1 Sam 31) används här.
    { storySlug: "death-of-saul", code: "FB_Saul_Last_Days", fileStart: 10, fileEnd: 14, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/saul-last-days/" },
  ];
  for (const set of samuelImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: samuel.id, slug: set.storySlug } });
    for (let fileNum = set.fileStart; fileNum <= set.fileEnd; fileNum++) {
      const order = set.orderStart + (fileNum - set.fileStart);
      const fileLabel = set.storySlug === "death-of-saul" ? fileNum : fileNum; // filerna sparas under sitt ursprungliga filnummer
      const path = `/images/1-samuel/${set.storySlug}/${String(fileLabel).padStart(2, "0")}.jpg`;
      const caption = samuelCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  const samuelPortraits: Array<{ slug: string; storySlug: string; imgOrder: number }> = [
    { slug: "hanna", storySlug: "hannah-and-the-birth-of-samuel", imgOrder: 7 },
    { slug: "samuel", storySlug: "god-calls-samuel", imgOrder: 5 },
    { slug: "saul", storySlug: "saul-anointed-king", imgOrder: 16 },
    { slug: "david", storySlug: "david-and-goliath", imgOrder: 6 },
    { slug: "jonatan", storySlug: "david-and-jonathans-friendship", imgOrder: 22 },
    { slug: "isai", storySlug: "david-anointed-king", imgOrder: 6 },
    { slug: "goljat", storySlug: "david-and-goliath", imgOrder: 5 },
    { slug: "eli", storySlug: "god-calls-samuel", imgOrder: 4 },
  ];
  for (const p of samuelPortraits) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: samuel.id, slug: p.storySlug } });
    const img = await prisma.storyImage.findUniqueOrThrow({ where: { storyId_order: { storyId: story.id, order: p.imgOrder } } });
    await prisma.character.update({
      where: { slug: p.slug },
      data: { portraitPath: img.path, portraitCredit: img.credit, portraitCreditUrl: img.creditUrl },
    });
  }

  const samuelThumbnails: Record<string, number> = {
    "hannah-and-the-birth-of-samuel": 7, // Hanna får sina glada nyheter
    "god-calls-samuel": 5, // Samuel springer till Eli i natten
    "saul-anointed-king": 14, // Samuel smörjer Saul med olja
    "saul-rejected-as-king": 16, // "Lydnad är bättre än offer"
    "david-anointed-king": 8, // Samuel smörjer David inför sina bröder
    "david-and-goliath": 6, // stenen träffar Goljat
    "david-and-jonathans-friendship": 22, // David bugar sig tre gånger inför Jonatan
    "david-spares-sauls-life": 7, // David visar manteflik för Saul
    "death-of-saul": 2, // Sauls sista strid
  };
  for (const [slug, order] of Object.entries(samuelThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: samuel.id, slug }, data: { thumbnailOrder: order } });
  }

  console.log(`Seedat Första Samuelsboken: ${samuelStories.length} stories.`);

  // ======================================================================
  // Fyra korta tillägg, alla på användarens direkta begäran (2026-08-27,
  // uppföljning av den publicerade Bibel-överblicken): Levitikus och
  // Deuteronomium får var sin enda berättelse (deras enda riktiga
  // narrativa inslag), Job får en enda berättelse byggd av bara ramen
  // (prolog+epilog, inte den poetiska mittdelen), och Höga Visan läggs
  // till i sin helhet som ren text utan bilder (kärleksdikt, ingen scen
  // att illustrera — samma princip som "Fåren och getterna" i Matteus).
  // ======================================================================

  // --- Tredje Moseboken (Leviticus) — enda berättelsen ------------------
  const leviticus = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "leviticus" } },
    update: {},
    create: { corpusId: bible.id, slug: "leviticus", name: "Tredje Moseboken", order: 12, testament: "old" },
  });
  // Samma slug som Aron redan har i Exodus-avsnittet — länkas ihop.
  const aronChar = await prisma.character.upsert({ where: { slug: "aron" }, update: {}, create: { slug: "aron", name: "Aron" } });
  const nadabStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: leviticus.id, slug: "nadab-and-abihu" } },
    update: { title: "Nadab och Abihus död", startRef: "Leviticus 10:1", endRef: "Leviticus 10:20", orderInBook: 1 },
    create: { bookId: leviticus.id, slug: "nadab-and-abihu", title: "Nadab och Abihus död", startRef: "Leviticus 10:1", endRef: "Leviticus 10:20", orderInBook: 1 },
  });
  await prisma.storyCharacter.upsert({
    where: { storyId_characterId: { storyId: nadabStory.id, characterId: aronChar.id } },
    update: {},
    create: { storyId: nadabStory.id, characterId: aronChar.id },
  });
  const chaosOrderTheme = themes["chaos-order"];
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: nadabStory.id, themeId: chaosOrderTheme.id } },
    update: {},
    create: { storyId: nadabStory.id, themeId: chaosOrderTheme.id },
  });
  await prisma.book.update({
    where: { id: leviticus.id },
    data: {
      description:
        "Så gott som hela boken är offer- och renhetslagstiftning, inte " +
        "berättelse — det enda riktiga narrativa inslaget är Nadab och " +
        "Abihus död (kap. 10): Arons två äldre söner offrar \"främmande " +
        "eld\" på fel sätt inför Gud och dör momentant. En kärv påminnelse " +
        "om att inte närma sig det heliga på egna villkor.",
      authorship: "Traditionellt tillskriven Mose. Modern forskning ser den som prästerlig lagtext, sammanställd och redigerad över lång tid, delvis samtidigt med Genesis/Exodus källor.",
      traditions: "Judendom: tredje boken i Toran, central för prästerlig renhetslag och offerkult. Kristendom: läses ofta symboliskt/typologiskt (offerlagarna som förebild till Kristi offer). Islam: ingen direkt motsvarighet.",
    },
  });
  console.log("Seedat Tredje Moseboken: 1 story.");

  // --- Femte Moseboken (Deuteronomium) — enda nya berättelsen -----------
  const deuteronomy = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "deuteronomy" } },
    update: {},
    create: { corpusId: bible.id, slug: "deuteronomy", name: "Femte Moseboken", order: 13, testament: "old" },
  });
  const mosesDeathStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: deuteronomy.id, slug: "death-of-moses" } },
    update: { title: "Moses död", startRef: "Deuteronomy 34:1", endRef: "Deuteronomy 34:12", orderInBook: 1 },
    create: { bookId: deuteronomy.id, slug: "death-of-moses", title: "Moses död", startRef: "Deuteronomy 34:1", endRef: "Deuteronomy 34:12", orderInBook: 1 },
  });
  // Samma slug som i Exodus-avsnittet — upsert returnerar/uppdaterar bara
  // samma rad, så Mose länkas ihop över böcker (se motsvarande mönster
  // för mose/elia i Matteus-sektionen).
  const moseChar = await prisma.character.upsert({ where: { slug: "mose" }, update: {}, create: { slug: "mose", name: "Mose" } });
  await prisma.storyCharacter.upsert({
    where: { storyId_characterId: { storyId: mosesDeathStory.id, characterId: moseChar.id } },
    update: {},
    create: { storyId: mosesDeathStory.id, characterId: moseChar.id },
  });
  const deutCaptions = deutCaptionsByCode as Record<string, string[]>;
  for (let fileNum = 12; fileNum <= 17; fileNum++) {
    const order = fileNum - 11;
    const path = `/images/deuteronomy/death-of-moses/${String(fileNum).padStart(2, "0")}.jpg`;
    const caption = deutCaptions["FB_Moses_Joshua"]?.[fileNum - 1] ?? null;
    await prisma.storyImage.upsert({
      where: { storyId_order: { storyId: mosesDeathStory.id, order } },
      update: { path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/moses-joshua/" },
      create: { storyId: mosesDeathStory.id, order, path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/moses-joshua/" },
    });
  }
  await prisma.story.update({ where: { id: mosesDeathStory.id }, data: { thumbnailOrder: 4 } }); // Mose ser ut över landet från Nebo (fil 15)
  await prisma.book.update({
    where: { id: deuteronomy.id },
    data: {
      description:
        "Mest Moses avskedstal — en genomgång/förnyelse av lagen inför " +
        "generationen som ska gå in i det utlovade landet. Det enda nya " +
        "narrativa inslaget är slutet (kap. 34): Mose får se landet från " +
        "berget Nebo men inte gå in i det (straff för olydnad vid " +
        "Meriba), och dör där, begravd av Gud på okänd plats.",
      authorship: "Traditionellt tillskriven Mose själv (i talform). Modern forskning ser den ofta som skriven/redigerad betydligt senare, kopplad till Josias reform (2 Kung. 22-23, ca 620 f.Kr.) — \"lagboken\" som återfinns då tros av många vara en tidig version av Deuteronomium.",
      traditions: "Judendom: femte och sista boken i Toran, innehåller Shema (6:4, judendomens centrala trosbekännelse). Kristendom: Jesus citerar Deuteronomium tre gånger när han frestas i öknen (Matt. 4). Islam: ingen direkt motsvarighet, men Musa (Mose) är den mest omnämnda profeten i Koranen.",
    },
  });
  console.log("Seedat Femte Moseboken: 1 story.");

  // --- Job — en enda berättelse av ramen (prolog + epilog) ---------------
  const jobBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "job" } },
    update: {},
    create: { corpusId: bible.id, slug: "job", name: "Job", order: 14, testament: "old" },
  });
  const jobChar = await prisma.character.upsert({ where: { slug: "job" }, update: {}, create: { slug: "job", name: "Job" } });
  const jobStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: jobBook.id, slug: "jobs-trial" } },
    update: { title: "Jobs prövning", startRef: "Job 1:1", endRef: "Job 2:13", orderInBook: 1 },
    create: { bookId: jobBook.id, slug: "jobs-trial", title: "Jobs prövning", startRef: "Job 1:1", endRef: "Job 2:13", orderInBook: 1 },
  });
  await prisma.storyCharacter.upsert({
    where: { storyId_characterId: { storyId: jobStory.id, characterId: jobChar.id } },
    update: {},
    create: { storyId: jobStory.id, characterId: jobChar.id },
  });
  const testingTheme = themes["testing-of-faith"];
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: jobStory.id, themeId: testingTheme.id } },
    update: {},
    create: { storyId: jobStory.id, themeId: testingTheme.id },
  });
  for (let fileNum = 1; fileNum <= 7; fileNum++) {
    const path = `/images/job/jobs-trial/${String(fileNum).padStart(2, "0")}.jpg`;
    const caption = deutCaptions["FB_LS_Job"]?.[fileNum - 1] ?? null;
    await prisma.storyImage.upsert({
      where: { storyId_order: { storyId: jobStory.id, order: fileNum } },
      update: { path, caption, credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/ls-job/" },
      create: { storyId: jobStory.id, order: fileNum, path, caption, credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/ls-job/" },
    });
  }
  await prisma.story.update({ where: { id: jobStory.id }, data: { thumbnailOrder: 3 } }); // budbäraren med de dåliga nyheterna
  await prisma.book.update({
    where: { id: jobBook.id },
    data: {
      description:
        "En enda berättelse byggd av bokens narrativa RAM — prologen " +
        "(kap. 1-2: Job mister allt, Satans vadslagning med Gud) och " +
        "epilogen (kap. 42: upprättelsen) — snarare än hela boken. Den " +
        "poetiska mittdelen (kap. 3-41, Jobs och hans vänners långa " +
        "dialog om lidandets mening) är inte indexerad här; den är " +
        "diktform/argumentation, inte handling.",
      authorship: "Okänd författare. Bland de mest omdebatterade dateringarna i GT — förslag spänner från patriark-tid (tidigast) till efter den babyloniska fångenskapen (senast), eftersom berättelsen själv utspelar sig i en obestämd, mycket gammal tid \"i österlandet\".",
      traditions: "Judendom: en av \"Ketuvim\" (Skrifterna), central visdomstext om lidande utan enkla svar. Kristendom: Job nämns som uthållighetens föredöme (Jak. 5:11). Islam: Ayyub (Job) är en erkänd profet i Koranen, prisad för sitt tålamod.",
    },
  });
  console.log("Seedat Job: 1 story.");

  // --- Höga Visan — hela boken, ren text utan bilder ---------------------
  const songOfSongs = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "song-of-songs" } },
    update: {},
    create: { corpusId: bible.id, slug: "song-of-songs", name: "Höga Visan", order: 15, testament: "old" },
  });
  await prisma.story.upsert({
    where: { bookId_slug: { bookId: songOfSongs.id, slug: "song-of-songs" } },
    update: { title: "Höga Visan", startRef: "Song of Songs 1:1", endRef: "Song of Songs 8:14", orderInBook: 1 },
    create: { bookId: songOfSongs.id, slug: "song-of-songs", title: "Höga Visan", startRef: "Song of Songs 1:1", endRef: "Song of Songs 8:14", orderInBook: 1 },
  });
  await prisma.book.update({
    where: { id: songOfSongs.id },
    data: {
      description:
        "Kärleksdikt/dialog mellan två älskande, inte berättelse — " +
        "ingen handling med skeenden att sammanfatta. Lagd till i sin " +
        "HELHET som ren text (inga bilder — det finns ingen enskild " +
        "scen att illustrera), på användarens uttryckliga önskan om att " +
        "kunna läsa den i appen.",
      authorship: "Traditionellt tillskriven Salomo (\"Salomos höga visa\"). Modern forskning daterar den ofta senare, ibland betydligt senare (efterexilisk tid), utifrån språkliga drag.",
      traditions: "Judendom: en av de fem \"Megillot\", läses vid påsken (Pesach); tolkas traditionellt allegoriskt som Guds kärlek till Israel. Kristendom: tolkas ofta allegoriskt som Kristi kärlek till kyrkan. Islam: ingen motsvarighet i Koranen.",
    },
  });
  console.log("Seedat Höga Visan: 1 story (hela boken, ingen bilddelning).");

  // --- Jeremia — Jeremia i brunnen, Jerusalems fall ----------------------
  // NY 2026-08-27, se README Fas 44: användaren blev nyfiken på Jeremia
  // efter Fas 43. Bokens berättande höjdpunkt är den sammanhängande
  // episoden kap. 37-39 — Jeremia fängslas, kastas i en tom cistern och
  // räddas av den etiopiske hovmannen Ebed-Melek, och slutligen bevittnar
  // han själv Jerusalems fall. Resten av boken (majoriteten) är profetisk
  // poesi/orakel, inte handling, och lämnas därför utanför.
  const jeremiahBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "jeremiah" } },
    update: {},
    create: { corpusId: bible.id, slug: "jeremiah", name: "Jeremia", order: 16, testament: "old" },
  });
  const jeremiahChar = await prisma.character.upsert({ where: { slug: "jeremiah" }, update: {}, create: { slug: "jeremiah", name: "Jeremia" } });
  const cisternStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: jeremiahBook.id, slug: "jeremiah-in-the-cistern" } },
    update: { title: "Jeremia i brunnen — Jerusalems fall", startRef: "Jeremiah 37:1", endRef: "Jeremiah 39:18", orderInBook: 1 },
    create: { bookId: jeremiahBook.id, slug: "jeremiah-in-the-cistern", title: "Jeremia i brunnen — Jerusalems fall", startRef: "Jeremiah 37:1", endRef: "Jeremiah 39:18", orderInBook: 1 },
  });
  await prisma.storyCharacter.upsert({
    where: { storyId_characterId: { storyId: cisternStory.id, characterId: jeremiahChar.id } },
    update: {},
    create: { storyId: cisternStory.id, characterId: jeremiahChar.id },
  });
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: cisternStory.id, themeId: chaosOrderTheme.id } },
    update: {},
    create: { storyId: cisternStory.id, themeId: chaosOrderTheme.id },
  });
  const jeremiahCaptions = jeremiahCaptionsByCode as Record<string, string[]>;
  for (let fileNum = 1; fileNum <= 19; fileNum++) {
    const path = `/images/jeremiah/jeremiah-in-the-cistern/${String(fileNum).padStart(2, "0")}.jpg`;
    const caption = jeremiahCaptions["FB_Jeremiah_Cistern"]?.[fileNum - 1] || null;
    await prisma.storyImage.upsert({
      where: { storyId_order: { storyId: cisternStory.id, order: fileNum } },
      update: { path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/jeremiah-cistern/" },
      create: { storyId: cisternStory.id, order: fileNum, path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/jeremiah-cistern/" },
    });
  }
  await prisma.story.update({ where: { id: cisternStory.id }, data: { thumbnailOrder: 9 } }); // Jeremia ser upp mot Ebed-Melek vid brunnens mynning
  await prisma.book.update({
    where: { id: jeremiahBook.id },
    data: {
      description:
        "Blandning av profetiska orakel och en dramatisk, självupplevd " +
        "berättelse — Jeremia varnar, fängslas, kastas i en tom cistern " +
        "och räddas, och bevittnar till sist själv Jerusalems fall " +
        "(kap. 37-39). Denna sammanhängande episod är det enda som " +
        "indexeras här; resten av boken är poetisk profetia, inte " +
        "handling.",
      authorship: "Traditionellt Jeremia själv, med hjälp av sin skrivare Baruk (som nämns skriva ner hans ord, Jer. 36). Modern forskning ser boken som redigerad/utvidgad i flera steg efter Jeremias livstid.",
      traditions: "Judendom: en av de \"senare profeterna\" (Nevi'im), traditionellt även tillskriven författarskapet till Klagovisorna. Kristendom: Jeremias lidande och orättvisa fängslande läses ofta som en förebild till Kristi lidande. Islam: ingen entydig motsvarighet, men vissa muslimska traditioner kopplar honom till en obenämnd profet i Koranen (sura 2:259).",
    },
  });
  console.log("Seedat Jeremia: 1 story.");

  // --- Josua — Jeriko murar faller ---------------------------------------
  // NY 2026-08-27, se README Fas 45: fortsätter listan över "starka
  // kandidater" bland de ännu otäckta böckerna. Josuas erövring av Jeriko
  // (kap. 6) är den mest kända enskilda episoden i boken.
  const joshuaBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "joshua" } },
    update: {},
    create: { corpusId: bible.id, slug: "joshua", name: "Josua", order: 17, testament: "old" },
  });
  const joshuaChar = await prisma.character.upsert({ where: { slug: "joshua" }, update: {}, create: { slug: "joshua", name: "Josua" } });
  const jerichoStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: joshuaBook.id, slug: "battle-of-jericho" } },
    update: { title: "Jerikos murar faller", startRef: "Joshua 6:1", endRef: "Joshua 6:27", orderInBook: 1 },
    create: { bookId: joshuaBook.id, slug: "battle-of-jericho", title: "Jerikos murar faller", startRef: "Joshua 6:1", endRef: "Joshua 6:27", orderInBook: 1 },
  });
  await prisma.storyCharacter.upsert({
    where: { storyId_characterId: { storyId: jerichoStory.id, characterId: joshuaChar.id } },
    update: {},
    create: { storyId: jerichoStory.id, characterId: joshuaChar.id },
  });
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: jerichoStory.id, themeId: testingTheme.id } },
    update: {},
    create: { storyId: jerichoStory.id, themeId: testingTheme.id },
  });
  const joshuaCaptions = joshuaCaptionsByCode as Record<string, string[]>;
  for (let fileNum = 1; fileNum <= 9; fileNum++) {
    const path = `/images/joshua/battle-of-jericho/${String(fileNum).padStart(2, "0")}.jpg`;
    const caption = joshuaCaptions["FB_LS_Joshua_Jericho"]?.[fileNum - 1] || null;
    await prisma.storyImage.upsert({
      where: { storyId_order: { storyId: jerichoStory.id, order: fileNum } },
      update: { path, caption, credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/ls-joshua-jericho/" },
      create: { storyId: jerichoStory.id, order: fileNum, path, caption, credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/ls-joshua-jericho/" },
    });
  }
  await prisma.story.update({ where: { id: jerichoStory.id }, data: { thumbnailOrder: 8 } }); // muren rasar, Josua och prästernas trumpeter
  await prisma.book.update({
    where: { id: joshuaBook.id },
    data: {
      description:
        "Erövringen av det utlovade landet under Josuas ledning, efter " +
        "Moses död. Den mest kända enskilda episoden — och den enda som " +
        "indexeras här — är Jerikos fall (kap. 6): Israels folk går runt " +
        "den befästa staden i sju dagar tills murarna rasar, medan " +
        "spionen Rahab och hennes familj skonas för sin hjälp.",
      authorship: "Traditionellt tillskriven Josua själv (eller Pinehas/Eleasar). Modern forskning ser boken som del av det s.k. deuteronomistiska historieverket, sammanställt betydligt senare (ca 600-talet f.Kr. eller senare).",
      traditions: "Judendom: första boken i \"Nevi'im\" (Profeterna), följer direkt efter Toran. Kristendom: Rahab nämns i Nya testamentets släkttavla för Jesus (Matt. 1:5) och som trons föredöme (Hebr. 11:31). Islam: ingen direkt motsvarighet, men Yusha (Josua) omnämns i viss islamisk tradition som Moses efterträdare.",
    },
  });
  console.log("Seedat Josua: 1 story.");

  // --- Andra Samuelsboken — Davids kungadöme --------------------------
  // NY 2026-08-27, se README Fas 46: fortsätter "starka kandidater".
  // Naturlig fortsättning på Första Samuelsboken — Davids uppgång till
  // kung, arkens hemkomst, förbundslöftet, hans stora synd (Batseba) och
  // familjekaoset som följer (Amnon, Tamar, Absaloms uppror och död).
  const samuel2Book = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "2-samuel" } },
    update: {},
    create: { corpusId: bible.id, slug: "2-samuel", name: "Andra Samuelsboken", order: 18, testament: "old" },
  });
  const samuel2CharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "batseba", name: "Batseba" },
    { slug: "natan", name: "Natan" },
    { slug: "uria", name: "Uria" },
    { slug: "absalom", name: "Absalom" },
    { slug: "amnon", name: "Amnon" },
    // Egen slug eftersom "tamar" redan pekar på Judas sonhustru i Genesis
    // 38 — samma namn, olika person.
    { slug: "tamar-davids-dotter", name: "Tamar (Davids dotter)" },
    { slug: "mikal", name: "Mikal" },
    { slug: "joab", name: "Joab" },
  ];
  const samuel2Characters: Record<string, { id: string }> = {};
  for (const c of samuel2CharacterDefs) {
    samuel2Characters[c.slug] = await prisma.character.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  // David, Jonatan och Saul återanvänds från Första Samuelsboken-avsnittet.

  type Samuel2StoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const samuel2Stories: Samuel2StoryDef[] = [
    {
      slug: "davids-lament",
      title: "David sörjer Saul och Jonatan",
      startRef: "2 Samuel 1:1", endRef: "2 Samuel 1:27",
      orderInBook: 1,
      characterSlugs: ["david", "saul", "jonatan"],
      themeSlugs: ["hierarchy"],
    },
    {
      slug: "ark-to-jerusalem-david-king",
      title: "David blir kung — arken förs till Jerusalem",
      startRef: "2 Samuel 5:1", endRef: "2 Samuel 6:23",
      orderInBook: 2,
      characterSlugs: ["david", "mikal"],
      themeSlugs: ["hierarchy", "covenant"],
    },
    {
      slug: "davidic-covenant",
      title: "Guds förbund med David",
      startRef: "2 Samuel 7:1", endRef: "2 Samuel 7:29",
      orderInBook: 3,
      characterSlugs: ["david", "natan"],
      themeSlugs: ["covenant"],
    },
    {
      slug: "david-and-bathsheba",
      title: "David och Batseba",
      startRef: "2 Samuel 11:1", endRef: "2 Samuel 12:25",
      orderInBook: 4,
      characterSlugs: ["david", "batseba", "uria", "natan", "joab"],
      themeSlugs: ["deception"],
    },
    {
      // Sträcker sig över Amnon & Tamar (13) fram till Absaloms död (18) —
      // samma mönster som "Josef och hans bröder": EN sammanhängande
      // familjetragedi/uppror, inte uppdelad efter kapitelgräns.
      slug: "absaloms-rebellion",
      title: "Absaloms uppror",
      startRef: "2 Samuel 13:1", endRef: "2 Samuel 18:33",
      orderInBook: 5,
      characterSlugs: ["david", "absalom", "amnon", "tamar-davids-dotter", "joab"],
      themeSlugs: ["sibling-rivalry", "chaos-order"],
    },
  ];

  for (const s of samuel2Stories) {
    const storyData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: samuel2Book.id, slug: s.slug } },
      update: storyData,
      create: { bookId: samuel2Book.id, slug: s.slug, ...storyData },
    });
    for (const charSlug of s.characterSlugs) {
      const character = samuel2Characters[charSlug] ?? samuelCharacters[charSlug];
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: character.id } },
        update: {},
        create: { storyId: story.id, characterId: character.id },
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

  const samuel2Captions = samuel2CaptionsByCode as Record<string, string[]>;
  const samuel2ImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "ark-to-jerusalem-david-king", code: "FB_David_Ark", count: 19, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/david-ark/" },
    { storySlug: "david-and-bathsheba", code: "FB_David_Bathsheba", count: 20, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/david-bathsheba/" },
    { storySlug: "absaloms-rebellion", code: "FB_David_Absalom", count: 25, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://freebibleimages.org/illustrations/david-absalom/" },
  ];
  for (const set of samuel2ImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: samuel2Book.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/2-samuel/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = samuel2Captions[set.code]?.[fileNum - 1] || null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }
  // davids-lament och davidic-covenant: inget passande AI-tillåtet bildset
  // hittat — förblir ren text (samma mönster som Höga Visan/Nadab-Abihu).
  const samuel2Thumbnails: Record<string, number> = {
    "ark-to-jerusalem-david-king": 8, // David dansar inför arken
    "david-and-bathsheba": 15, // Natan: "Du är den mannen"
    "absaloms-rebellion": 19, // Absaloms hår fastnar i trädet
  };
  for (const [slug, order] of Object.entries(samuel2Thumbnails)) {
    await prisma.story.updateMany({ where: { bookId: samuel2Book.id, slug }, data: { thumbnailOrder: order } });
  }

  await prisma.book.update({
    where: { id: samuel2Book.id },
    data: {
      description:
        "Davids regeringstid — från triumf till familjekatastrof. Boken " +
        "följer honom från kröningen och arkens hemkomst till Jerusalem, " +
        "via Guds stora löfte om en evig kungaätt, till hans värsta " +
        "svaghet (Batseba och Uria) och det kaos som sedan sväljer hans " +
        "egen familj (Amnon, Tamar, Absaloms uppror och död).",
      authorship: "Okänd författare — troligen samma deuteronomistiska historieverk som Första Samuelsboken, sammanställt/redigerat under eller efter den babyloniska fångenskapen, men byggt på äldre källor (bl.a. en trolig \"tronföljdsberättelse\", kap. 9-20).",
      traditions: "Judendom: del av \"Nevi'im\" (de tidigare profeterna). Kristendom: Guds löfte till David (kap. 7) om en evig tron läses som en messiansk profetia uppfylld i Jesus (jfr Luk. 1:32-33). Islam: Dawud (David) är en erkänd profet och kung i Koranen, känd för sin visdom och sin psalmbok (Zabur).",
    },
  });
  console.log(`Seedat Andra Samuelsboken: ${samuel2Stories.length} stories.`);

  // --- Första Konungaboken — Salomos vishet, templet, Elia ------------
  // NY 2026-08-27, se README Fas 47: fortsätter "starka kandidater".
  // Salomos höjdpunkter (vishet, templet) och Elia-cykelns två mest
  // kända episoder (Karmel, Horeb). Drottningen av Saba (kap. 10) och
  // rikets splittring (kap. 11-12) uteslutna — inget AI-tillåtet bildset
  // hittat för det förra, lägre narrativ prioritet för det senare.
  const kings1Book = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "1-kings" } },
    update: {},
    create: { corpusId: bible.id, slug: "1-kings", name: "Första Konungaboken", order: 19, testament: "old" },
  });
  const kings1CharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "solomon", name: "Salomo" },
    { slug: "elijah", name: "Elia" },
    { slug: "ahab", name: "Ahab" },
  ];
  const kings1Characters: Record<string, { id: string }> = {};
  for (const c of kings1CharacterDefs) {
    kings1Characters[c.slug] = await prisma.character.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  type Kings1StoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const kings1Stories: Kings1StoryDef[] = [
    {
      slug: "solomons-wisdom",
      title: "Salomos vishet",
      startRef: "1 Kings 3:1", endRef: "1 Kings 3:28",
      orderInBook: 1,
      characterSlugs: ["solomon"],
      themeSlugs: ["hierarchy"],
    },
    {
      slug: "temple-built-and-dedicated",
      title: "Templet byggs och invigs",
      startRef: "1 Kings 8:1", endRef: "1 Kings 8:66",
      orderInBook: 2,
      characterSlugs: ["solomon"],
      themeSlugs: ["covenant", "sacrifice"],
    },
    {
      slug: "elijah-and-the-prophets-of-baal",
      title: "Elia och Baals profeter",
      startRef: "1 Kings 17:1", endRef: "1 Kings 18:46",
      orderInBook: 3,
      characterSlugs: ["elijah", "ahab"],
      themeSlugs: ["testing-of-faith", "chaos-order"],
    },
    {
      slug: "elijah-at-horeb",
      title: "Elia vid Horeb",
      startRef: "1 Kings 19:1", endRef: "1 Kings 19:21",
      orderInBook: 4,
      characterSlugs: ["elijah"],
      themeSlugs: ["testing-of-faith"],
    },
  ];

  for (const s of kings1Stories) {
    const storyData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: kings1Book.id, slug: s.slug } },
      update: storyData,
      create: { bookId: kings1Book.id, slug: s.slug, ...storyData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: kings1Characters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: kings1Characters[charSlug].id },
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

  const kings1Captions = kings1CaptionsByCode as Record<string, string[]>;
  const kings1ImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "solomons-wisdom", code: "FB_LS_Solomon_Wisdom", count: 9, credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/ls-solomon-wise/" },
    { storySlug: "temple-built-and-dedicated", code: "FB_Solomon_Temple", count: 17, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/solomon-temple/" },
    { storySlug: "elijah-and-the-prophets-of-baal", code: "FB_LS_Elijah_Baal", count: 8, credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/ls-elijah-baal/" },
    { storySlug: "elijah-at-horeb", code: "FB_Elijah_Horeb", count: 23, credit: "FreeBibleimages.org, CC BY-SA 4.0", creditUrl: "https://freebibleimages.org/photos/elijah-horeb/" },
  ];
  for (const set of kings1ImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: kings1Book.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/1-kings/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = kings1Captions[set.code]?.[fileNum - 1] || null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }
  const kings1Thumbnails: Record<string, number> = {
    "solomons-wisdom": 6, // mödrarna reagerar på Salomos dom
    "temple-built-and-dedicated": 12, // molnskyn fyller templet
    "elijah-and-the-prophets-of-baal": 7, // elden faller över Elias altare
    "elijah-at-horeb": 20, // Elia döljer ansiktet vid grottans mynning
  };
  for (const [slug, order] of Object.entries(kings1Thumbnails)) {
    await prisma.story.updateMany({ where: { bookId: kings1Book.id, slug }, data: { thumbnailOrder: order } });
  }

  await prisma.book.update({
    where: { id: kings1Book.id },
    data: {
      description:
        "Salomos glansfulla start — visheten, templet — och sedan Elia-" +
        "cykelns två mest kända episoder: den öppna tävlingen mot Baals " +
        "profeter på berget Karmel, och den tysta, sakta susningen vid " +
        "Horeb som följer. Rikets splittring efter Salomo (kap. 11-12) " +
        "och Drottningen av Saba (kap. 10) är inte indexerade här ännu.",
      authorship: "Okänd författare, del av det deuteronomistiska historieverket — sammanställt/redigerat under eller efter den babyloniska fångenskapen (ca 500-talet f.Kr.), byggt på äldre kungliga krönikor och profetberättelser.",
      traditions: "Judendom: del av \"Nevi'im\" (de tidigare profeterna). Kristendom: Elia förknippas med Johannes Döparen (Matt. 11:14) och uppträder tillsammans med Mose vid Jesu förklaring på berget (Matt. 17:3). Islam: Sulayman (Salomo) och Ilyas (Elia) är båda erkända profeter i Koranen — Sulayman berömd för sin visdom och makt över naturen/andarna.",
    },
  });
  console.log(`Seedat Första Konungaboken: ${kings1Stories.length} stories.`);

  // --- Fjärde Moseboken (Numeri) — ökenvandringens uppror och under ---
  // NY 2026-08-27, se README Fas 48: Fas 1 av 7 i den överenskomna
  // planen. Fyra berättelser om ökenvandringens 40 år: spejarna som
  // förlorar folkets tro, Koras uppror (ren text — inget AI-tillåtet
  // bildset hittat), kopparormen, och Bileam och hans åsna.
  const numbersBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "numbers" } },
    update: {},
    create: { corpusId: bible.id, slug: "numbers", name: "Fjärde Moseboken", order: 20, testament: "old" },
  });
  const numbersCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "caleb", name: "Kaleb" },
    { slug: "korah", name: "Kora" },
    { slug: "balaam", name: "Bileam" },
    // Mose, Aron och Josua finns redan (Exodus/Leviticus/Josua-avsnitten)
    // — samma slug här återanvänder och länkar ihop dem, upsert no-opar
    // på redan satta fält.
    { slug: "mose", name: "Mose" },
    { slug: "aron", name: "Aron" },
    { slug: "joshua", name: "Josua" },
  ];
  const numbersCharacters: Record<string, { id: string }> = {};
  for (const c of numbersCharacterDefs) {
    numbersCharacters[c.slug] = await prisma.character.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  type NumbersStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const numbersStories: NumbersStoryDef[] = [
    {
      slug: "twelve-spies",
      title: "Spejarna i Kanaan",
      startRef: "Numbers 13:1", endRef: "Numbers 14:45",
      orderInBook: 1,
      characterSlugs: ["mose", "aron", "caleb", "joshua"],
      themeSlugs: ["testing-of-faith", "chaos-order"],
    },
    {
      slug: "korahs-rebellion",
      title: "Koras uppror",
      startRef: "Numbers 16:1", endRef: "Numbers 16:35",
      orderInBook: 2,
      characterSlugs: ["mose", "aron", "korah"],
      themeSlugs: ["hierarchy", "chaos-order"],
    },
    {
      slug: "bronze-serpent",
      title: "Kopparormen",
      startRef: "Numbers 21:4", endRef: "Numbers 21:9",
      orderInBook: 3,
      characterSlugs: ["mose"],
      themeSlugs: ["testing-of-faith"],
    },
    {
      slug: "balaams-donkey",
      title: "Bileam och åsnan",
      startRef: "Numbers 22:1", endRef: "Numbers 24:25",
      orderInBook: 4,
      characterSlugs: ["balaam"],
      themeSlugs: ["testing-of-faith"],
    },
  ];

  for (const s of numbersStories) {
    const storyData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: numbersBook.id, slug: s.slug } },
      update: storyData,
      create: { bookId: numbersBook.id, slug: s.slug, ...storyData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: numbersCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: numbersCharacters[charSlug].id },
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

  const numbersCaptions = numbersCaptionsByCode as Record<string, string[]>;
  const numbersImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "twelve-spies", code: "FB_Moses_Spies", count: 22, credit: "FreeBibleimages.org, CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/moses-spies/" },
    { storySlug: "bronze-serpent", code: "FB_RG_Moses_Snake", count: 9, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-moses-snake/" },
    { storySlug: "balaams-donkey", code: "FB_RG_Balaam", count: 11, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-balaam/" },
  ];
  for (const set of numbersImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: numbersBook.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/numbers/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = numbersCaptions[set.code]?.[fileNum - 1] || null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }
  // korahs-rebellion: ren text — inget AI-tillåtet bildset hittat.
  const numbersThumbnails: Record<string, number> = {
    "twelve-spies": 12, // Kaleb tystar folket: "Vi klarar det"
    "bronze-serpent": 6, // Mose reser kopparormen på stången
    "balaams-donkey": 7, // åsnan talar
  };
  for (const [slug, order] of Object.entries(numbersThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: numbersBook.id, slug }, data: { thumbnailOrder: order } });
  }

  await prisma.book.update({
    where: { id: numbersBook.id },
    data: {
      description:
        "De fyrtio årens ökenvandring mellan Sinai och det utlovade " +
        "landet — en lång kedja av uppror, prövningar och under. Fyra " +
        "höjdpunkter indexeras här: spejarnas svek mot folkets tro, " +
        "Koras uppror mot Mose och Arons ledarskap, kopparormen som " +
        "botar ormbett (och som Jesus själv senare jämför sig med, Joh. " +
        "3:14), och den hedniske siaren Bileam som mot sin vilja bara " +
        "kan välsigna Israel.",
      authorship: "Traditionellt tillskriven Mose (ca 1200-talet f.Kr.) — moderna forskare ser den som en sammanvävning av flera äldre källor, slutredigerad betydligt senare tillsammans med de övriga Moseböckerna.",
      traditions: "Judendom: fjärde boken i Toran (hebreiska: \"Bemidbar\", \"I öknen\"). Kristendom: kopparormen (21:4-9) läses som en förebild till korsfästelsen (Joh. 3:14-15); Bileams profetia om \"en stjärna som träder fram ur Jakob\" (24:17) tolkas ofta messianskt. Islam: Balaam (Bileam) omnämns indirekt i Koranen (sura 7:175-176) som varnande exempel på en man som fick kunskap men vände sig bort från den.",
    },
  });
  console.log(`Seedat Fjärde Moseboken: ${numbersStories.length} stories.`);

  // --- Domarboken — Debora, Gideon, Simson -----------------------------
  // NY 2026-08-27, se README Fas 49: Fas 2 av 7 i planen. De tre mest
  // kända domarna: Debora och Barak (med Jael), Gideon (fläcken, de 300
  // männen), och Simson (från födsel till Delila och tempelfallet).
  const judgesBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "judges" } },
    update: {},
    create: { corpusId: bible.id, slug: "judges", name: "Domarboken", order: 21, testament: "old" },
  });
  const judgesCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "deborah", name: "Debora" },
    { slug: "barak", name: "Barak" },
    { slug: "jael", name: "Jael" },
    { slug: "gideon", name: "Gideon" },
    { slug: "samson", name: "Simson" },
  ];
  const judgesCharacters: Record<string, { id: string }> = {};
  for (const c of judgesCharacterDefs) {
    judgesCharacters[c.slug] = await prisma.character.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  type JudgesStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const judgesStories: JudgesStoryDef[] = [
    {
      slug: "deborah-and-barak",
      title: "Debora, Barak och Jael",
      startRef: "Judges 4:1", endRef: "Judges 4:24",
      orderInBook: 1,
      characterSlugs: ["deborah", "barak", "jael"],
      themeSlugs: ["testing-of-faith", "hierarchy"],
    },
    {
      slug: "gideon",
      title: "Gideon och de 300 männen",
      startRef: "Judges 6:1", endRef: "Judges 8:28",
      orderInBook: 2,
      characterSlugs: ["gideon"],
      themeSlugs: ["testing-of-faith", "chaos-order"],
    },
    {
      slug: "samson",
      title: "Simson",
      startRef: "Judges 13:1", endRef: "Judges 16:31",
      orderInBook: 3,
      characterSlugs: ["samson"],
      themeSlugs: ["self-consciousness", "testing-of-faith"],
    },
  ];

  for (const s of judgesStories) {
    const storyData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: judgesBook.id, slug: s.slug } },
      update: storyData,
      create: { bookId: judgesBook.id, slug: s.slug, ...storyData },
    });
    for (const charSlug of s.characterSlugs) {
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: judgesCharacters[charSlug].id } },
        update: {},
        create: { storyId: story.id, characterId: judgesCharacters[charSlug].id },
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

  const judgesCaptions = judgesCaptionsByCode as Record<string, string[]>;
  // "gideon" delar EN story-mapp mellan två käll-set (fläcken + striden),
  // filerna döptes om till löpande order vid nedladdning (samma mönster
  // som Josefs tre bildset i Genesis) — path bygger alltså på `order`.
  const judgesImageSets: Array<{
    storySlug: string; code: string; fileStart: number; fileEnd: number; orderStart: number;
    renamedToOrder?: boolean; credit: string; creditUrl: string;
  }> = [
    { storySlug: "deborah-and-barak", code: "FB_Deborah_Barak", fileStart: 1, fileEnd: 20, orderStart: 1, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/deborah-barak/" },
    { storySlug: "gideon", code: "FB_Gideon_Fleece", fileStart: 1, fileEnd: 19, orderStart: 1, renamedToOrder: true, credit: "FreeBibleimages.org, CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/gideon-fleece/" },
    { storySlug: "gideon", code: "FB_Gideon_Midianites", fileStart: 1, fileEnd: 12, orderStart: 20, renamedToOrder: true, credit: "FreeBibleimages.org, CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/gideon-midianites/" },
    { storySlug: "samson", code: "FB_LS_Samson", fileStart: 1, fileEnd: 9, orderStart: 1, credit: "Lambsongs / Jill Kemp & Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/ls-samson/" },
  ];
  for (const set of judgesImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: judgesBook.id, slug: set.storySlug } });
    for (let fileNum = set.fileStart; fileNum <= set.fileEnd; fileNum++) {
      const order = set.orderStart + (fileNum - set.fileStart);
      const fileLabel = set.renamedToOrder ? order : fileNum;
      const path = `/images/judges/${set.storySlug}/${String(fileLabel).padStart(2, "0")}.jpg`;
      const caption = judgesCaptions[set.code]?.[fileNum - 1] || null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }
  const judgesThumbnails: Record<string, number> = {
    "deborah-and-barak": 13, // Sisera rusar mot striden i sin vagn
    gideon: 8, // elden flammar upp ur klippan
    samson: 3, // Simson dräper lejonet
  };
  for (const [slug, order] of Object.entries(judgesThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: judgesBook.id, slug }, data: { thumbnailOrder: order } });
  }

  const portraitDeborah = await prisma.storyImage.findUniqueOrThrow({
    where: { storyId_order: { storyId: (await prisma.story.findFirstOrThrow({ where: { bookId: judgesBook.id, slug: "deborah-and-barak" } })).id, order: 8 } },
  });
  await prisma.character.update({
    where: { slug: "deborah" },
    data: { portraitPath: portraitDeborah.path, portraitCredit: portraitDeborah.credit, portraitCreditUrl: portraitDeborah.creditUrl },
  });

  await prisma.book.update({
    where: { id: judgesBook.id },
    data: {
      description:
        "Cykeln som upprepas om och om igen mellan Josuas död och " +
        "kungatidens början: folket avfaller från Gud, förtrycks av " +
        "grannfolk, ropar om hjälp, och Gud reser upp en domare som " +
        "räddar dem — tills domaren dör och cykeln börjar om. Tre av de " +
        "mest kända domarna indexeras här: Debora och Barak (med Jaels " +
        "dramatiska tältplugg), Gideon (fläcken, de 300 männen mot en " +
        "övermäktig här), och Simson (den starke mannen med den enda " +
        "svagheten).",
      authorship: "Okänd författare, del av det deuteronomistiska historieverket — sammanställt/redigerat betydligt senare (troligen under kungatiden eller efter), byggt på äldre muntliga hjältesägner och lokala traditioner.",
      traditions: "Judendom: del av \"Nevi'im\" (de tidigare profeterna). Kristendom: Debora, Barak, Gideon och Simson nämns alla i \"trons hjältegalleri\" (Hebr. 11:32) trots sina brister. Islam: ingen direkt motsvarighet till någon av de tre, men perioden mellan Moses och kungarna omnämns i allmänna termer i islamisk tradition.",
    },
  });
  console.log(`Seedat Domarboken: ${judgesStories.length} stories.`);

  // --- Första Konungaboken, forts. — Saba och rikets splittring --------
  // NY 2026-08-27, se README Fas 50: Fas 3 av 7 i planen — färdigställer
  // Första Konungaboken (Fas 47 lämnade dessa två medvetet därhän).
  const jeroboamChar = await prisma.character.upsert({ where: { slug: "jeroboam" }, update: {}, create: { slug: "jeroboam", name: "Jerobeam" } });
  const rehoboamChar = await prisma.character.upsert({ where: { slug: "rehoboam" }, update: {}, create: { slug: "rehoboam", name: "Rehabeam" } });

  const shebaStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: kings1Book.id, slug: "queen-of-sheba" } },
    update: { title: "Drottningen av Saba besöker Salomo", startRef: "1 Kings 10:1", endRef: "1 Kings 10:13", orderInBook: 5 },
    create: { bookId: kings1Book.id, slug: "queen-of-sheba", title: "Drottningen av Saba besöker Salomo", startRef: "1 Kings 10:1", endRef: "1 Kings 10:13", orderInBook: 5 },
  });
  await prisma.storyCharacter.upsert({
    where: { storyId_characterId: { storyId: shebaStory.id, characterId: kings1Characters["solomon"].id } },
    update: {},
    create: { storyId: shebaStory.id, characterId: kings1Characters["solomon"].id },
  });
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: shebaStory.id, themeId: themes["hierarchy"].id } },
    update: {},
    create: { storyId: shebaStory.id, themeId: themes["hierarchy"].id },
  });
  // Ren text — inget AI-tillåtet bildset hittat (närmaste träff, "Solomon
  // the Temple builder", har AI-adaptationer förbjudna, se Fas 47).

  const kingdomSplitStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: kings1Book.id, slug: "kingdom-divided" } },
    update: { title: "Rikets splittring", startRef: "1 Kings 11:1", endRef: "1 Kings 12:33", orderInBook: 6 },
    create: { bookId: kings1Book.id, slug: "kingdom-divided", title: "Rikets splittring", startRef: "1 Kings 11:1", endRef: "1 Kings 12:33", orderInBook: 6 },
  });
  for (const charSlug of ["solomon"] as const) {
    await prisma.storyCharacter.upsert({
      where: { storyId_characterId: { storyId: kingdomSplitStory.id, characterId: kings1Characters[charSlug].id } },
      update: {},
      create: { storyId: kingdomSplitStory.id, characterId: kings1Characters[charSlug].id },
    });
  }
  for (const char of [jeroboamChar, rehoboamChar]) {
    await prisma.storyCharacter.upsert({
      where: { storyId_characterId: { storyId: kingdomSplitStory.id, characterId: char.id } },
      update: {},
      create: { storyId: kingdomSplitStory.id, characterId: char.id },
    });
  }
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: kingdomSplitStory.id, themeId: chaosOrderTheme.id } },
    update: {},
    create: { storyId: kingdomSplitStory.id, themeId: chaosOrderTheme.id },
  });
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: kingdomSplitStory.id, themeId: themes["hierarchy"].id } },
    update: {},
    create: { storyId: kingdomSplitStory.id, themeId: themes["hierarchy"].id },
  });

  const kings1Captions2 = kings1Captions2ByCode as Record<string, string[]>;
  for (let fileNum = 1; fileNum <= 25; fileNum++) {
    const path = `/images/1-kings/kingdom-divided/${String(fileNum).padStart(2, "0")}.jpg`;
    const caption = kings1Captions2["FB_Rehoboam_Jeroboam"]?.[fileNum - 1] || null;
    await prisma.storyImage.upsert({
      where: { storyId_order: { storyId: kingdomSplitStory.id, order: fileNum } },
      update: { path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/rehoboam-jeroboam/" },
      create: { storyId: kingdomSplitStory.id, order: fileNum, path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/rehoboam-jeroboam/" },
    });
  }
  await prisma.story.update({ where: { id: kingdomSplitStory.id }, data: { thumbnailOrder: 8 } }); // Ahia river sin mantel i tolv delar

  await prisma.book.update({
    where: { id: kings1Book.id },
    data: {
      description:
        "Salomos glansfulla start — visheten, templet, Drottningen av " +
        "Sabas besök — vänder mot slutet: hans utländska hustrur leder " +
        "honom bort från Gud, riket rivs itu efter hans död, och Elia-" +
        "cykelns två mest kända episoder (Karmel, Horeb) utspelar sig " +
        "mot den splittringens bakgrund.",
      authorship: "Okänd författare, del av det deuteronomistiska historieverket — sammanställt/redigerat under eller efter den babyloniska fångenskapen (ca 500-talet f.Kr.), byggt på äldre kungliga krönikor och profetberättelser.",
      traditions: "Judendom: del av \"Nevi'im\" (de tidigare profeterna). Kristendom: Elia förknippas med Johannes Döparen (Matt. 11:14) och uppträder tillsammans med Mose vid Jesu förklaring på berget (Matt. 17:3); Jesus nämner Drottningen av Saba som ett föredöme (Matt. 12:42). Islam: Sulayman (Salomo) och Ilyas (Elia) är båda erkända profeter i Koranen — mötet med drottningen av Saba (Bilqis) återges utförligt i sura 27 (an-Naml).",
    },
  });
  console.log("Seedat Första Konungaboken, del 2: 2 stories till (Saba + rikets splittring).");

  // --- Andra Konungaboken — Elia/Elisa, Naaman, Hiskia och Sanherib ----
  // NY 2026-08-27, se README Fas 51: Fas 4 av 7 i planen. Elias
  // himmelsfärd (eldvagnen), Elisa botar Naaman, och Hiskia/Sanherib —
  // den tråd från Jesaja som medvetet sparades hit (Fas 47) för att
  // slippa dubblettäckning. Jerusalems SLUTGILTIGA fall (kap. 24-25)
  // täcks redan via Jeremia (Fas 44) — indexeras inte igen här.
  const kings2Book = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "2-kings" } },
    update: {},
    create: { corpusId: bible.id, slug: "2-kings", name: "Andra Konungaboken", order: 22, testament: "old" },
  });
  const kings2CharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "elisha", name: "Elisa" },
    { slug: "naaman", name: "Naaman" },
    { slug: "hezekiah", name: "Hiskia" },
    { slug: "sennacherib", name: "Sanherib" },
    // Elia, Josua-koppling ej relevant här — men Jesaja nämns i Hiskia-
    // berättelsen och kan bli en egen karaktär när/om Jesaja indexeras.
  ];
  const kings2Characters: Record<string, { id: string }> = {};
  for (const c of kings2CharacterDefs) {
    kings2Characters[c.slug] = await prisma.character.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  // Elia återanvänds från Första Konungaboken-avsnittet.

  type Kings2StoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const kings2Stories: Kings2StoryDef[] = [
    {
      slug: "elijahs-ascension",
      title: "Elias himmelsfärd",
      startRef: "2 Kings 2:1", endRef: "2 Kings 2:18",
      orderInBook: 1,
      characterSlugs: ["elijah", "elisha"],
      themeSlugs: ["hierarchy", "testing-of-faith"],
    },
    {
      slug: "naaman-healed",
      title: "Naaman botas",
      startRef: "2 Kings 5:1", endRef: "2 Kings 5:27",
      orderInBook: 2,
      characterSlugs: ["elisha", "naaman"],
      themeSlugs: ["testing-of-faith", "deception"],
    },
    {
      slug: "hezekiah-and-sennacherib",
      title: "Hiskia och Sanherib",
      startRef: "2 Kings 18:13", endRef: "2 Kings 19:37",
      orderInBook: 3,
      characterSlugs: ["hezekiah", "sennacherib"],
      themeSlugs: ["testing-of-faith", "chaos-order"],
    },
  ];

  for (const s of kings2Stories) {
    const storyData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: kings2Book.id, slug: s.slug } },
      update: storyData,
      create: { bookId: kings2Book.id, slug: s.slug, ...storyData },
    });
    for (const charSlug of s.characterSlugs) {
      const character = kings2Characters[charSlug] ?? kings1Characters[charSlug];
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: character.id } },
        update: {},
        create: { storyId: story.id, characterId: character.id },
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

  const kings2Captions = kings2CaptionsByCode as Record<string, string[]>;
  const kings2ImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "elijahs-ascension", code: "FB_Elijah_Chariot", count: 14, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/elijah-chariot/" },
    { storySlug: "naaman-healed", code: "FB_Elisha_Naaman", count: 17, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/elisha-naaman/" },
    { storySlug: "hezekiah-and-sennacherib", code: "FB_Hezekiah_Assyrians", count: 22, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/hezekiah-assyrians/" },
  ];
  for (const set of kings2ImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: kings2Book.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/2-kings/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = kings2Captions[set.code]?.[fileNum - 1] || null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }
  const kings2Thumbnails: Record<string, number> = {
    "elijahs-ascension": 10, // vagnen av eld
    "naaman-healed": 13, // Naaman botad, sjunde doppningen
    "hezekiah-and-sennacherib": 17, // Hiskia breder ut brevet inför Gud
  };
  for (const [slug, order] of Object.entries(kings2Thumbnails)) {
    await prisma.story.updateMany({ where: { bookId: kings2Book.id, slug }, data: { thumbnailOrder: order } });
  }

  await prisma.book.update({
    where: { id: kings2Book.id },
    data: {
      description:
        "Fortsättningen på Första Konungaboken genom det delade rikets " +
        "historia fram till den babyloniska fångenskapen. Tre " +
        "höjdpunkter indexeras här: Elias dramatiska himmelsfärd i en " +
        "vagn av eld, Elisas helande av den arameiske härföraren Naaman, " +
        "och kung Hiskias tro sätts på prov när Assyriens här belägrar " +
        "Jerusalem. Jerusalems SLUTGILTIGA fall (kap. 24-25, under kung " +
        "Sidkia) täcks redan via Jeremia — indexeras inte igen här.",
      authorship: "Okänd författare, del av det deuteronomistiska historieverket — sammanställt/redigerat under eller efter den babyloniska fångenskapen (ca 500-talet f.Kr.), byggt på äldre kungliga krönikor och profetberättelser.",
      traditions: "Judendom: del av \"Nevi'im\" (de tidigare profeterna). Kristendom: Elias himmelsfärd utan att dö läses ofta tillsammans med Henoks (1 Mos. 5:24); Jesus jämför sig själv med Elisas helande av Naaman, en icke-israelit (Luk. 4:27). Islam: al-Yasa (Elisa) omnämns i Koranen som en av de rättfärdiga profeterna (sura 38:48).",
    },
  });
  console.log(`Seedat Andra Konungaboken: ${kings2Stories.length} stories.`);

  // --- Nehemja — murbygget ------------------------------------------
  // NY 2026-08-27, se README Fas 52: Fas 5 av 7 i planen. En enda,
  // sammanhängande story (kap. 1-6): Nehemja hör nyheten, ber, får
  // kungens tillstånd, reser till Jerusalem och bygger upp muren trots
  // Sanballats och Tobias motstånd — färdig på 52 dagar.
  const nehemiahBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "nehemiah" } },
    update: {},
    create: { corpusId: bible.id, slug: "nehemiah", name: "Nehemja", order: 23, testament: "old" },
  });
  const nehemiahChar = await prisma.character.upsert({ where: { slug: "nehemiah" }, update: {}, create: { slug: "nehemiah", name: "Nehemja" } });
  const wallStory = await prisma.story.upsert({
    where: { bookId_slug: { bookId: nehemiahBook.id, slug: "nehemiah-rebuilds-the-wall" } },
    update: { title: "Nehemja bygger upp muren", startRef: "Nehemiah 1:1", endRef: "Nehemiah 6:19", orderInBook: 1 },
    create: { bookId: nehemiahBook.id, slug: "nehemiah-rebuilds-the-wall", title: "Nehemja bygger upp muren", startRef: "Nehemiah 1:1", endRef: "Nehemiah 6:19", orderInBook: 1 },
  });
  await prisma.storyCharacter.upsert({
    where: { storyId_characterId: { storyId: wallStory.id, characterId: nehemiahChar.id } },
    update: {},
    create: { storyId: wallStory.id, characterId: nehemiahChar.id },
  });
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: wallStory.id, themeId: themes["testing-of-faith"].id } },
    update: {},
    create: { storyId: wallStory.id, themeId: themes["testing-of-faith"].id },
  });
  await prisma.storyTheme.upsert({
    where: { storyId_themeId: { storyId: wallStory.id, themeId: chaosOrderTheme.id } },
    update: {},
    create: { storyId: wallStory.id, themeId: chaosOrderTheme.id },
  });
  const nehemiahCaptions = nehemiahCaptionsByCode as Record<string, string[]>;
  const nehemiahImageSets: Array<{ code: string; count: number; orderStart: number }> = [
    { code: "FB_Nehemiah_Part_1", count: 16, orderStart: 1 },
    { code: "FB_Nehemiah_Part_2", count: 23, orderStart: 17 },
  ];
  for (const set of nehemiahImageSets) {
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const order = set.orderStart + (fileNum - 1);
      const path = `/images/nehemiah/nehemiah-rebuilds-the-wall/${String(order).padStart(2, "0")}.jpg`;
      const caption = nehemiahCaptions[set.code]?.[fileNum - 1] || null;
      const creditUrl = set.code === "FB_Nehemiah_Part_1"
        ? "https://www.freebibleimages.org/illustrations/nehemiah-1/"
        : "https://www.freebibleimages.org/illustrations/nehemiah-2/";
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: wallStory.id, order } },
        update: { path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl },
        create: { storyId: wallStory.id, order, path, caption, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl },
      });
    }
  }
  await prisma.story.update({ where: { id: wallStory.id }, data: { thumbnailOrder: 27 } }); // halva bygger, halva bevakar med vapen

  await prisma.book.update({
    where: { id: nehemiahBook.id },
    data: {
      description:
        "En enda, sammanhängande berättelse (kap. 1-6): Nehemja, judisk " +
        "munskänk åt den persiske kungen, hör att Jerusalems murar " +
        "fortfarande ligger i ruiner generationer efter den babyloniska " +
        "fångenskapen. Han ber, får kungens tillstånd och medel, reser " +
        "till Jerusalem och leder återuppbyggnaden av muren — färdig på " +
        "bara 52 dagar, trots ständigt motstånd, hån och mordkomplotter " +
        "från grannfolkens ledare Sanballat och Tobia. Bokens senare " +
        "kapitel (bl.a. Esras lagläsning, kap. 8) indexeras inte här.",
      authorship: "Traditionellt Nehemja själv (stora delar är skrivna i jag-form, en \"Nehemja-memoar\") — moderna forskare ser boken som sammanställd tillsammans med Esra, av en redaktör som använt Nehemjas egna uppteckningar som källa, ca 400-talet f.Kr.",
      traditions: "Judendom: en av \"Ketuvim\" (Skrifterna), ofta räknad som en enda bok tillsammans med Esra i den judiska traditionen. Kristendom: Nehemja läses ofta som ett föredöme i praktiskt, uthålligt ledarskap under motstånd. Islam: ingen direkt motsvarighet, men återuppbyggnaden av Jerusalem efter fångenskapen omnämns i allmänna termer i viss islamisk historieskrivning.",
    },
  });
  console.log("Seedat Nehemja: 1 story.");

  // --- Apostlagärningarna — pingst, Stefanus, Paulus ------------------
  // NY 2026-08-27, se README Fas 53: Fas 6 av 7 i planen, sista NT-boken
  // i denna omgång. Fyra höjdpunkter: pingstdagen (kyrkans födelse),
  // Stefanus — den förste martyren, Paulus omvändelse på vägen till
  // Damaskus, och Paulus och Silas i fängelset i Filippi. NT-text —
  // endast de "säkra" gudsnamn-mönstren normaliserades automatiskt;
  // varje kvarvarande "Herre"/"Herren" gicks igenom manuellt (två
  // felaktiga automatkonverteringar hittades och rättades, se README).
  const actsBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: bible.id, slug: "acts" } },
    update: {},
    create: { corpusId: bible.id, slug: "acts", name: "Apostlagärningarna", order: 24, testament: "new" },
  });
  const petrusChar = await prisma.character.upsert({ where: { slug: "petrus" }, update: {}, create: { slug: "petrus", name: "Petrus" } });
  const actsCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "stephen", name: "Stefanus" },
    { slug: "paul", name: "Paulus" },
    { slug: "ananias-of-damascus", name: "Ananias (i Damaskus)" },
    { slug: "silas", name: "Silas" },
  ];
  const actsCharacters: Record<string, { id: string }> = {};
  for (const c of actsCharacterDefs) {
    actsCharacters[c.slug] = await prisma.character.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  type ActsStoryDef = {
    slug: string; title: string; startRef: string; endRef: string; orderInBook: number;
    characterSlugs: string[]; themeSlugs: string[];
  };
  const actsStories: ActsStoryDef[] = [
    {
      slug: "pentecost",
      title: "Pingstdagen",
      startRef: "Acts 2:1", endRef: "Acts 2:47",
      orderInBook: 1,
      characterSlugs: ["petrus"],
      themeSlugs: ["chaos-order", "testing-of-faith"],
    },
    {
      slug: "stephen-martyred",
      title: "Stefanus — den förste martyren",
      startRef: "Acts 6:8", endRef: "Acts 7:60",
      orderInBook: 2,
      characterSlugs: ["stephen", "paul"],
      themeSlugs: ["testing-of-faith", "sacrifice"],
    },
    {
      slug: "pauls-conversion",
      title: "Paulus omvändelse",
      startRef: "Acts 9:1", endRef: "Acts 9:31",
      orderInBook: 3,
      characterSlugs: ["paul", "ananias-of-damascus"],
      themeSlugs: ["testing-of-faith", "self-consciousness"],
    },
    {
      slug: "paul-and-silas-in-prison",
      title: "Paulus och Silas i fängelset",
      startRef: "Acts 16:16", endRef: "Acts 16:40",
      orderInBook: 4,
      characterSlugs: ["paul", "silas"],
      themeSlugs: ["testing-of-faith", "chaos-order"],
    },
  ];

  for (const s of actsStories) {
    const storyData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: actsBook.id, slug: s.slug } },
      update: storyData,
      create: { bookId: actsBook.id, slug: s.slug, ...storyData },
    });
    for (const charSlug of s.characterSlugs) {
      const character = charSlug === "petrus" ? petrusChar : actsCharacters[charSlug];
      await prisma.storyCharacter.upsert({
        where: { storyId_characterId: { storyId: story.id, characterId: character.id } },
        update: {},
        create: { storyId: story.id, characterId: character.id },
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

  const actsCaptions = actsCaptionsByCode as Record<string, string[]>;
  const actsImageSets: Array<{ storySlug: string; code: string; count: number; credit: string; creditUrl: string }> = [
    { storySlug: "pentecost", code: "FB_Pentecost", count: 13, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/pentecost/" },
    { storySlug: "stephen-martyred", code: "FB_Stephen_Martyred", count: 18, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/stephen-martyred/" },
    { storySlug: "pauls-conversion", code: "FB_Paul_Conversion", count: 26, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/paul-conversion/" },
    { storySlug: "paul-and-silas-in-prison", code: "FB_Paul_Silas_Prison", count: 12, credit: "Sweet Publishing (freebibleimages.org), CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/paul-silas-prison/" },
  ];
  for (const set of actsImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: actsBook.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const path = `/images/acts/${set.storySlug}/${String(fileNum).padStart(2, "0")}.jpg`;
      const caption = actsCaptions[set.code]?.[fileNum - 1] || null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order: fileNum } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order: fileNum, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }
  const actsThumbnails: Record<string, number> = {
    pentecost: 2, // tungor av eld
    "stephen-martyred": 14, // Stefanus ser himlen öppen
    "pauls-conversion": 5, // ljuset slår ner Saulus
    "paul-and-silas-in-prison": 7, // jordbävningen
  };
  for (const [slug, order] of Object.entries(actsThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: actsBook.id, slug }, data: { thumbnailOrder: order } });
  }

  await prisma.book.update({
    where: { id: actsBook.id },
    data: {
      description:
        "Fortsättningen på Lukasevangeliet (samma författare) — kyrkans " +
        "första år, från den helige Andes utgjutelse på pingstdagen till " +
        "evangeliets spridning från Jerusalem ut i den romerska världen. " +
        "Fyra höjdpunkter indexeras här: pingstdagen, Stefanus (den " +
        "förste martyren), Paulus dramatiska omvändelse på vägen till " +
        "Damaskus, och Paulus och Silas fängelse i Filippi.",
      authorship: "Traditionellt Lukas, samma författare som tredje evangeliet (jfr inledningarna, båda riktade till \"Teofilus\") — troligen en följeslagare till Paulus på delar av hans resor. Moderna forskare daterar den ofta till ca 80-90 e.Kr., någon gång efter Lukasevangeliet.",
      traditions: "Judendom: ingen motsvarighet (kristen text). Kristendom: räknas som den enda historiska skildringen av den tidiga kyrkans första decennier — pingstdagen firas årligen som kyrkans \"födelsedag\". Islam: ingen direkt motsvarighet, men Isa (Jesus) och hans efterföljare omnämns i allmänna termer i Koranen.",
    },
  });
  console.log(`Seedat Apostlagärningarna: ${actsStories.length} stories.`);

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
    { slug: "sippora", name: "Sippora" },
    { slug: "josua", name: "Josua" },
    { slug: "besalel", name: "Besalel" },
    { slug: "jetro", name: "Jetro" },
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
    // NY 2026-08-23: fyller luckan mellan Mose i vassen och den brinnande
    // busken — Mose dödar egyptiern, flyr, och möter Sippora i Midjan.
    { slug: "moses-flees-to-midian", title: "Mose dödar egyptiern och flyr till Midjan", startRef: "Exodus 2:11", endRef: "Exodus 2:22", orderInBook: 2, characterSlugs: ["mose", "sippora"], themeSlugs: [] },
    { slug: "burning-bush", title: "Den brinnande busken", startRef: "Exodus 3:1", endRef: "Exodus 4:17", orderInBook: 3, characterSlugs: ["mose"], themeSlugs: [] },
    { slug: "ten-plagues", title: "De tio plågorna", startRef: "Exodus 7:14", endRef: "Exodus 11:10", orderInBook: 4, characterSlugs: ["mose", "aron", "farao"], themeSlugs: ["chaos-order"] },
    { slug: "passover-and-exodus", title: "Påsken och uttåget", startRef: "Exodus 12:1", endRef: "Exodus 12:42", orderInBook: 5, characterSlugs: ["mose", "farao"], themeSlugs: ["sacrifice"] },
    { slug: "crossing-the-red-sea", title: "Vandringen genom Röda havet", startRef: "Exodus 14:1", endRef: "Exodus 14:31", orderInBook: 6, characterSlugs: ["mose", "farao"], themeSlugs: ["chaos-order", "testing-of-faith"] },
    // NY 2026-08-23: ökenvandringens första prövningar, mellan Röda havet
    // och ankomsten till Sinai.
    { slug: "manna-and-quail", title: "Manna och vaktlar i öknen", startRef: "Exodus 16:1", endRef: "Exodus 16:36", orderInBook: 7, characterSlugs: ["mose", "aron"], themeSlugs: ["testing-of-faith"] },
    { slug: "water-from-rock-and-amalek", title: "Vatten ur klippan och striden mot Amalek", startRef: "Exodus 17:1", endRef: "Exodus 17:16", orderInBook: 8, characterSlugs: ["mose", "aron", "josua"], themeSlugs: ["testing-of-faith", "hierarchy"] },
    // NY 2026-08-24: inget bildset hittat trots upprepad sökning — Exodus
    // 18 verkar helt enkelt sakna en dedikerad FreeBibleimages-
    // illustration. Läggs ändå in textbaserad (första storyn i appen helt
    // utan bildgalleri) hellre än att lämna kapitlet outtäckt, efter
    // uttrycklig önskan om fullständighet för Genesis/Exodus.
    { slug: "jethro-advises-moses", title: "Jetro ger Mose råd", startRef: "Exodus 18:1", endRef: "Exodus 18:27", orderInBook: 9, characterSlugs: ["mose", "jetro", "sippora"], themeSlugs: ["hierarchy"] },
    { slug: "ten-commandments", title: "De tio budorden på Sinai", startRef: "Exodus 19:16", endRef: "Exodus 20:21", orderInBook: 10, characterSlugs: ["mose"], themeSlugs: ["kingdom-of-god"] },
    // NY 2026-08-23: bokens till stora delar instruktions-/byggnadstunga
    // avsnitt (Exodus 25-40) — sammanfattat som EN story snarare än
    // uppdelat scen för scen, eftersom kapitlen mest är detaljerade
    // instruktioner (och sedan ett upprepat "genomförande"-avsnitt) utan
    // Peterson-kommenterat narrativt innehåll att luta sig mot.
    // Bildgalleriet (34 bilder) täcker ändå hela det fulla spannet 25-40,
    // inklusive slutscenen där Guds härlighet fyller tabernaklet.
    // Text-sektionen visar bara kap. 25 (instruktionerna för förbundsarken
    // — den mest ikoniska och mest citerade delen) som representativt
    // utdrag, INTE hela 25-40 (16 kapitel, till stora delar upprepade
    // måttlistor) — startRef/endRef begränsas medvetet till bara det
    // faktiskt extraherade kapitlet så att sidan inte visar ett felaktigt
    // "kunde inte hämta"-varningsmeddelande.
    //
    // RÄTTAD PLACERING (2026-08-24, upptäckt via /tidslinje): denna story
    // låg tidigare EFTER guldkalven/nya lagtavlorna trots att dess eget
    // startRef (25:1) kommer långt före dem — instruktionerna för
    // tabernaklet gavs MEDAN Mose var uppe på berget, innan guldkalven
    // hann hända. Flyttad hit, direkt efter de tio budorden.
    { slug: "the-tabernacle", title: "Tabernaklet — Guds boning bland folket", startRef: "Exodus 25:1", endRef: "Exodus 25:40", orderInBook: 11, characterSlugs: ["mose", "aron", "besalel"], themeSlugs: ["kingdom-of-god"] },
    { slug: "golden-calf", title: "Guldkalven", startRef: "Exodus 32:1", endRef: "Exodus 32:35", orderInBook: 12, characterSlugs: ["mose", "aron"], themeSlugs: ["betrayal"] },
    // NY 2026-08-24: den direkta uppföljningen till guldkalven — Mose
    // ber för folket, ser Guds härlighet passera, får nya lagtavlor
    // (efter att ha slagit sönder de första), och kommer ner med ett
    // strålande ansikte.
    { slug: "new-tablets-and-gods-glory", title: "Nya lagtavlor och Guds härlighet", startRef: "Exodus 33:1", endRef: "Exodus 34:35", orderInBook: 13, characterSlugs: ["mose", "aron"], themeSlugs: ["covenant"] },
  ];

  for (const s of exStories) {
    // Se motsvarande OBS-kommentar vid Genesis story-loopen ovan — `update`
    // måste spegla `create`, annars no-opar upsert på existerande rader.
    const exStoryData = { title: s.title, startRef: s.startRef, endRef: s.endRef, orderInBook: s.orderInBook };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: exodus.id, slug: s.slug } },
      update: exStoryData,
      create: { bookId: exodus.id, slug: s.slug, ...exStoryData },
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
  const exImageSets: Array<{
    storySlug: string;
    code: string;
    count: number;
    offset: number;
    credit: string;
    creditUrl: string;
    // Sant för set som delar EN story-mapp med ett annat set (bara
    // ten-plagues, två Plagues-set i samma mapp) — filerna döptes om
    // till sitt order-nummer vid nedladdning, se samma bugg/fix i
    // Genesis storyImageSets (joseph-and-his-brothers).
    renamedToOrder?: boolean;
  }> = [
    { storySlug: "moses-in-the-basket", code: "FB_LS_Baby_Moses", count: 8, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-baby-moses/" },
    // Bara bild 7–9 ur FB_YO_Moses_1 (resten av setet, bild 1–6, är
    // barndomsscener som redan täcks av "moses-in-the-basket") — laddades
    // ner separat och döptes om till 01–03 i sin egen mapp, se nedan.
    { storySlug: "moses-flees-to-midian", code: "FB_YO_Moses_1", count: 3, offset: 0, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/yo-moses1/" },
    { storySlug: "burning-bush", code: "FB_LS_Burning_Bush", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-burning-bush/" },
    { storySlug: "ten-plagues", code: "FB_LS_Plagues_1", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-plagues-1/" },
    { storySlug: "ten-plagues", code: "FB_LS_Plagues_2", count: 9, offset: 9, renamedToOrder: true, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-plagues-2/" },
    { storySlug: "passover-and-exodus", code: "FB_LS_Passover", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://freebibleimages.org/illustrations/ls-passover/" },
    { storySlug: "crossing-the-red-sea", code: "FB_Moses_Red_Sea", count: 15, offset: 0, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/moses-red-sea/" },
    { storySlug: "manna-and-quail", code: "FB_LS_Moses_Manna", count: 8, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-moses-manna/" },
    // Exodus 17 delas i två källset i EN story-mapp: vatten ur klippan
    // (17:1-7, 5 bilder) följt av striden mot Amalek (17:8-16, 15 bilder)
    // — döpta om till sitt order-nummer vid nedladdning, samma mönster
    // som Cain-and-Abel/Joseph i Genesis.
    { storySlug: "water-from-rock-and-amalek", code: "FB_CTA_Water_Rock", count: 5, offset: 0, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/cta-water-rock/" },
    { storySlug: "water-from-rock-and-amalek", code: "FB_Moses_Amalekites", count: 15, offset: 5, renamedToOrder: true, credit: "freebibleimages.org, CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/moses-amalekites/" },
    { storySlug: "ten-commandments", code: "FB_RG_Moses_10_Commandments", count: 15, offset: 0, credit: "Richard Gunther (freebibleimages.org), CC BY-NC", creditUrl: "https://www.freebibleimages.org/illustrations/rg-moses-10-commandments/" },
    { storySlug: "golden-calf", code: "FB_LS_Golden_Calf", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-golden-calf/" },
    // ("jethro-advises-moses" har medvetet inget bildset — se kommentar
    // vid storyn ovan.)
    { storySlug: "new-tablets-and-gods-glory", code: "FB_LS_Moses_Commandments", count: 9, offset: 0, ...lambsongsCredit, creditUrl: "https://www.freebibleimages.org/illustrations/ls-moses-commandments/" },
    { storySlug: "the-tabernacle", code: "FB_Moses_Tabernacle", count: 34, offset: 0, credit: "Sweet Publishing / freebibleimages.org, CC BY-SA", creditUrl: "https://www.freebibleimages.org/illustrations/moses-tabernacle/" },
  ];
  for (const set of exImageSets) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: exodus.id, slug: set.storySlug } });
    for (let fileNum = 1; fileNum <= set.count; fileNum++) {
      const order = set.offset + fileNum;
      const fileLabel = set.renamedToOrder ? order : fileNum;
      const path = `/images/exodus/${set.storySlug}/${String(fileLabel).padStart(2, "0")}.jpg`;
      const caption = exCaptions[set.code]?.[fileNum - 1] ?? null;
      await prisma.storyImage.upsert({
        where: { storyId_order: { storyId: story.id, order } },
        update: { path, caption, credit: set.credit, creditUrl: set.creditUrl },
        create: { storyId: story.id, order, path, caption, credit: set.credit, creditUrl: set.creditUrl },
      });
    }
  }

  // --- Omslagsbilder (thumbnailOrder) — se motsvarande kommentar i
  // Genesis-blocket ovan. Bytt 2026-08-23 efter direkt feedback. ---
  const exodusThumbnails: Record<string, number> = {
    "moses-in-the-basket": 3, // korgen vävs/bäddas med bebisen
    "passover-and-exodus": 3, // blodet stryks på dörrposten
    "ten-plagues": 5, // grodplågan (Plagues_1, order = fileNum här)
    // bild 1 i vatten-ur-klippan-setet är en okolorerad "målarbok"-bild
    // (avviker stilmässigt) — bild 10 (ur Amalek-setet) är den mer
    // dramatiska "Mose håller upp händerna"-scenen.
    "water-from-rock-and-amalek": 10,
    "the-tabernacle": 15, // förbundsarken, lysande gyllene — mer ikoniskt än bild 1 (bara ett åskmoln)
  };
  for (const [slug, order] of Object.entries(exodusThumbnails)) {
    await prisma.story.updateMany({ where: { bookId: exodus.id, slug }, data: { thumbnailOrder: order } });
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
    {
      storySlug: "manna-and-quail", clipOrder: 7,
      keyPoints:
        "Panelklipp 'Are You in Egypt, the Desert, or the Promised Land?' " +
        "— matchar ökenvandringens tema (folkets prövning/klagan mellan " +
        "slaveriet i Egypten och det utlovade landet). Otranskriberat " +
        "(kräver inloggning) — kopplingen bygger bara på klippets titel.",
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

  // --- Fas 12: We Who Wrestle with God (2024) -------------------------
  // Petersons senaste och mest direkta bibeltolkningsverk sedan 2017 års
  // Bibelserie — men som RIKTIG BOK (inte transkriberade föreläsningar).
  // Nio kapitel, vart och ett format "Gud som X" applicerat på en
  // Gamla testamentet-berättelse, i kronologisk ordning. Kapitelstruktur
  // och citat nedan är INTE hämtade ur boken direkt (ingen digital
  // text/transkript tillgänglig för oss) utan korskontrollerade mot
  // flera oberoende sekundärkällor 2026-08-23 (Gospel Coalition-recension,
  // SuperSummary studieguide, TEDS-reflektion, Prodigal Catholic-
  // sammanfattning m.fl.) — samma metod som för 12 Rules for Life.
  // Alla nio kapitlen länkar till en redan indexerad Story i Bibel-
  // korpusen. Kapitel 8 (Elia) och 9 (Jona) fick sina cross-link först
  // 2026-08-27 (Fas 55) — 1 Kungaboken och Jona fanns inte i korpusen
  // när kapitlen ursprungligen skrevs.
  const wrestleBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: mapsOfMeaningCorpus.id, slug: "we-who-wrestle-with-god" } },
    update: {
      description:
        "Petersons senaste bok (november 2024) — hans mest direkta och " +
        "omfattande bibeltolkning sedan 2017 års Bibelserie-föreläsningar, " +
        "men som en genomskriven bok snarare än transkriberade " +
        "föreläsningar. Nio kapitel går kronologiskt igenom Gamla " +
        "testamentets urberättelser (skapelsen till Jona), där varje " +
        "kapitel undersöker en annan 'sida' eller 'personlighet' av Gud/" +
        "Varat som den berättelsen framställer.",
      authorship: "Jordan B. Peterson, Portfolio/Penguin, november 2024, ca 576 sidor.",
      traditions:
        "Tolkar Toran/Gamla testamentets urberättelser genom en jungiansk/" +
        "arketypisk-psykologisk lins snarare än som traditionell religiös " +
        "kommentar — men i nära dialog med judisk-kristen tolkningstradition.",
    },
    create: {
      corpusId: mapsOfMeaningCorpus.id,
      slug: "we-who-wrestle-with-god",
      name: "We Who Wrestle with God",
      order: 3,
      description:
        "Petersons senaste bok (november 2024) — hans mest direkta och " +
        "omfattande bibeltolkning sedan 2017 års Bibelserie-föreläsningar, " +
        "men som en genomskriven bok snarare än transkriberade " +
        "föreläsningar. Nio kapitel går kronologiskt igenom Gamla " +
        "testamentets urberättelser (skapelsen till Jona), där varje " +
        "kapitel undersöker en annan 'sida' eller 'personlighet' av Gud/" +
        "Varat som den berättelsen framställer.",
      authorship: "Jordan B. Peterson, Portfolio/Penguin, november 2024, ca 576 sidor.",
      traditions:
        "Tolkar Toran/Gamla testamentets urberättelser genom en jungiansk/" +
        "arketypisk-psykologisk lins snarare än som traditionell religiös " +
        "kommentar — men i nära dialog med judisk-kristen tolkningstradition.",
    },
  });

  type WrestleChapter = {
    order: number;
    slug: string;
    title: string;
    quote: string;
    summary: string;
    genesisStorySlug?: string; // cross-link till redan indexerad Genesis/Exodus-story
  };
  const wrestleChapters: WrestleChapter[] = [
    {
      order: 1, slug: "in-the-beginning", title: "I begynnelsen: Gud som den kreativa anden",
      quote:
        "The spirit who faces chaos; who confronts the void, the deep; " +
        "who voluntarily shapes what has not yet been realized, and " +
        "navigates the ever-transforming horizon of the future.",
      summary:
        "Läser skapelseberättelsens Gud inte i första hand som en " +
        "bokstavlig skapare av materia, utan som en psykologisk modell: " +
        "den kreativa hållning som frivilligt möter det oformade/okända " +
        "('tohu va bohu' — vattnen, avgrunden) och formar det till något " +
        "hanterbart. Poängen kopplad till moderna livet: människor är " +
        "enligt Peterson kallade att göra samma sak i litet format — möta " +
        "sin egen ostrukturerade framtid frivilligt och forma den, " +
        "snarare än att passivt vänta på att kaos ska drabba en.",
      genesisStorySlug: "creation",
    },
    {
      order: 2, slug: "adam-and-eve-fall", title: "Adam och Eva och människans eviga fall",
      quote:
        "She represents and speaks for what is not yet known to Adam. " +
        "Given his ignorance, willful and otherwise, she has plenty to " +
        "work with.",
      summary:
        "Läser Eva som arketypen för det ännu-okända som lockar det " +
        "medvetna (Adam) framåt, och hennes fall som en 'medkänslans " +
        "patologi' — godhet som blir naiv och låter sig luras. Adams fall " +
        "läses som hybris: att tro sig kunna omforma/kontrollera ordningen " +
        "utan konsekvenser, och att falskt vilja imponera på sin partner " +
        "istället för att vara ärlig. Modern koppling: utdrivningen ur " +
        "Eden blir en bild för självmedvetandets eviga pris — när man väl " +
        "vet vad sårbarhet och skam är kan man aldrig 'o-veta' det, och " +
        "vägen tillbaka till harmoni kräver ödmjukhet snarare än förnekelse.",
      genesisStorySlug: "garden-of-eden",
    },
    {
      order: 3, slug: "cain-and-abel-resentment", title: "Kain och Abel: Det förbittrade brödrakriget",
      quote:
        "[Cain forges] a voluntary and blackly creative relationship with " +
        "the temptation crouching in predatory form at his doorstep.",
      summary:
        "Definierar 'det goda' som troget, uppoffrande arbete och 'det " +
        "onda' som självcentrerat groll — och läser Kains verkliga fel " +
        "inte som det första avvisade offret (ett normalt bakslag) utan " +
        "vägran att lära sig av det och ta ansvar. Peterson menar att Kain " +
        "dödar Abel för att Abel representerar den ideal-version av sig " +
        "själv som Kain innerst inne mest vill vara. Modern koppling: " +
        "bitterhet och offerkofta (särskilt när man verkligen blivit " +
        "orättvist behandlad) är en frestelse som, om den föds ut, gör mer " +
        "skada på en själv och ens relationer än den ursprungliga orätten.",
      genesisStorySlug: "cain-and-abel",
    },
    {
      order: 4, slug: "noah-call-to-prepare", title: "Noa: Guds kallelse att förbereda sig",
      quote:
        "When you believe the storm is approaching, do you batten down " +
        "the hatches and prepare, or not?",
      summary:
        "Läser Noa som den som fortsätter Abels rättfärdighet genom att " +
        "faktiskt LYSSNA på varningen och agera på den, till skillnad från " +
        "sina samtida. Gud framställs här som 'kallelsen att förbereda " +
        "sig' inför moralisk/existentiell katastrof — inte ett straff som " +
        "kommer utifrån, utan en varning man kan välja att ta på allvar " +
        "eller ignorera. Modern koppling: samma fråga (bygger du din ark " +
        "innan stormen, eller låtsas du att den inte kommer) appliceras på " +
        "vardagliga varningstecken i eget liv, relationer eller samhälle " +
        "som man väljer att antingen adressera i tid eller förtränga.",
      genesisStorySlug: "noahs-flood",
    },
    {
      order: 5, slug: "tower-of-babel-tyranny", title: "Babels torn: Gud kontra tyranni och högmod",
      quote:
        "In their pride, they claimed divinity and overstepped the bounds " +
        "that kept them properly ensconced within the true cosmic and " +
        "metaphysical order.",
      summary:
        "Läser Babels torn som prototypen för det arroganta imperiet: när " +
        "människor tror sig kunna bygga ett fulländat, teknokratiskt " +
        "utopia utan Gud/transcendent ordning, slutar det i tyranni och " +
        "splittring (språkförbistringen). Peterson kallar det en varning " +
        "mot 'totalitär visshet' — och kopplar det till idén att varje " +
        "människas skapelse till Guds avbild är grunden för västerländska " +
        "mänskliga rättigheter; att överge den idén (t.ex. genom att " +
        "reducera individer till kollektiv/ideologiska kategorier) är " +
        "enligt honom precis det steg som historiskt lett till tyranni.",
      genesisStorySlug: "tower-of-babel",
    },
    {
      order: 6, slug: "abraham-call-to-adventure", title: "Abraham: Guds modiga kallelse till äventyr",
      quote:
        "God, in the story of Abram, is the spirit that calls to the " +
        "privileged and sheltered to leave the comforts of home and to " +
        "undertake the adventures of their life.",
      summary:
        "Läser Abrahams kallelse ('gå ut från ditt land') som arketypen " +
        "för det obligatoriska äventyret varje människa förr eller senare " +
        "kallas till — att lämna trygghet och bekvämlighet för risk, " +
        "ansvar och uppoffring. Peterson menar att man i Abrahams efterföljd " +
        "måste 'gå all in', avvisa bekväma lögner som håller en kvar i " +
        "overksamhet, och ta på sig ansvaret att 'välsigna sin värld' " +
        "(bygga något av bestående värde för andra, inte bara för sig " +
        "själv) — direkt kopplat till hans återkommande tema om ansvar " +
        "som meningens motor, snarare än rättigheter eller bekvämlighet.",
      genesisStorySlug: "call-of-abram",
    },
    {
      order: 7, slug: "moses-and-israelites", title: "Moses och israeliterna",
      quote:
        "I am who I am.",
      summary:
        "Läser den brinnande busken och Guds självpresentation ('Jag är " +
        "den jag är') som en uppenbarelse av rent Vara/existens självt — " +
        "en kallelse till frihet som samtidigt är fruktansvärd, eftersom " +
        "frihet medför enormt ansvar. Gud framställs genomgående i Moses " +
        "berättelse som den anda som frigör GENOM att tvinga individer och " +
        "samhällen att konfrontera tyranni (Farao) och kaos (ökenvandringen). " +
        "Modern koppling: äkta frigörelse — från ett dåligt jobb, en " +
        "destruktiv relation, ett skadligt system — är sällan bekväm; den " +
        "kräver att man går igenom en egen 'öken' innan något bättre kan " +
        "byggas.",
      genesisStorySlug: "burning-bush",
    },
    {
      order: 8, slug: "elijah-still-small-voice", title: "Elia: Den tysta, stilla rösten",
      quote:
        "[God] is not in the wind, no matter its ferocity, nor in the " +
        "earthquake, regardless of its magnitude, but is something " +
        "within; the voice of conscience itself.",
      summary:
        "Elias möte med Gud i 'den tysta, stilla rösten' (inte i stormen, " +
        "inte i jordbävningen) läser Peterson som en vändpunkt i " +
        "mänsklighetens gudsuppfattning: insikten att det gudomliga kan " +
        "återfinnas som samvetets röst inom människan själv, inte bara i " +
        "dramatiska yttre fenomen. Han kallar det 'en upptäckt av " +
        "makalös betydelse'. Modern koppling: att lära sig lyssna på och " +
        "lita på sitt eget samvete (snarare än yttre auktoriteter eller " +
        "sociala påtryckningar) blir här grunden för moralisk förändring " +
        "— ett tema som binder direkt till hans återkommande råd om att " +
        "tala sanning och lyssna på sig själv (jfr 12 Rules for Life, " +
        "regel 8–9).",
      // NY 2026-08-27: Första Konungaboken indexerades i Fas 47 (samma
      // session) — cross-link nu möjlig, se README Fas 55.
      genesisStorySlug: "elijah-at-horeb",
    },
    {
      order: 9, slug: "jonah-belly-of-the-whale", title: "Jona: Att möta helvetet i valens buk",
      quote:
        "Faith is the courage to determine to maintain stalwart and " +
        "upward aim at the good, even in the midst of hell.",
      summary:
        "Läser Jonas flykt från sin kallelse (att varna Nineve) och hans " +
        "efterföljande fångenskap i valens buk som en bild för vad som " +
        "händer när man vägrar lyssna och agera: man hamnar ändå i sitt " +
        "eget helvete, fast senare och värre. Valen tolkas symboliskt som " +
        "samhällets 'kropp' av lag, kunskap och tradition som sväljer den " +
        "som inte vill delta frivilligt. Tro definieras här inte som " +
        "blind övertygelse utan som modet att fortsätta sikta uppåt mot " +
        "det goda mitt i det värsta — direkt applicerbart på moderna kriser " +
        "(sjukdom, förlust, misslyckande) där själva förmågan att fortsätta " +
        "sikta mot något gott, mitt i lidandet, är vad Peterson kallar tro.",
      // NY 2026-08-27: Jona indexerades tidigare i sessionen — cross-link
      // nu möjlig, se README Fas 55.
      genesisStorySlug: "jonah-in-the-fish",
    },
  ];

  for (const ch of wrestleChapters) {
    await prisma.story.upsert({
      where: { bookId_slug: { bookId: wrestleBook.id, slug: ch.slug } },
      update: {
        title: `${ch.order}. ${ch.title}`,
        summary: ch.summary,
        quote: ch.quote,
      },
      create: {
        bookId: wrestleBook.id,
        slug: ch.slug,
        title: `${ch.order}. ${ch.title}`,
        startRef: `Kapitel ${ch.order}`,
        endRef: `Kapitel ${ch.order}`,
        summary: ch.summary,
        quote: ch.quote,
        orderInBook: ch.order,
      },
    });
  }
  // Bok-interna referenser: cross-link varje kapitel till den redan
  // indexerade Genesis/Exodus-storyn för samma berättelse, med samma
  // Reference-mönster (bookSourceRef) som byggdes för 12 Rules for Life.
  for (const ch of wrestleChapters) {
    if (!ch.genesisStorySlug) continue;
    const targetStory = await prisma.story.findFirst({ where: { slug: ch.genesisStorySlug } });
    if (!targetStory) continue;
    await prisma.reference.upsert({
      where: { id: `seed-bookref-wrestle-${ch.slug}` },
      update: {
        storyId: targetStory.id,
        note: `Samma berättelse som "${targetStory.title}" i Bibel-korpusen, tolkad här ur "We Who Wrestle with God"s perspektiv.`,
        bookSourceRef: `We Who Wrestle with God, Kapitel ${ch.order}`,
      },
      create: {
        id: `seed-bookref-wrestle-${ch.slug}`,
        storyId: targetStory.id,
        note: `Samma berättelse som "${targetStory.title}" i Bibel-korpusen, tolkad här ur "We Who Wrestle with God"s perspektiv.`,
        bookSourceRef: `We Who Wrestle with God, Kapitel ${ch.order}`,
      },
    });
  }
  console.log(`Seedat We Who Wrestle with God: ${wrestleChapters.length} kapitel.`);

  // --- Fas 14: Beyond Order: 12 More Rules for Life (2021) -----------
  // Uppföljaren till 12 Rules for Life — samma metod: inget digitalt
  // exemplar/transkript tillgängligt, så varje regels citat är
  // korskontrollerat mot minst två oberoende sekundärkällor (Goodreads
  // officiella citatsida, Shortform kapitelsammanfattningar m.fl.)
  // 2026-08-23. Där inget längre verifierat citat hittades används
  // regelns egen ordalydelse som citat (samma princip som regel 4/6 i
  // första boken) — se README för fullständig avgränsning.
  const beyondOrderBook = await prisma.book.upsert({
    where: { corpusId_slug: { corpusId: mapsOfMeaningCorpus.id, slug: "beyond-order" } },
    update: {
      description:
        "Uppföljaren till 12 Rules for Life (2021) — tolv nya regler som " +
        "denna gång lutar mer åt kaos-sidan av kaos/ordning-modellen: hur " +
        "man hanterar för mycket osäkerhet, förändring och upplösning i " +
        "livet (jämfört med första bokens fokus på för mycket rigid " +
        "ordning/kaos-brist). Byggd kring samma anekdot- och " +
        "livsråds-format som föregångaren.",
      authorship: "Jordan B. Peterson, Portfolio/Penguin, mars 2021.",
      traditions: null,
    },
    create: {
      corpusId: mapsOfMeaningCorpus.id,
      slug: "beyond-order",
      name: "Beyond Order: 12 More Rules for Life",
      order: 4,
      description:
        "Uppföljaren till 12 Rules for Life (2021) — tolv nya regler som " +
        "denna gång lutar mer åt kaos-sidan av kaos/ordning-modellen: hur " +
        "man hanterar för mycket osäkerhet, förändring och upplösning i " +
        "livet (jämfört med första bokens fokus på för mycket rigid " +
        "ordning/kaos-brist). Byggd kring samma anekdot- och " +
        "livsråds-format som föregångaren.",
      authorship: "Jordan B. Peterson, Portfolio/Penguin, mars 2021.",
    },
  });

  const beyondOrderRules: Array<{ order: number; slug: string; title: string; quote: string; summary: string }> = [
    {
      order: 1, slug: "do-not-denigrate-institutions", title: "Förringa inte sociala institutioner eller kreativa framsteg",
      quote:
        "A certain amount of creativity and rebellion must be tolerated " +
        "to maintain the process of regeneration. Every rule was once a " +
        "creative act, breaking other rules.",
      summary:
        "Argumenterar för att tradition/institutioner och kreativ " +
        "förnyelse inte är motsatser utan samarbetspartners: traditionen " +
        "ger stabilitet och historisk förankring, medan kreativiteten " +
        "förnyar det som stelnat. Att ensidigt förakta antingen ordning " +
        "(institutioner) eller kaos (kreativ omstörtning) leder till " +
        "antingen stagnation eller upplösning. Modern koppling: samma " +
        "balansgång gäller på jobbet, i familjen och i politiken — ren " +
        "revolution och ren konservatism är båda ofullständiga strategier.",
    },
    {
      order: 2, slug: "imagine-who-you-could-be", title: "Föreställ dig vem du skulle kunna vara — och sikta enträget dit",
      quote: "Imagine who you could be, and then aim single-mindedly at that.",
      summary:
        "Utgår från att lidande är en oundviklig del av tillvaron, och " +
        "att varje människa därför har en sorts skyldighet att bli sin " +
        "bästa möjliga version — inte av narcissism, utan för att minska " +
        "det lidande man annars bidrar med till världen. Frågar rakt av: " +
        "'vem skulle du kunna vara, om du var allt du skulle kunna vara?' " +
        "Modern koppling: till skillnad från vaga mål ('bli lyckligare') " +
        "kräver den här övningen att man konkret föreställer sig en " +
        "specifik, bättre version av sig själv och sedan riktar sina " +
        "dagliga val mot den — ett sorts personligt norrsken att navigera efter.",
    },
    {
      order: 3, slug: "do-not-hide-in-fog", title: "Göm inte oönskade saker i dimman",
      quote:
        "Your world is known territory, surrounded by relatively " +
        "unknown, surrounded by absolutely unknown.",
      summary:
        "Varnar för att otydligt definierade, ouppmärksammade problem " +
        "('dimman') sväller okontrollerat i bakgrunden istället för att " +
        "krympa — till skillnad från konkreta, namngivna problem som går " +
        "att faktiskt ta itu med. Små vardagsstressorer man skjuter upp " +
        "att hantera ackumuleras tyst tills de blir överväldigande. " +
        "Modern koppling: regelbunden, ärlig självrannsakan (vad stör mig " +
        "egentligen just nu?) är enligt Peterson billigare i längden än " +
        "att låta obehagliga saker samla sig omärkt i periferin.",
    },
    {
      order: 4, slug: "opportunity-where-responsibility-abdicated", title: "Möjligheten finns där ansvar övergivits",
      quote:
        "With careful attention, you might tip the balance toward " +
        "opportunity sufficiently so that life is worth living.",
      summary:
        "Menar att uppmärksamhet på VAD som behöver göras — men som ingen " +
        "gör — är en av de mest tillförlitliga källorna till mening och " +
        "möjlighet i livet, mer hållbart än jakten på tillfällig lycka. " +
        "Ett övergivet ansvar (ett ostädat rum, ett olöst problem på " +
        "jobbet ingen tar tag i) är samtidigt en lucka någon kan fylla. " +
        "Modern koppling: istället för att vänta på en perfekt " +
        "'drömmöjlighet' uppmanar Peterson läsaren att aktivt leta efter " +
        "de områden där ansvar redan ligger och skräpar oombesörjt.",
    },
    {
      order: 5, slug: "do-not-do-what-you-hate", title: "Gör inte det du avskyr",
      quote: "Do not do what you hate.",
      summary:
        "Läser kompromissande med sina egna moraliska gränser (att göra " +
        "eller acceptera saker man innerst inne avskyr, av bekvämlighet " +
        "eller konflikträdsla) som en av de säkraste vägarna till passivt " +
        "förakt för sig själv och undertryckta, senare explosiva känslor. " +
        "Regeln är medvetet formulerad negativt (vad man INTE ska göra) " +
        "snarare än positivt, eftersom Peterson menar att man ofta vet " +
        "precis vad man avskyr långt innan man vet vad man egentligen vill. " +
        "Modern koppling: ett bra första steg mot ett meningsfullt liv är " +
        "helt enkelt att sluta göra det man redan vet är fel för en själv.",
    },
    {
      order: 6, slug: "abandon-ideology", title: "Överge ideologin",
      quote: "Abandon ideology.",
      summary:
        "Varnar för färdigpaketerade ideologiska världsbilder (oavsett " +
        "politisk riktning) som förenklar verklighetens genuina " +
        "komplexitet till några få slagord och skyldiga syndabockar — " +
        "vilket känns tryggt men gör en blind för nyanser som inte passar " +
        "berättelsen. Uppmanar istället till att aktivt utbilda sig brett " +
        "och brottas med världens faktiska komplexitet. Modern koppling: " +
        "särskilt relevant i en tid av polariserad politik online — " +
        "regeln är en uppmaning att misstro varje färdig världsförklaring " +
        "som känns för enkel för att vara sann, oavsett vilket 'lag' den kommer från.",
    },
    {
      order: 7, slug: "work-hard-on-one-thing", title: "Arbeta så hårt du kan med minst en sak",
      quote:
        "You could start by confronting a dragon of just the size you " +
        "are likely to defeat.",
      summary:
        "Menar att spretig, halvhjärtad ansträngning över många områden " +
        "sällan bygger verklig kompetens eller karaktär — medan " +
        "helhjärtat engagemang i ÅTMINSTONE en sak, även liten, bygger " +
        "både färdighet och självrespekt som sedan sprider sig till andra " +
        "delar av livet. Bilden av att 'utmana en drake av lagom storlek' " +
        "återkommer: börja med motstånd du faktiskt har en chans att " +
        "besegra. Modern koppling: en vanlig fälla är att vänta på " +
        "motivation innan man anstränger sig — Peterson vänder på det: " +
        "kompetensen och motivationen kommer FRÅN att man redan ansträngt sig.",
    },
    {
      order: 8, slug: "make-one-room-beautiful", title: "Försök göra ett rum i ditt hem så vackert som möjligt",
      quote:
        "We need to understand art as bedrock of culture itself, not as " +
        "luxury or affectation.",
      summary:
        "Läser skönhet/konst inte som lyx utan som något psykologiskt " +
        "nödvändigt — ett sätt att återupprätta kontakten med den " +
        "barnsliga förundran och uppmärksamhet på detaljer som vuxenlivets " +
        "rutin annars slipar bort. Att medvetet skapa EN vacker plats i " +
        "sitt hem (snarare än att vänta på råd att göra om allt) är en " +
        "konkret, avgränsad övning i att faktiskt agera på den impulsen. " +
        "Modern koppling: ett litet, görbart projekt (städa och pryda ett " +
        "enda hörn) som motgift mot känslan av att hela livet måste " +
        "förbättras på en gång för att något ska räknas.",
    },
    {
      order: 9, slug: "write-down-old-memories", title: "Om gamla minnen fortfarande plågar dig — skriv ner dem noggrant",
      quote: "If old memories still upset you, write them down carefully and completely.",
      summary:
        "Bygger på idén att obearbetade, smärtsamma minnen fortsätter " +
        "generera ångest just för att de aldrig fått en fullständig, " +
        "sammanhängande berättelse — hjärnan larmar tills 'historien' är " +
        "klar. Att medvetet skriva ner en plågsam episod i detalj, från " +
        "flera vinklar, och försöka förstå den (inte bara återuppleva den) " +
        "är enligt Peterson en väg att omvandla ett rått, ostrukturerat " +
        "trauma till något hanterbart. Modern koppling: en konkret, " +
        "görbar övning (skriftlig bearbetning) för något som annars ofta " +
        "stannar som vag, återkommande olust utan tydlig utväg.",
    },
    {
      order: 10, slug: "maintain-the-romance", title: "Planera och arbeta medvetet för att behålla romantiken i din relation",
      quote:
        "Collect a hundred small grievances and your marriage is doomed. " +
        "Have the damn fight about daily matters.",
      summary:
        "Argumenterar för att romantik i ett långvarigt förhållande inte " +
        "uppstår spontant utan kräver aktivt, återkommande underhåll — " +
        "regelbundna samtal om vad som faktiskt irriterar båda parter " +
        "INNAN småsaker hopar sig till outhärdlig bitterhet. Förespråkar " +
        "monogami som den mest hållbara strukturen för det, med skilsmässa " +
        "medvetet borttaget som lättillgänglig utväg för att tvinga fram " +
        "faktisk problemlösning istället för undvikande. Modern koppling: " +
        "ett schemalagt, återkommande 'förhandlingsmöte' om vardagsirritation " +
        "är enligt Peterson mindre romantiskt i stunden men avgörande för " +
        "att romantiken ska kunna hålla i sig över tid.",
    },
    {
      order: 11, slug: "do-not-become-resentful-deceitful-arrogant", title: "Låt dig inte bli bitter, bedräglig eller arrogant",
      quote:
        "One lie breeds necessity for more. One act of self-deception " +
        "generates requirement for new delusions.",
      summary:
        "Läser bitterhet, självbedrägeri och arrogans som en " +
        "sammanhängande nedåtgående spiral snarare än tre separata laster: " +
        "en första liten lögn (även bara till sig själv) skapar ett behov " +
        "av fler lögnar för att upprätthålla den första, vilket i sin tur " +
        "föder bitterhet över den värld man nu måste förvränga sin " +
        "uppfattning för att uthärda. Modvärnet är att konsekvent lyssna " +
        "på och agera enligt sitt samvete, även när det är obekvämt. " +
        "Modern koppling: samma tema som återkommer i 12 Rules for Life " +
        "regel 8 (tala sanning) — här fördjupat till varför den första " +
        "lilla efterlåtenheten mot sig själv är farligare än den känns.",
    },
    {
      order: 12, slug: "be-grateful-in-spite-of-suffering", title: "Var tacksam trots ditt lidande",
      quote: "Be grateful in spite of your suffering.",
      summary:
        "Avslutar boken med att varken förneka livets verkliga mörker " +
        "(sjukdom, förlust, orättvisa) eller falla in i nihilism inför " +
        "det, utan hålla båda sanningarna samtidigt: tillvaron innehåller " +
        "oundvikligt lidande, OCH det finns fortfarande genuint goda saker " +
        "värda tacksamhet mitt i det. Tacksamhet blir här inte naiv " +
        "positivitet utan en medveten, upprepad viljehandling — ett sätt " +
        "att orientera sig mot vad som fortfarande fungerar, trots allt. " +
        "Modern koppling: samma andemening som avslutningen av första " +
        "boken (regel 12, klappa en katt) men fördjupad till en mer " +
        "allmän livshållning snarare än en enskild liten gest.",
    },
  ];

  for (const r of beyondOrderRules) {
    await prisma.story.upsert({
      where: { bookId_slug: { bookId: beyondOrderBook.id, slug: r.slug } },
      update: { title: `Regel ${r.order}: ${r.title}`, summary: r.summary, quote: r.quote },
      create: {
        bookId: beyondOrderBook.id,
        slug: r.slug,
        title: `Regel ${r.order}: ${r.title}`,
        startRef: `Regel ${r.order}`,
        endRef: `Regel ${r.order}`,
        summary: r.summary,
        quote: r.quote,
        orderInBook: r.order,
      },
    });
  }
  console.log(`Seedat Beyond Order: ${beyondOrderRules.length} regler.`);

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
        "trossystem. Föreläsningens sista, mest omfattande (~30 minuter) " +
        "block återger den babyloniska skapelsemyten Enuma Elish i " +
        "detalj: den kaotiska urmodern Tiamat, hennes monster-general " +
        "Kingu, och hur guden Marduk väljs till kungars kung enbart för " +
        "att han kan SE (ögon runt hela huvudet) och TALA (magiska ord) " +
        "— tolkat som mänsklighetens första formulering av 'logos'-idén: " +
        "att uppmärksamt seende + sant tal är det som bör stå högst i " +
        "hierarkin, inte bara ren styrka. Marduk besegrar Tiamat, styckar " +
        "henne till världen, och den mesopotamiske kejsaren blev sedan " +
        "rituellt tvungen att 'vara en god Marduk' varje nyår. Kopplar " +
        "detta vidare till den egyptiska Osiris/Horus-myten (där " +
        "Farao=facket Osiris+Horus förenade) och den gradvisa " +
        "'demokratiseringen av Osiris' — idén att alla människor, inte " +
        "bara farao, bär detta gudomliga i sig — som Peterson kallar " +
        "grundbulten i västerländsk individ-suveränitet.",
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
    // Se motsvarande OBS-kommentar vid Genesis story-loopen ovan — `update`
    // måste spegla `create`, annars no-opar upsert på existerande rader.
    const momStoryData = {
      title: lecture.title,
      startRef: `Föreläsning ${lecture.order}`,
      endRef: `Föreläsning ${lecture.order}`,
      summary: lecture.summary,
      orderInBook: lecture.order,
    };
    const story = await prisma.story.upsert({
      where: { bookId_slug: { bookId: mapsOfMeaningBook.id, slug: lecture.slug } },
      update: momStoryData,
      create: { bookId: mapsOfMeaningBook.id, slug: lecture.slug, ...momStoryData },
    });
    await prisma.petersonSegment.upsert({
      where: { videoId_storyId: { videoId: video.id, storyId: story.id } },
      update: { startSec: 0, keyPoints: lecture.summary },
      create: { videoId: video.id, storyId: story.id, startSec: 0, keyPoints: lecture.summary },
    });
  }

  // --- 12 Rules for Life -------------------------------------------
  // Ingen enskild kanonisk video per regel (Peterson diskuterar dem
  // spritt över hundratals poddavsnitt/intervjuer) — bara textindex,
  // ingen PetersonSegment-koppling. `quote` är ett kort, verifierat
  // citat direkt ur boken (behålls på engelska enligt instruktion) —
  // varje citat är kontrollerat mot minst en oberoende sekundärkälla
  // (Goodreads officiella citatsida, LitCharts kapitelsammanfattningar,
  // m.fl.) 2026-08-23, INTE hämtat ur minnet utan sökning, eftersom boken
  // är upphovsrättsskyddad och vi (till skillnad från YouTube-videorna)
  // inte har transkript att verifiera mot. `summary` är en egen,
  // omskriven sammanfattning av Petersons poäng/andemening i kapitlet.
  const rules: Array<{ order: number; slug: string; title: string; quote: string; summary: string }> = [
    {
      order: 1, slug: "stand-up-straight", title: "Stå rak i ryggen med axlarna tillbaka",
      quote: "To stand up straight with your shoulders back is to accept the terrible responsibility of life, with eyes wide open.",
      summary:
        "Peterson bygger regeln på forskning om hierarkier hos hummer (en av " +
        "de evolutionärt äldsta djurarterna med ett dominanshierarki-system) " +
        "och kopplingen mellan status, serotoninnivåer och hållning. Poängen " +
        "är inte 'fake it till du blir det' i ytlig mening, utan att kroppen " +
        "och nervsystemet läser av och signalerar underkastelse eller " +
        "kompetens innan det medvetna sinnet hinner tänka en tanke — så att " +
        "möta livet upprätt är att medvetet välja att bemöta tillvarons " +
        "kaos och lidande med kompetens istället för att dra sig undan.",
    },
    {
      order: 2, slug: "treat-yourself-like-someone-you-are-responsible-for", title: "Behandla dig själv som någon du är ansvarig för att hjälpa",
      quote: "You should take care of, help and be good to yourself the same way you would take care of, help and be good to someone you loved and valued.",
      summary:
        "Utgångspunkten är ett kliniskt observerat mönster: människor är " +
        "ofta mycket bättre på att ge medicin till sin hund än till sig " +
        "själva, eftersom de (medvetet eller inte) inte anser sig själva " +
        "värda samma omsorg som andra. Peterson menar att detta hänger ihop " +
        "med syndafallsberättelsen — kunskapen om det egna medvetna jagets " +
        "sårbarhet och skam gör det lätt att förakta sig själv — och att " +
        "lösningen är att ta på sig samma ANSVAR för sitt eget välmående som " +
        "man skulle ta för någon man älskar.",
    },
    {
      order: 3, slug: "make-friends-with-people-who-want-the-best-for-you", title: "Skaffa dig vänner som vill dig väl",
      quote: "If you have a friend whose friendship you wouldn't recommend to your sister, or your father, or your son, why would you have such a friend for yourself?",
      summary:
        "Peterson varnar för en särskild sorts missriktad lojalitet: att " +
        "stanna kvar i destruktiva vänskaper av medlidande eller av rädsla " +
        "för att verka kallsinnig, trots att relationen aktivt drar en " +
        "nedåt. Han menar att den sortens 'lojalitet' inte är dygd utan " +
        "ofta ett uttryck för bristande självrespekt — och att man bör " +
        "ställa samma krav på sina egna relationer som man skulle ställa på " +
        "en närståendes.",
    },
    {
      order: 4, slug: "compare-yourself-to-who-you-were-yesterday", title: "Jämför dig med den du var igår, inte med någon annan idag",
      quote: "Compare yourself to who you were yesterday, not to who someone else is today.",
      summary:
        "Bygger på idén att jämförelser med andra (särskilt i sociala " +
        "mediers tidevarv) nästan alltid är orättvisa, eftersom man jämför " +
        "hela sin egen inre erfarenhet med bara andras yttre framgångs-" +
        "höjdpunkter. Peterson föreslår istället att bryta ner livet i " +
        "hanterbara, personliga delmål — och mäta framsteg mot sitt eget " +
        "förflutna, det enda rättvisa jämförelseobjektet man faktiskt har " +
        "full insyn i.",
    },
    {
      order: 5, slug: "do-not-let-your-children-do-anything-that-makes-you-dislike-them", title: "Låt inte dina barn göra sånt som gör att du ogillar dem",
      quote: "It is an act of responsibility to discipline a child. It is not anger at misbehavior. It is not revenge for a misdeed. It is instead a careful combination of mercy and long-term judgment.",
      summary:
        "Peterson argumenterar mot både auktoritär bestraffning och total " +
        "gränslöshet: ett barn som inte fostras blir socialt oacceptabelt " +
        "för andra vuxna, vilket i praktiken berövar barnet vänner, lärare " +
        "och framtida möjligheter. Disciplin ska enligt honom vara minimal, " +
        "konsekvent och förutsägbar — inte ett utlopp för förälderns " +
        "irritation — med det uttalade målet att barnet ska vara någon " +
        "andra vuxna faktiskt VILL ha i sin närhet.",
    },
    {
      order: 6, slug: "set-your-house-in-order", title: "Sätt ditt eget hus i fullständig ordning innan du kritiserar världen",
      quote: "Set your house in perfect order before you criticize the world.",
      summary:
        "Skriven delvis som en reaktion på skolskjutningar och andra " +
        "ungdomars nihilistiska hämndfantasier: innan man ger sig på att " +
        "döma samhället, historien eller andra människor bör man ärligt " +
        "granska sitt eget liv — sina olösta problem, sina brustna löften " +
        "till sig själv — eftersom det är den enda plats där man faktiskt " +
        "har makt att göra något. Peterson menar att detta inte är en " +
        "uppmaning till passivitet utan tvärtom den enda hederliga " +
        "utgångspunkten för att förändra något större.",
    },
    {
      order: 7, slug: "pursue-what-is-meaningful", title: "Sträva efter det som är meningsfullt, inte det som är bekvämt",
      quote: "Something better might be attained in the future by giving up something of value in the present.",
      summary:
        "Peterson läser urgamla offerritualer som mänsklighetens första " +
        "insikt om orsak och verkan över tid: att medvetet ge upp något av " +
        "värde NU (arbete, njutning, bekvämlighet) för att uppnå något " +
        "bättre SENARE. Det bekväma/expedienta valet ger en kortsiktig " +
        "belöning men urholkar på sikt både relationer och självrespekt — " +
        "medan det meningsfulla valet, även när det är svårt eller " +
        "obekvämt just nu, är det enda som håller över tid.",
    },
    {
      order: 8, slug: "tell-the-truth", title: "Tala sanning — eller åtminstone ljug inte",
      quote: "When you have something to say, silence is a lie.",
      summary:
        "Bygger på idén att varje litet vardagslögn — att undvika ett " +
        "obekvämt samtal, att låtsas må bra, att välja en karriär för att " +
        "imponera på andra istället för att den är rätt för en själv — " +
        "gradvis förvränger ens egen relation till verkligheten och gör " +
        "framtida kriser större. Peterson ser sanningsägande (även när det " +
        "är obekvämt) som det verktyg som håller en persons liv och " +
        "relationer sammanhållna över tid.",
    },
    {
      order: 9, slug: "assume-the-person-you-are-listening-to-might-know-something", title: "Utgå från att den du lyssnar på kanske vet något du inte vet",
      quote: "So, listen, to yourself and to those with whom you are speaking.",
      summary:
        "Hämtat direkt från Petersons erfarenhet som terapeut: ett riktigt " +
        "samtal är inte att vänta på sin tur att prata eller att i förväg " +
        "veta vad man tycker, utan ett sätt att TÄNKA — att formulera en " +
        "tanke högt, höra hur den låter, och låta den korrigeras av vad den " +
        "andra personen faktiskt säger. Att lyssna med genuin ödmjukhet, " +
        "menar han, är både det mest respektfulla man kan göra för en " +
        "annan människa och det mest effektiva sättet att själv bli klokare.",
    },
    {
      order: 10, slug: "be-precise-in-your-speech", title: "Var precis i ditt tal",
      quote: "Stop saying those things that make you weak and ashamed. Say only those things that make you strong.",
      summary:
        "Peterson menar att odefinierade problem sväller: ett vagt, " +
        "outtalat obehag ('något är fel med mitt jobb/mitt äktenskap') " +
        "expanderar i sinnet till att omfatta i princip allt, medan ett " +
        "precist formulerat problem ('jag behöver be om en löneförhöjning " +
        "senast fredag') blir hanterbart. Att våga sätta ord på det som " +
        "faktiskt är fel — även om det känns skamligt eller obekvämt — är " +
        "enligt honom vad som gör kaos till något man kan agera på.",
    },
    {
      order: 11, slug: "do-not-bother-children-skateboarding", title: "Stör inte barn som åker skateboard",
      quote: "If they're healthy, women don't want boys. They want men. They want someone to contend with; someone to grapple with.",
      summary:
        "Utgångspunkten är Petersons observation av hur skateboardkultur i " +
        "Toronto (fram till dess den reglerades bort av säkerhetsskäl) lät " +
        "unga killar frivilligt utsätta sig för verklig, hanterbar risk och " +
        "därigenom bygga kompetens och mod. Han knyter det till ett bredare " +
        "argument om att en överbeskyddande kultur — som premierar trygghet " +
        "över allt annat och som ibland aktivt straffar 'manligt' " +
        "risktagande — riskerar att producera passiva, oduglign vuxna " +
        "istället för kompetenta.",
    },
    {
      order: 12, slug: "pet-a-cat", title: "Klappa en katt när du möter en på gatan",
      quote:
        "If we didn't all attempt to make terrible things even worse than " +
        "they are, then maybe we could tolerate terrible things that we " +
        "have to put up with in order to exist.",
      summary:
        "Skrevs delvis under en period då Petersons dotter var svårt sjuk. " +
        "Poängen är inte naiv optimism utan motsatsen: livet innehåller " +
        "oundvikligt lidande och tragedi, och just därför är förmågan att " +
        "lägga märke till och ta emot små, flyktiga stunder av skönhet — " +
        "som en katt som råkar korsa ens väg — inte bagatellartat utan en " +
        "form av motstånd mot att låta lidandet ta över helt.",
    },
  ];
  for (const r of rules) {
    await prisma.story.upsert({
      where: { bookId_slug: { bookId: rulesBook.id, slug: r.slug } },
      update: { summary: r.summary, quote: r.quote },
      create: {
        bookId: rulesBook.id,
        slug: r.slug,
        title: `Regel ${r.order}: ${r.title}`,
        startRef: `Regel ${r.order}`,
        endRef: `Regel ${r.order}`,
        summary: r.summary,
        quote: r.quote,
        orderInBook: r.order,
      },
    });
  }

  console.log(`Seedat Maps of Meaning: ${momLectures.length} föreläsningar, 12 Rules for Life: ${rules.length} regler.`);

  // --- Symbolbilder för Maps of Meaning / 12 Rules for Life ----------
  // Till skillnad från bibelböckerna finns inget bildarkiv att hämta
  // scen-för-scen-bilder från. Istället en handfull noga utvalda,
  // öppet licensierade bilder (Wikimedia Commons) som illustrerar
  // centrala referat/symboler Peterson faktiskt använder — inte en
  // scen-för-scen-bildberättelse. Licens/källa i credit/creditUrl.
  const frameworkImages: Array<{
    bookId: string;
    storySlug: string;
    order: number;
    path: string;
    caption: string;
    credit: string;
    creditUrl: string;
  }> = [
    {
      bookId: mapsOfMeaningBook.id, storySlug: "neuropsychology-of-symbolic-representation", order: 1,
      path: "/images/mom/neuropsychology-of-symbolic-representation/01-marduk-tiamat.png",
      caption:
        "Relief föreställande en gud som besegrar ett kaosmonster, ofta kallad " +
        "'Marduk mot Tiamat'. OBS: identifieringen är omtvistad — flera " +
        "moderna forskare menar att originalreliefen (från Sennacheribs " +
        "palats i Nineve) troligen föreställer guden Ninurta mot monstret " +
        "Anzu, en annan mesopotamisk kaos-bekämpningsmyt. Ingen säkert " +
        "identifierad antik bildframställning av just Marduk mot Tiamat " +
        "är känd — bilden används ändå här som närmaste visuella " +
        "representation av samma arketypiska mönster.",
      credit: "Bearbetad version av relief, Sennacheribs palats, Nineve (Wikimedia Commons, CC BY-SA 4.0)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Marduk_Tiamat_Battle_from_Enuma_Elish_-_repaired_version.png",
    },
    {
      bookId: mapsOfMeaningBook.id, storySlug: "neuropsychology-of-symbolic-representation", order: 2,
      path: "/images/mom/neuropsychology-of-symbolic-representation/02-osiris-isis-horus.jpg",
      caption:
        "Osiris (mitten) flankerad av sin hustru Isis (vänster) och son " +
        "Horus (höger). Kalksten, 1200-talet f.Kr., från Abydos, Egypten. " +
        "British Museum. Peterson läser föreningen Osiris+Horus som " +
        "modellen för faraos gudomliga själ — samma grundmönster som " +
        "Marduk mot Tiamat, applicerat på statens förfall och förnyelse.",
      credit: "Foto: Osama Shukir Muhammed Amin FRCP(Glasg) (Wikimedia Commons, CC BY-SA 4.0)",
      creditUrl: "https://commons.wikimedia.org/wiki/Category:Osiris",
    },
    {
      bookId: rulesBook.id, storySlug: "stand-up-straight", order: 1,
      path: "/images/rules/stand-up-straight/01-lobster.jpg",
      caption:
        "Amerikansk hummer (Homarus americanus), fotograferad utanför " +
        "Maines kust 1975. Peterson bygger regel 1 på forskning om " +
        "hummers dominanshierarkier och kopplingen mellan status och " +
        "serotoninnivåer.",
      credit: "NOAA/OAR National Undersea Research Program (public domain)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Nur01521_-_Flickr_-_NOAA_Photo_Library.jpg",
    },
  ];
  for (const img of frameworkImages) {
    const story = await prisma.story.findFirstOrThrow({ where: { bookId: img.bookId, slug: img.storySlug } });
    await prisma.storyImage.upsert({
      where: { storyId_order: { storyId: story.id, order: img.order } },
      update: { path: img.path, caption: img.caption, credit: img.credit, creditUrl: img.creditUrl },
      create: {
        storyId: story.id,
        order: img.order,
        path: img.path,
        caption: img.caption,
        credit: img.credit,
        creditUrl: img.creditUrl,
      },
    });
  }
  console.log(`Seedat ${frameworkImages.length} symbolbilder för Maps of Meaning/12 Rules for Life.`);

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
      id: luke.id,
      description:
        "Jesu födelse (ur Marias och herdarnas perspektiv), hans liknelser " +
        "och under, resan mot Jerusalem, och passionsveckan. Lägger stor " +
        "vikt vid utstötta grupper (samariter, publikaner, kvinnor, fattiga) " +
        "och innehåller flera av de mest kända liknelserna — Den barmhärtige " +
        "samariten, Den förlorade sonen — som inte finns i Matteus alls.",
      authorship:
        "Traditionellt tillskriven Lukas, en grekisktalande läkare och " +
        "följeslagare till aposteln Paulus (ej själv ögonvittne till Jesu " +
        "liv). Skriven som första delen av ett tvådelat verk tillsammans " +
        "med Apostlagärningarna, för en huvudsakligen icke-judisk " +
        "läsekrets. Modern forskning daterar den ofta till ca 80–90 e.Kr., " +
        "möjligen efter eller samtidigt med Matteus, och ser den — liksom " +
        "Matteus — som byggd på Markusevangeliet plus källan \"Q\".",
      traditions:
        "Kristendom: central, en av de fyra evangelierna, källa till " +
        "julevangeliets herdar och änglar (skilt från Matteus vise män). " +
        "Judendom: ingår inte i judisk skrift. Islam: Jesus (Isa) och " +
        "Johannes Döparen (Yahya) är centrala profeter i Koranen — men, " +
        "liksom för Matteus, förnekar Koranen (sura 4:157) korsfästelsen.",
    },
    {
      id: john.id,
      description:
        "Ett helt fristående fjärde evangelium — delar nästan inga " +
        "berättelser med de tre synoptiska (Matteus/Markus/Lukas). Öppnar " +
        "filosofiskt (\"I begynnelsen var Ordet\") och fokuserar på ett " +
        "fåtal längre, teologiskt djupa scener och samtal (Nikodemus, " +
        "kvinnan vid brunnen, Lasarus uppväckt) istället för många korta " +
        "liknelser.",
      authorship:
        "Traditionellt tillskriven aposteln Johannes, en av Jesu tolv " +
        "lärjungar och ögonvittne. Modern forskning daterar den ofta " +
        "senare än de övriga evangelierna (ca 90–100 e.Kr.) och ser den " +
        "som skriven av en \"johanneisk\" krets/tradition snarare än " +
        "nödvändigtvis av aposteln själv — stilistiskt och teologiskt " +
        "mycket olik de synoptiska evangelierna (bl.a. inga liknelser, " +
        "ingen nattvardsinstiftelse, men långa monologer och \"Jag är\"-" +
        "uttalanden).",
      traditions:
        "Kristendom: central, det \"andliga\" evangeliet — Logos-prologen " +
        "(1:1-18) har haft enormt inflytande på kristen teologi om Kristi " +
        "gudomlighet. Judendom: ingår inte i judisk skrift. Islam: Jesus " +
        "(Isa) central i Koranen, men Johannesevangeliets specifika " +
        "gudoms-teologi (\"Ordet var Gud\") går emot den islamiska synen " +
        "på Jesus som profet, inte Guds son.",
    },
    {
      id: jonah.id,
      description:
        "Kort, fristående berättelse om en profet som flyr sitt uppdrag " +
        "istället för att utföra det — kastas i havet, sväljs av en stor " +
        "fisk, ångrar sig och predikar till slut för Nineve, som omvänder " +
        "sig. Slutar öppet, med Guds retoriska fråga till en Jona som är " +
        "mer arg över en vissnad planta än glad över en räddad stad.",
      authorship:
        "Traditionellt tillskriven profeten Jona själv (aktiv under kung " +
        "Jerobeam II, ca 780-talet f.Kr., se 2 Kung. 14:25). Modern " +
        "forskning daterar boken ofta betydligt senare (ca 400-talet " +
        "f.Kr.) och ser den som en efterhandskonstruerad, satirisk/" +
        "didaktisk berättelse om Jona snarare än en samtida uppteckning — " +
        "till skillnad från de andra \"mindre profeterna\" innehåller " +
        "boken nästan ingen profetia, bara berättelse.",
      traditions:
        "Judendom: läses i sin helhet vid Jom Kippur (försoningsdagen) " +
        "som en påminnelse om Guds vilja att förlåta även icke-judar som " +
        "omvänder sig. Kristendom: Jesus refererar själv till \"Jonas " +
        "tecken\" (Matt. 12:39-40) som en förebild till sin egen död och " +
        "uppståndelse efter tre dagar. Islam: Yunus (Jona) är en erkänd " +
        "profet i Koranen, som har en egen sura (10, Yunus) uppkallad " +
        "efter honom, och nämns även i suran om \"Männen i fisken\".",
    },
    {
      id: ruth.id,
      description:
        "En liten, varm familjeberättelse mitt i domartidens kaos (jfr. " +
        "Domarboken, som utspelar sig samtidigt) — om trohet mellan en " +
        "moabitisk svärdotter och hennes israelitiska svärmor, och om " +
        "Boas som tar sitt ansvar som \"återlösare\" på allvar. Slutar med " +
        "en släkttavla som binder ihop berättelsen med kung David.",
      authorship:
        "Okänd författare. Traditionellt tillskriven profeten Samuel. " +
        "Modern forskning är delad mellan en tidig datering (nära " +
        "domartiden den skildrar, ca 1000-talet f.Kr.) och en betydligt " +
        "senare (ca 500-talet f.Kr., efter den babyloniska fångenskapen) " +
        "— den senare dateringen ser boken som ett medvetet motargument " +
        "mot Esras och Nehemjas krav på att skilja sig från utländska " +
        "hustrur, genom att visa en moabitisk kvinna som blir kung Davids " +
        "gammelmormor.",
      traditions:
        "Judendom: en av de fem \"Megillot\" (bokrullarna), läses i sin " +
        "helhet vid Shavuot (veckohögtiden). Kristendom: Rut nämns i " +
        "Jesu släkttavla i Matteusevangeliet (1:5) — en av endast fyra " +
        "kvinnor som nämns där. Islam: Rut och Boas förekommer inte " +
        "namngivna i Koranen.",
    },
    {
      id: esther.id,
      description:
        "En judinna blir persisk drottning utan att avslöja sitt ursprung, " +
        "och räddar sitt folk från utplåning genom mod, timing och politiskt " +
        "spel snarare än under. Berömd för en litterär särart: grundtexten " +
        "nämner aldrig Gud eller HERREN vid namn — inte en enda gång i hela " +
        "boken — vilket har gjort den till en långvarig judisk och kristen " +
        "diskussion om \"dold\" gudomlig försyn kontra mänskligt handlande.",
      authorship:
        "Okänd författare, sannolikt en persisk jude med god kännedom om " +
        "hovet i Susa. Handlingen utspelar sig under kung Xerxes I:s " +
        "regeringstid (486–465 f.Kr.), men boken dateras vanligen till " +
        "100-talet f.Kr. — flera generationer senare än händelserna den " +
        "skildrar.",
      traditions:
        "Judendom: en av de fem \"Megillot\", läses i sin helhet vid " +
        "Purim, den glada fest boken själv instiftar (9:20-32) — det enda " +
        "bibliska påbudet om en helt ny högtid. Kristendom: ingen direkt " +
        "koppling, men ofta lyft fram som exempel på försyn genom " +
        "till synes vardagliga händelser. Islam: Ester och Mordokai " +
        "förekommer inte namngivna i Koranen.",
    },
    {
      id: daniel.id,
      description:
        "Sex kända berättelser om trohet under press i det babyloniska " +
        "(och senare persiska) fångenskapet — vägran att äta oren mat, " +
        "en tolkad kungadröm, den brinnande ugnen, en förnedrad kung, " +
        "skriften på väggen och lejongropen — följt av (i bokens senare " +
        "hälft, ej indexerad här) en serie apokalyptiska syner om " +
        "kommande världsriken.",
      authorship:
        "Traditionellt tillskriven Daniel själv, en judisk exil vid det " +
        "babyloniska och persiska hovet på 500-talet f.Kr. Modern " +
        "forskning daterar berättelsedelen (kap. 1-6) ofta till 500- " +
        "eller 400-talet f.Kr., men synerna i bokens senare hälft " +
        "(kap. 7-12, med sin mycket precisa historieskrivning \"i " +
        "efterhand\") dateras ofta till 160-talet f.Kr., under den " +
        "grekisk-syriska förföljelsen av judarna (jfr. Antiochos IV).",
      traditions:
        "Judendom: ingår i \"Ketuvim\" (Skrifterna), inte bland " +
        "profetböckerna. Kristendom: räknas som en av de stora " +
        "profeterna, Jesus citerar \"styggelsen som förödelse\" från " +
        "Daniel (Matt. 24:15). Islam: Daniel (Danyal) nämns inte i " +
        "Koranen men förekommer i senare islamisk tradition/hadith-" +
        "litteratur som en profetlik gestalt.",
    },
    {
      id: samuel.id,
      description:
        "Övergången från domartid till kungadöme — Israels sista domare " +
        "Samuel, dess första kung Saul (som stiger och sedan faller) och " +
        "dess näste kung David (som stiger, från herdepojke till " +
        "krigshjälte till jagad flykting). Innehåller några av GT:s mest " +
        "kända enskilda scener: David och Goljat, Jonatans och Davids " +
        "vänskap, David som skonar sin fiendes liv i en grotta.",
      authorship:
        "Okänd författare (den judiska traditionen nämner ibland Samuel " +
        "själv för de tidiga kapitlen, trots att han dör i kapitel 25 — " +
        "boken måste alltså ha flera källor/redaktörer). Modern " +
        "forskning ser den som sammanställd av äldre muntliga och " +
        "skriftliga källor, troligen under kungatiden eller efter, med " +
        "en slutredaktion under eller efter den babyloniska fångenskapen.",
      traditions:
        "Judendom: en av \"de tidiga profeterna\" (tillsammans med Josua, " +
        "Domarboken och Kungaböckerna). Kristendom: grundläggande för " +
        "Davids-linjen i Jesu släkttavla (Matt. 1, Luk. 3). Islam: Dawud " +
        "(David) är en central profet-kung i Koranen; Jalut (Goljat) " +
        "nämns i sura 2 (al-Baqara) i en variant av samma berättelse, " +
        "fast där kopplad till kung Talut (Saul).",
    },
    {
      id: mark.id,
      description:
        "Det kortaste och (troligen) äldsta evangeliet — ett snabbt, " +
        "handlingstätt porträtt av Jesus, med få långa tal och ett " +
        "återkommande fokus på lidande, tjänande och den \"mänskliga\" " +
        "sidan av Jesus (han blir trött, hungrig, förvånad, arg).",
      authorship:
        "Traditionellt tillskriven Johannes Markus, en följeslagare till " +
        "Petrus (inte en av de tolv lärjungarna själv) — enligt tidig " +
        "kyrklig tradition (Papias, ca 100-talet) byggd på Petrus egna " +
        "predikoberättelser. Modern forskning daterar den ofta till strax " +
        "före eller efter Jerusalems fall (ca 65–75 e.Kr.) och ser den som " +
        "den äldsta av de fyra evangelierna — troligen en av källorna både " +
        "Matteus och Lukas byggde vidare på.",
      traditions:
        "Kristendom: kanoniskt evangelium, traditionellt den symboliska " +
        "\"lejonet\" bland evangelisternas symboler (Hesekiel/Uppenbarelsebokens " +
        "väsen). Judendom: ingår inte i judisk skrift. Islam: Jesus (Isa) " +
        "förekommer i Koranen, men inte via Markusevangeliets specifika text.",
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
  // utanför själva bibeltexten. Modellerar de refererade personerna/verken
  // som riktiga Character-poster (inte bara Reference.externalLabel) så de
  // får en egen indexsida precis som bibliska karaktärer, även om de har
  // noll story-framträdanden.
  //
  // RÄTTELSE (2026-08-23): tidigare version av denna kommentar påstod att
  // Nietzsche INTE nämns i Maps of Meaning. Det var fel — det påståendet
  // byggde bara på att ha läst de första ~5–10 minuterna av varje
  // föreläsnings transkript, inte hela. En fullständig textsökning
  // ("grep") genom samtliga redan nedladdade transkript hittade en
  // verifierad Nietzsche-referens i föreläsning 8 (se nedan), plus en lång
  // rad andra namngivna referenser (Freud, Piaget, Darwin, Milton, Dante,
  // och flera Disney-filmer/bokserier) som inte heller fångades upp första
  // gången. De mest substantiella av dessa är nu tillagda nedan.
  //
  // Omfattning: det här är INTE en fullständig genomgång av alla ~30
  // timmar Maps of Meaning-material — det vore inte rimligt att läsa rad
  // för rad. Det är en riktad textsökning efter kända namn/verk
  // (filosofer, psykologer, Disney-filmer, kända bokserier) följt av att
  // varje träff faktiskt lästs i sitt sammanhang innan den skrevs in här.
  // Freud, Piaget och Darwin nämns alla upprepade gånger genom hela
  // serien som återkommande referenspunkter — här finns EN representativ,
  // verifierad referens per person/verk, inte varje enskild gång namnet
  // nämns. En "Al Albert Barn"-referens i föreläsning 10 (troligen
  // bibelforskaren Robert Alter, men ASR-texten är för förvrängd för att
  // vara säker) är fortsatt utelämnad av samma försiktighetsskäl.
  // --- Tillagd 2026-08-23: The Jordan B. Peterson Podcast ------------
  // Petersons eget podcast-flöde är en helt egen källa (inte del av
  // Bibelserien eller Maps of Meaning) — läggs till som ny PetersonSeries
  // första gången här, med avsnitt 491 ("Symbolic Patterns: Memes,
  // Archetypes, Dragons, Genes", med Richard Dawkins & Alex O'Connor,
  // 2024-10-21) som första avsnitt. Efterfrågad direkt av användaren:
  // vilka böcker Peterson refererar till där för att koppla ihop Dawkins
  // meme-teori med Jungianska arketyper. Verifierat mot nedladdat
  // undertext-transkript (yt-dlp auto-captions), inte bara sekundärkällor.
  const jbpPodcastSeries = await prisma.petersonSeries.upsert({
    where: { slug: "jbp-podcast" },
    update: {},
    create: {
      slug: "jbp-podcast",
      title: "The Jordan B. Peterson Podcast",
      isPanelDiscussion: true,
      panelists: "Gäster varierar per avsnitt",
      enabledByDefault: true,
    },
  });
  await prisma.petersonVideo.upsert({
    where: { youtubeId: "8wBtFNj_o5k" },
    update: {
      title: "491. Symbolic Patterns: Memes, Archetypes, Dragons, Genes | Dr. Richard Dawkins & Alex O'Connor",
      seriesId: jbpPodcastSeries.id,
      publishedAt: "2024-10-21",
    },
    create: {
      youtubeId: "8wBtFNj_o5k",
      title: "491. Symbolic Patterns: Memes, Archetypes, Dragons, Genes | Dr. Richard Dawkins & Alex O'Connor",
      seriesId: jbpPodcastSeries.id,
      publishedAt: "2024-10-21",
    },
  });

  const refCharacterDefs: Array<{ slug: string; name: string }> = [
    { slug: "dostojevskij", name: "Fjodor Dostojevskij" },
    { slug: "carl-jung", name: "Carl Jung" },
    { slug: "sigmund-freud", name: "Sigmund Freud" },
    { slug: "platon", name: "Platon" },
    { slug: "sam-harris", name: "Sam Harris" },
    { slug: "alexander-luria", name: "Alexander Luria" },
    { slug: "michelangelo", name: "Michelangelo" },
    { slug: "nietzsche", name: "Friedrich Nietzsche" },
    { slug: "john-milton", name: "John Milton" },
    { slug: "dante", name: "Dante Alighieri" },
    { slug: "jean-piaget", name: "Jean Piaget" },
    { slug: "charles-darwin", name: "Charles Darwin" },
    { slug: "lejonkungen", name: "Lejonkungen (Disneyfilm)" },
    { slug: "tornrosa", name: "Törnrosa (Disneyfilm)" },
    { slug: "den-lilla-sjojungfrun", name: "Den lilla sjöjungfrun (Disneyfilm)" },
    { slug: "peter-pan-film", name: "Peter Pan (Disneyfilm)" },
    { slug: "harry-potter", name: "Harry Potter (bokserie/filmer)" },
    { slug: "sagan-om-ringen", name: "Sagan om ringen / Bilbo (bokserie/filmer)" },
    { slug: "aleksandr-solzhenitsyn", name: "Aleksandr Solzjenitsyn" },
    { slug: "viktor-frankl", name: "Viktor Frankl" },
    { slug: "mircea-eliade", name: "Mircea Eliade" },
    { slug: "james-frazer", name: "James George Frazer" },
    { slug: "marduk", name: "Marduk (mesopotamisk gud)" },
    { slug: "tiamat", name: "Tiamat (mesopotamisk urmoder/kaos)" },
    { slug: "osiris-horus", name: "Osiris/Horus (egyptisk gud)" },
    { slug: "jacques-derrida", name: "Jacques Derrida" },
    { slug: "erich-neumann", name: "Erich Neumann" },
    { slug: "camille-paglia", name: "Camille Paglia" },
    { slug: "frozen-disney", name: "Frost (Disneyfilm)" },
  ];
  const refCharacters: Record<string, { id: string }> = {};
  for (const c of refCharacterDefs) {
    refCharacters[c.slug] = await prisma.character.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // --- Porträtt för refererade personer (Wikimedia Commons) -----------
  // Samma återanvändningsmönster som bibliska karaktärsporträtt, men
  // pekar mot fristående, öppet licensierade porträttfoton/målningar
  // istället för en scenbild ur en indexerad story.
  const refPortraits: Record<string, { path: string; credit: string; creditUrl: string }> = {
    "aleksandr-solzhenitsyn": {
      path: "/images/personer/solzhenitsyn.jpg",
      credit: "Foto: Bert Verhoeff/Anefo, 1974 (Wikimedia Commons, public domain)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Aleksandr_Solzhenitsyn_1974crop.jpg",
    },
    nietzsche: {
      path: "/images/personer/nietzsche.jpg",
      credit: "Foto: Gustav-Adolf Schultze, 1882 (Wikimedia Commons, public domain)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Nietzsche1882.jpg",
    },
    dante: {
      path: "/images/personer/dante.jpg",
      credit: "Målning: Sandro Botticelli, ca 1495 (Wikimedia Commons, public domain)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_Portrait_of_Dante_-_WGA02802.jpg",
    },
    "john-milton": {
      path: "/images/personer/milton.jpg",
      credit: "Målning: tillskriven Godfrey Kneller, 1690 (Wikimedia Commons, public domain)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:John_Milton_portrait_painting.jpg",
    },
    "viktor-frankl": {
      path: "/images/personer/frankl.jpg",
      credit: "Foto: Franz Vesely, 1965 (Wikimedia Commons, CC BY-SA 3.0 DE)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Viktor_Frankl2.jpg",
    },
  };
  for (const [slug, p] of Object.entries(refPortraits)) {
    await prisma.character.update({
      where: { slug },
      data: { portraitPath: p.path, portraitCredit: p.credit, portraitCreditUrl: p.creditUrl },
    });
  }
  console.log(`Seedat ${Object.keys(refPortraits).length} porträtt för refererade personer.`);

  type RefDef = {
    videoYoutubeId: string;
    storySlug?: string; // om referensen görs i samband med en specifik story
    characterSlug: string;
    atSec?: number; // exakt tidsstämpel, verifierad mot transkript
    work?: string; // det specifika verket, bara ifyllt när Peterson faktiskt namnger ett
    note: string;
  };
  const references: RefDef[] = [
    {
      videoYoutubeId: "44f3mxcsI50", storySlug: "cain-and-abel", characterSlug: "dostojevskij",
      work: "Brott och straff",
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
      work: "Pietà (skulptur)",
      note:
        "Använder Michelangelos skulptur Pietà (Maria som håller sin döda, " +
        "korsfäste son) som bild för den yttersta formen av uppoffring — " +
        "en mors villighet att låta sitt barn komma till världen trots att " +
        "hon vet vad som väntar.",
    },

    // --- Tillagda 2026-08-23 efter en riktad textsökning genom samtliga
    // redan nedladdade Maps of Meaning-transkript, se kommentaren ovan. ---
    {
      videoYoutubeId: "Nb5cBkbQpGY", storySlug: "neuropsychology-of-symbolic-representation",
      characterSlug: "nietzsche", atSec: 6642,
      note:
        "Kopplar den mesopotamiska skapelsemyten om Elde-gudarna (Tiamat) " +
        "till Nietzsches 'Gud är död' — kallar det 'ingen skillnad' från " +
        "vad Nietzsche förkunnade, och använder det som språngbräda för en " +
        "kritik av postmodernismen. Följs direkt av Törnrosa-exemplet nedan.",
    },
    {
      videoYoutubeId: "Nb5cBkbQpGY", storySlug: "neuropsychology-of-symbolic-representation",
      characterSlug: "tornrosa", atSec: 6720,
      note:
        "Går igenom scenen där Onda Drottningen fängslat prinsen i " +
        "fängelsehålan (innan hon förvandlas till drake) som bild för den " +
        "'uppslukande modern' — en förälder som håller kvar sitt barn i " +
        "beroende istället för att släppa taget.",
    },
    {
      videoYoutubeId: "Us979jCjHu8", storySlug: "marionettes-and-individuals-2",
      characterSlug: "john-milton", atSec: 6981,
      work: "Paradise Lost",
      note:
        "Rekommenderar att läsa Dantes Inferno tillsammans med Miltons " +
        "Paradise Lost som metafysiska utforskningar av vilka fruktansvärda " +
        "platser förräderi (som Räven och Kattens svek mot Pinocchio) kan " +
        "leda en människa till.",
    },
    {
      videoYoutubeId: "Us979jCjHu8", storySlug: "marionettes-and-individuals-2",
      characterSlug: "dante", atSec: 6978,
      work: "Inferno",
      note:
        "Beskriver förräderi som en av de värsta sakerna en människa kan " +
        "göra en annan — 'det var Dantes idé' — och kopplar det till " +
        "Inferno, läst tillsammans med Miltons Paradise Lost.",
    },
    {
      videoYoutubeId: "EN2lyN7rM4E", storySlug: "marionettes-and-individuals-1",
      characterSlug: "lejonkungen", atSec: 6218,
      note:
        "Använder babianen/schamanen i Lejonkungen — som börjar som en " +
        "komisk 'dåre'-figur och utvecklas till en fullvärdig " +
        "shaman/präst-gestalt — som exempel på Jungs idé att 'dåren' ofta " +
        "förvandlas till frälsaren.",
    },
    {
      videoYoutubeId: "bV16NEWld8Q", storySlug: "marionettes-and-individuals-3",
      characterSlug: "den-lilla-sjojungfrun", atSec: 6955,
      note:
        "Jämför Ursulas förvandling till ett jättelikt drakliknande " +
        "sjöodjur i Den lilla sjöjungfrun med Monstro-valen i Pinocchio — " +
        "båda som symboler för det okända/Kaos i drakform.",
    },
    {
      videoYoutubeId: "bV16NEWld8Q", storySlug: "marionettes-and-individuals-3",
      characterSlug: "harry-potter", atSec: 4736,
      note:
        "Använder Harrys två föräldrapar (familjen Dursley och de " +
        "'magiska' döda föräldrarna) som bild för skillnaden mellan de " +
        "faktiska föräldrarna och natur/kultur som symboliska föräldrar — " +
        "med Freuds/Jungs idé om faderns symboliska död som direkt " +
        "uppföljning (se referensen till Freud nedan).",
    },
    {
      videoYoutubeId: "bV16NEWld8Q", storySlug: "marionettes-and-individuals-3",
      characterSlug: "sigmund-freud", atSec: 4739,
      note:
        "Refererar till Freuds idé att 'ingen kan bli en (fullvärdig) man " +
        "förrän hans far har dött', och Jungs vidareutveckling att det " +
        "dödandet kan — och bör — ske symboliskt snarare än bokstavligt.",
    },
    {
      videoYoutubeId: "bV16NEWld8Q", storySlug: "marionettes-and-individuals-3",
      characterSlug: "sagan-om-ringen", atSec: 7215,
      note:
        "Läser Bilbos resa i Bilbo — En hobbits äventyr (inledningen till " +
        "Sagan om ringen) som samma mönster: en överbeskyddad, passiv " +
        "figur som måste utveckla sina 'mörkare' sidor (bli tjuv, modig) " +
        "för att växa till en fullvärdig individ.",
    },
    {
      videoYoutubeId: "yXZSeiAl4PI", storySlug: "patterns-of-symbolic-representation",
      characterSlug: "peter-pan-film", atSec: 6217,
      note:
        "Läser Peter Pan i Neverland (det arketypiska riket) som en figur " +
        "som vägrar växa upp eftersom alternativet — att bli den " +
        "'dödsbesatte tyrannen' Captain Hook — verkar värre; Tinkerbell " +
        "som den inbillade/overkliga kvinnliga motparten till den " +
        "verkliga Wendy.",
    },
    {
      videoYoutubeId: "RudKmwzDpNY", storySlug: "story-and-metastory-1",
      characterSlug: "jean-piaget", atSec: 2763,
      note:
        "Föredrar Piagets idé att ett fungerande trossystem/kultur i grunden " +
        "är ett gemensamt SPEL alla deltagare spelar (inte i första hand " +
        "en samling föreställningar) — det är därför ingen behöver bli " +
        "upprörd så länge alla spelar samma spel.",
    },
    {
      videoYoutubeId: "RudKmwzDpNY", storySlug: "story-and-metastory-1",
      characterSlug: "charles-darwin", atSec: 446,
      note:
        "Berättar anekdoten om Darwin som om och om igen gick fram till " +
        "kobran i terrariet och blev lika förskräckt varje gång trots att " +
        "han visste att glaset skyddade honom — inledning till Sokolovs " +
        "forskning om hjärnans orienteringsreflex.",
    },

    // --- Tillagd 2026-08-23, från Bibelseriens föreläsning om Jakobs
    // stege (inte Maps of Meaning) — hittad i samband med att Jakob/Esau-
    // berättelserna byggdes ut, se README Fas 9. ---
    {
      videoYoutubeId: "A9JtQN_GoVI", storySlug: "jacob-steals-blessing",
      characterSlug: "dante", atSec: 4267,
      work: "Inferno",
      note:
        "Kopplar Esaus mordplan mot Jakob (efter att ha blivit lurad på " +
        "både förstfödslorätt och välsignelse) till Dantes Inferno, där " +
        "förräderi rankas som det allvarligaste av alla brott — placerat " +
        "längst ner i helvetet, näst intill Satan själv.",
    },
    {
      videoYoutubeId: "DRJKwDfDbco", storySlug: "jacob-serves-laban-for-rachel-and-leah",
      characterSlug: "dostojevskij", atSec: 3594,
      work: "Brott och straff",
      note:
        "Andra gången Brott och straff används för att illustrera skuld: " +
        "kopplar Jakobs 'karmiska' bestraffning (blir själv lurad av " +
        "Laban efter att ha lurat Esau) till hur Raskolnikov, trots att " +
        "han kommer undan mordet obemärkt, drivs av skuld till att i " +
        "praktiken överlämna sig själv till polisen.",
    },

    // --- Tillagda 2026-08-23 (Fas 15, verk-nivå-utbyggnad): Eliade och
    // Frazer i Noa-föreläsningen. ASR-undertexterna stavar namnen
    // katastrofalt fel ("Mercuria Eliata"/"Mel Elliott", "JG Fraser" för
    // "the golden bow") men innehållet är otvetydigt — Eliade namnger
    // sin egen bok, och "golden bow" är uppenbart The Golden Bough. ---
    {
      videoYoutubeId: "wNjbasba-Qw", storySlug: "noahs-flood",
      characterSlug: "mircea-eliade", atSec: 6465,
      work: "A History of Religious Ideas",
      note:
        "Rekommenderar Eliades tre-volyms verk A History of Religious " +
        "Ideas ('brilliant, jag gillar det verkligen') och återger hans " +
        "tes om syndaflodsmyter: att de nästan universellt förekommer " +
        "(dokumenterat på alla kontinenter utom sällan i Afrikas öknar) " +
        "och att de speglar en universell mänsklig idé — att tillvaron " +
        "periodvis 'översvämmas'/faller sönder dels av ren entropi, dels " +
        "i en takt som påskyndas av människans egna synder.",
    },
    {
      videoYoutubeId: "wNjbasba-Qw", storySlug: "noahs-flood",
      characterSlug: "james-frazer", atSec: 6485,
      work: "The Golden Bough",
      note:
        "Nämner (via Eliades egen genomgång) J.G. Frazers klassiska " +
        "jämförande mytologi-verk The Golden Bough som en av de tidiga " +
        "sammanställningarna som visade hur utbrett flodmyten är över " +
        "världens kulturer — en av grundstenarna för hela det " +
        "jämförande-mytologi-fält Eliade och Peterson själv bygger vidare på.",
    },

    // --- Tillagda 2026-08-23: Mesopotamien, Egypten och Logos-idén i
    // föreläsning 8, samt en Derrida/logos-referens i Genesis-föreläsning
    // 2 — grävt fram efter direkt fråga från användaren om just dessa
    // teman. Se README Fas 11 för sammanhang. ---
    {
      videoYoutubeId: "Nb5cBkbQpGY", storySlug: "neuropsychology-of-symbolic-representation",
      characterSlug: "tiamat", atSec: 6910,
      note:
        "Återger den babyloniska skapelsemyten Enuma Elish: Tiamat är de " +
        "äldre gudarnas kaotiska urmoder ('Moder Natur') som — efter att " +
        "hennes make dödats — skapar en armé av 13 monster (chimärer, " +
        "hälften drake/orm/fågel) och utser demonen Kingu ('en tidig " +
        "representation av Satan') till deras general för att utplåna " +
        "gudarna. Ingen av de äldre gudarna vågar möta henne.",
    },
    {
      videoYoutubeId: "Nb5cBkbQpGY", storySlug: "neuropsychology-of-symbolic-representation",
      characterSlug: "marduk", atSec: 7029,
      note:
        "Marduk väljs till 'kungars kung' inte för att han är starkast, " +
        "utan för att han kan SE (ögon runt hela huvudet) och TALA " +
        "(magiska ord som förvandlar natt till dag) — tolkat som " +
        "mänsklighetens första formulering av att uppmärksamt seende och " +
        "sant tal ('logos') bör stå överst i hierarkin. Marduk fångar " +
        "Tiamat i ett nät, fyller henne med vind, dödar henne och styckar " +
        "hennes kropp till världen — och gör människor av Kingus blod, " +
        "vilket Peterson kopplar till syndafallets idé om att människan " +
        "ensam bland varelserna kan ljuga och göra ont med avsikt. Den " +
        "mesopotamiske kejsaren fick sedan rituellt (vid nyår) bekänna " +
        "hur han misslyckats vara 'en god Marduk' föregående år.",
    },
    {
      videoYoutubeId: "Nb5cBkbQpGY", storySlug: "neuropsychology-of-symbolic-representation",
      characterSlug: "osiris-horus", atSec: 8311,
      note:
        "Jämför Marduk-myten med den egyptiska: Farao sågs som en " +
        "förening av Osiris (den mördade, återuppståndne kungen) och " +
        "Horus (sonen som besegrar sin onda farbror Seth och återupprättar " +
        "ordningen) — samma mönster som Marduk mot Tiamat, fast applicerat " +
        "på statens förfall och förnyelse istället för kosmos. Peterson " +
        "spårar sedan en 'demokratisering av Osiris': idén om detta " +
        "gudomliga spred sig från enbart farao, till aristokratin, till " +
        "(hos grekerna) alla fria män, till (hos de kristna) bokstavligen " +
        "alla människor oavsett kön eller status — vilket han kallar " +
        "'grundbulten' för hela idén om den suveräna individens värde i " +
        "västerländsk civilisation.",
    },
    {
      videoYoutubeId: "hdrLQ7DpiWs", storySlug: "creation",
      characterSlug: "jacques-derrida", atSec: 8750,
      note:
        "I en Q&A-diskussion om 'ordet'/Logos i skapelseberättelsen " +
        "(Gud talar världen till existens) kopplar Peterson dagens " +
        "'ideologiska strid' till en 'strid mot logos, i Derridas egna " +
        "termer' — läser postmodern skepsis mot precist, rationellt " +
        "språk som ett medvetet avstånd från logos-idén, och kritiserar " +
        "det som ett sätt att fly undan den 'återlösande kraften i " +
        "dialog' till förmån för ren maktkamp.",
    },

    // --- Tillagda 2026-08-23: The Jordan B. Peterson Podcast avsnitt 491
    // (Dawkins & O'Connor) — de böcker Peterson/O'Connor tar upp för att
    // koppla ihop Dawkins meme-begrepp med Jungianska arketyper. Ingen
    // storySlug (avsnittet är inte knutet till en specifik Bibel-story).
    // OBS om Piaget: användaren undrade om Piaget också hör hit — en
    // fullständig sökning i avsnittets transkript hittade INGEN
    // Piaget-referens i just det här samtalet. Piaget förekommer däremot
    // upprepat i Maps of Meaning (se referensen ovan, föreläsning 5) —
    // det är troligen den kopplingen användaren mindes, inte den här
    // podcasten.
    {
      videoYoutubeId: "8wBtFNj_o5k", characterSlug: "mircea-eliade", atSec: 401,
      work: "The Sacred and the Profane",
      note:
        "Alex O'Connor tar upp om Peterson läst Eliades The Sacred and " +
        "the Profane, som infallsport till att beskriva religiösa idéers " +
        "'virala' spridning och konkurrens mellan kulturers gudsbilder — " +
        "direkt kopplat till samtalets huvudfråga om memer vs. arketyper.",
    },
    {
      videoYoutubeId: "8wBtFNj_o5k", characterSlug: "mircea-eliade", atSec: 407,
      work: "A History of Religious Ideas",
      note:
        "Samma resonemang fortsätter till Eliades tre-volyms A History " +
        "of Religious Ideas ('jag gillar den verkligen') och dess analys " +
        "av 'striden mellan gudarna i himlen' som ett återkommande motiv " +
        "i många kulturer — varje gud som uttryck för ett visst sätt att " +
        "uppfatta/agera i världen, som sedan konkurrerar och bildar en " +
        "hierarki (grobotten för monoteism). Samma bok Peterson själv " +
        "rekommenderar i Noa-föreläsningen (Bibelserien), se ovan.",
    },
    {
      videoYoutubeId: "8wBtFNj_o5k", characterSlug: "erich-neumann", atSec: 3663,
      work: "The Origins and History of Consciousness",
      note:
        "Peterson kallar Erich Neumann (Jungs 'kanske störste elev, " +
        "möjligen den som överträffade honom') författare till 'ett verk " +
        "av geni' i The Origins and History of Consciousness — central " +
        "för hans argument att meme-begreppet och arketyp-begreppet i " +
        "grunden beskriver samma sak.",
    },
    {
      videoYoutubeId: "8wBtFNj_o5k", characterSlug: "erich-neumann", atSec: 3667,
      work: "The Great Mother",
      note:
        "Nämner i samma andetag Neumanns The Great Mother, en studie av " +
        "det feminina symbolspråket ('ett bra bra bok') — Neumanns andra " +
        "stora arketyp-studie utöver Origins and History of Consciousness.",
    },
    {
      videoYoutubeId: "8wBtFNj_o5k", characterSlug: "camille-paglia", atSec: 3659,
      note:
        "Berättar att Camille Paglia studerat Neumanns arbete djupt, och " +
        "att hon trodde att hela den akademiska 'kulturkriget' hade " +
        "kunnat undvikas om universiteten på 1960–70-talen hade vänt sig " +
        "till Neumann istället för åt det håll de faktiskt gick.",
    },

    // --- Tillagda 2026-08-24: Bibelseriens föreläsning om Adam och Eva
    // (Ifi5KkXig3s) — grävt fram efter direkt fråga från användaren om
    // mer material kring Eden/ormen. Samma video/story som verse-
    // noteringarna ovan i FAS 5-blocket. ---
    {
      videoYoutubeId: "Ifi5KkXig3s", storySlug: "garden-of-eden",
      characterSlug: "tornrosa", atSec: 5037,
      note:
        "En ANNAN Törnrosa-läsning än den från Maps of Meaning (se ovan): " +
        "här läses Maleficent som 'den uppslukande modern' i motsatt " +
        "mening — kungaparets ÖVERbeskydd av Törnrosa (genom att hålla " +
        "henne borta från allt hemskt) gör henne så naiv att hennes " +
        "första kärleksmöte nästan knäcker henne helt.",
    },
    {
      videoYoutubeId: "Ifi5KkXig3s", storySlug: "garden-of-eden",
      characterSlug: "frozen-disney", atSec: 5201,
      note:
        "Nämner (mycket kritiskt — 'that absolutely appalling piece of " +
        "rubbish') Frost som ett medvetet svar på kritiken att Törnrosa " +
        "behöver en prins som räddare — utan att gå in på varför han " +
        "ogillar filmen så starkt.",
    },
    {
      videoYoutubeId: "Ifi5KkXig3s", storySlug: "garden-of-eden",
      characterSlug: "harry-potter", atSec: 5591,
      note:
        "En annan Harry Potter-koppling än den från Maps of Meaning (se " +
        "ovan): pekar på likheten mellan ett urgammalt alkemistiskt " +
        "symbol (kallat 'the round chaos', en orm/drake som föregår " +
        "manligt/kvinnligt) och den gyllene kvicken i Quidditch — och " +
        "undrar högt hur J.K. Rowling kände till en så obskyr symbol.",
    },
  ];

  for (const r of references) {
    const video = await prisma.petersonVideo.findUniqueOrThrow({ where: { youtubeId: r.videoYoutubeId } });
    const story = r.storySlug ? await prisma.story.findFirst({ where: { slug: r.storySlug } }) : null;
    const characterId = refCharacters[r.characterSlug].id;
    await prisma.reference.upsert({
      where: { videoId_storyId_characterId: { videoId: video.id, storyId: story?.id ?? "", characterId } },
      update: { note: r.note, atSec: r.atSec, work: r.work },
      create: { videoId: video.id, storyId: story?.id, characterId, atSec: r.atSec, work: r.work, note: r.note },
    });
  }
  console.log(`Seedat referens-index: ${refCharacterDefs.length} refererade personer, ${references.length} referenser.`);

  // --- Bok-interna referenser i 12 Rules for Life --------------------
  // Samma Reference-modell, men källan är ett bokkapitel (bookSourceRef)
  // istället för en video — inget videoId. Svarar på: vilka andra
  // personer/verk/berättelser refererar Jordan till INOM respektive
  // kapitel i 12 Rules for Life, vad är poängen han gör med referensen,
  // och hur kopplar han den till den moderna läsarens liv.
  //
  // OMFATTNING (viktigt): till skillnad från YouTube-materialet har vi
  // INGET transkript av boken att verifiera mot (den är fortfarande
  // upphovsrättsskyddad och i tryck). Varje post nedan är därför
  // korskontrollerad mot minst två oberoende sekundärkällor (främst
  // LitCharts karaktärs-/kapitelanalyser) 2026-08-23 — men det är EN
  // riktad research-insats, inte en fullständig genomgång av alla tolv
  // kapitel. Solzjenitsyn/Gulagarkipelagen är den enda referens som med
  // säkerhet återkommer i FLERA kapitel (regel 6, 8, 11); övriga kapitel
  // (1, 3, 4, 5, 9, 10, 12) saknar här en lika tydligt verifierbar,
  // namngiven extern referens och är därför utelämnade snarare än gissade.
  type BookRefDef = {
    id: string;
    ruleOrder: number;
    storySlug?: string;
    characterSlug?: string;
    note: string;
  };
  const bookReferences: BookRefDef[] = [
    {
      id: "seed-bookref-rules2-eden", ruleOrder: 2, storySlug: "garden-of-eden",
      note:
        "Använder syndafallsberättelsen (Adam och Eva) som psykologisk " +
        "förklaringsmodell: självmedvetenheten om den egna sårbarheten och " +
        "skammen efter syndafallet gör det lätt att förakta och försumma " +
        "sig själv — vilket enligt Peterson är varför så många är sämre " +
        "på att ta hand om sig själva än om t.ex. ett husdjur de älskar. " +
        "Modern koppling: samma mekanism ligger enligt honom bakom att " +
        "hoppa över läkarbesök eller stanna kvar i ohälsosamma vanor — " +
        "inte av okunskap, utan av en djupt rotad känsla av att inte " +
        "förtjäna samma omsorg man skulle ge någon annan.",
    },
    {
      id: "seed-bookref-rules6-solzhenitsyn", ruleOrder: 6, characterSlug: "aleksandr-solzhenitsyn",
      note:
        "Använder Solzjenitsyns liv — år i sovjetiska arbetsläger, sedan " +
        "cancer — som motexempel till bitterhet: istället för att skylla " +
        "på systemet vände han blicken inåt, granskade sina egna moraliska " +
        "misslyckanden, och kanaliserade det i Gulagarkipelagen, ett verk " +
        "som senare bidrog till att underminera det system han hade all " +
        "rätt att hata. Modern koppling: kapitlet ställer detta mot " +
        "skolskjutares (bl.a. Columbine) hämndfantasier mot 'samhället' — " +
        "en extrem, destruktiv variant av att skylla utåt istället för att " +
        "sätta sitt eget hus i ordning.",
    },
    {
      id: "seed-bookref-rules7-cain-abel", ruleOrder: 7, storySlug: "cain-and-abel",
      note:
        "Läser Kain och Abel som en studie i vad som händer när uppoffring " +
        "upprepat känns meningslös: Kains offer avvisas, hans bitterhet " +
        "växer, och istället för självrannsakan väljer han hämnd — den " +
        "arketypiska vägen från besvikelse till katastrof. Modern " +
        "koppling: samma mönster (upplevd orättvisa → bitterhet → " +
        "hämndfantasier, i extremfall verkligt våld) ligger enligt " +
        "Peterson bakom en del skolskjutningar och terrordåd — därför " +
        "framhålls tålamod och fortsatt investering i framtiden, trots " +
        "motgång, som motgiftet.",
    },
    {
      id: "seed-bookref-rules8-solzhenitsyn", ruleOrder: 8, characterSlug: "aleksandr-solzhenitsyn",
      note:
        "Använder Gulagarkipelagen för att visa hur vanliga människors " +
        "vardagliga undvikande av obekväma sanningar och konfrontationer " +
        "— 'det är lättare att bara inte säga något' — i aggregat är " +
        "precis den mekanism som gör att totalitära system kan växa sig " +
        "starka. Modern koppling: varje litet undvikande (att inte säga " +
        "ifrån, att låtsas hålla med) är enligt Peterson inte harmlöst " +
        "utan en övning i svek mot sanningen som gör nästa svek lättare.",
    },
    {
      id: "seed-bookref-rules8-frankl", ruleOrder: 8, characterSlug: "viktor-frankl",
      note:
        "Citerar Viktor Frankl (Auschwitz-överlevare, författare till " +
        "Livet måste ha mening) för idén att lögner är en förutsättning " +
        "för totalitarism — ett tvångssystem kräver att människor " +
        "accepterar och upprepar falskheter för att fungera. Modern " +
        "koppling: Peterson drar slutsatsen att personlig sanningsenlighet, " +
        "även i vardagliga, obekväma situationer, är ett skydd mot att " +
        "hela samhällen glider mot förtryck — inte bara en privat dygd.",
    },
    {
      id: "seed-bookref-rules11-solzhenitsyn", ruleOrder: 11, characterSlug: "aleksandr-solzhenitsyn",
      note:
        "Lyfter fram Solzjenitsyn som en av få västerländska intellektuella " +
        "som tidigt och korrekt identifierade sovjetkommunismens verkliga " +
        "natur — ett system byggt på tvångsarbete och terror, inte (som " +
        "många då hävdade) en missförstådd men i grunden god idé. Modern " +
        "koppling: exemplet används som varning för hur lätt intellektuella " +
        "kan blunda för obekväma sanningar när de inte passar den egna " +
        "ideologin — ett tema Peterson kopplar vidare till kapitlets " +
        "kritik av förenklade, ideologiskt styrda samhällsanalyser idag.",
    },
  ];
  for (const r of bookReferences) {
    // OBS (rättat 2026-08-24): storyId pekar nu på REGELNS EGEN story
    // (i 12-rules-for-life-boken), inte längre på ett ev. tvärbok-mål
    // (r.storySlug, t.ex. Genesis "garden-of-eden") — annars dök inte
    // dessa referenser upp alls i karaktärsremsan på 12 Rules for Life-
    // sidan (som bara känner till References vars storyId hör till EN
    // av bokens egna stories), och de syntes aldrig heller på själva
    // regel-sidan. Tvärboks-kopplingen finns ändå kvar i klartext i
    // `note`. r.storySlug behålls i typen som dokumentation men används
    // inte längre för uppslagning.
    const ruleStory = await prisma.story.findFirstOrThrow({
      where: { bookId: rulesBook.id, orderInBook: r.ruleOrder },
    });
    const storyId = ruleStory.id;
    const characterId = r.characterSlug ? refCharacters[r.characterSlug].id : null;
    await prisma.reference.upsert({
      where: { id: r.id },
      update: { storyId, characterId, note: r.note, bookSourceRef: `12 Rules for Life, Regel ${r.ruleOrder}` },
      create: {
        id: r.id,
        storyId,
        characterId,
        note: r.note,
        bookSourceRef: `12 Rules for Life, Regel ${r.ruleOrder}`,
      },
    });
  }
  console.log(`Seedat bok-interna referenser i 12 Rules for Life: ${bookReferences.length}.`);

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

  // ======================================================================
  // FAS 21: Prioritetsnivåer (Tier 1/2/3) — handplockad Tier 2-lista
  // ======================================================================
  // Tier 1 härleds i appen (hasPetersonContent), inte lagrat här. Denna
  // lista är bara Tier 2 = "känd/central berättelse trots att Peterson
  // (ännu) inte kopplats till den". Byggd 2026-08-23 genom att gå igenom
  // ALLA stories utan petersonSegments/quote och bedöma allmän kändhet —
  // se README för resonemang. Allt som INTE står här och saknar Peterson-
  // koppling blir automatiskt Tier 3 (default isWellKnown=false).
  const wellKnownSlugs: Array<{ bookSlug: string; storySlug: string }> = [
    { bookSlug: "genesis", storySlug: "jacob-in-egypt-and-death" },
    // NY 2026-08-27: fyller ut Abraham- och Jakob-cyklerna med fyra till
    // välkända berättelser (se README Fas 38).
    { bookSlug: "genesis", storySlug: "hagar-and-ishmael" },
    { bookSlug: "genesis", storySlug: "isaac-born-and-ishmael-sent-away" },
    { bookSlug: "genesis", storySlug: "rebekah-at-the-well" },
    { bookSlug: "genesis", storySlug: "jacob-and-esau-reconciled" },
    // NY 2026-08-27, se README Fas 44 — båda välkända (bl.a. egna
    // Torah-parashor), trots att Peterson inte täckt dem.
    { bookSlug: "genesis", storySlug: "dinah" },
    { bookSlug: "genesis", storySlug: "judah-and-tamar" },
    { bookSlug: "exodus", storySlug: "moses-in-the-basket" },
    { bookSlug: "exodus", storySlug: "burning-bush" },
    { bookSlug: "exodus", storySlug: "passover-and-exodus" },
    { bookSlug: "exodus", storySlug: "crossing-the-red-sea" },
    { bookSlug: "exodus", storySlug: "water-from-rock-and-amalek" },
    { bookSlug: "matthew", storySlug: "nativity" },
    { bookSlug: "matthew", storySlug: "baptism-of-jesus" },
    { bookSlug: "matthew", storySlug: "temptation-in-wilderness" },
    { bookSlug: "matthew", storySlug: "calling-of-first-disciples" },
    { bookSlug: "matthew", storySlug: "sermon-on-the-mount" },
    { bookSlug: "matthew", storySlug: "calming-the-storm" },
    { bookSlug: "matthew", storySlug: "parable-of-the-sower" },
    { bookSlug: "matthew", storySlug: "feeding-the-5000" },
    { bookSlug: "matthew", storySlug: "walking-on-water" },
    { bookSlug: "matthew", storySlug: "transfiguration" },
    { bookSlug: "matthew", storySlug: "triumphal-entry" },
    { bookSlug: "matthew", storySlug: "cleansing-of-the-temple" },
    { bookSlug: "matthew", storySlug: "sheep-and-the-goats" },
    { bookSlug: "matthew", storySlug: "last-supper" },
    { bookSlug: "matthew", storySlug: "gethsemane" },
    { bookSlug: "matthew", storySlug: "trial-before-pilate" },
    { bookSlug: "luke", storySlug: "good-samaritan" },
    { bookSlug: "luke", storySlug: "prodigal-son" },
    { bookSlug: "luke", storySlug: "zacchaeus" },
    // NY 2026-08-25: alla tre lika kända/centrala som de tre ovan.
    { bookSlug: "luke", storySlug: "mary-and-martha" },
    { bookSlug: "luke", storySlug: "lost-sheep-and-coin" },
    { bookSlug: "luke", storySlug: "rich-man-and-lazarus" },
    // NY 2026-08-27: fyra till av Lukas mest kända berättelser.
    { bookSlug: "luke", storySlug: "shepherds-and-the-birth-of-jesus" },
    { bookSlug: "luke", storySlug: "jesus-in-the-temple-at-twelve" },
    { bookSlug: "luke", storySlug: "pharisee-and-tax-collector" },
    { bookSlug: "luke", storySlug: "road-to-emmaus" },
    // NY 2026-08-25: alla fem lika kända/centrala — missades av misstag
    // när Johannes lades till.
    { bookSlug: "john", storySlug: "john-prologue" },
    { bookSlug: "john", storySlug: "wedding-at-cana" },
    { bookSlug: "john", storySlug: "nicodemus" },
    { bookSlug: "john", storySlug: "woman-at-the-well" },
    { bookSlug: "john", storySlug: "lazarus-raised" },
    { bookSlug: "john", storySlug: "washing-of-feet" },
    { bookSlug: "john", storySlug: "doubting-thomas" },
    // NY 2026-08-27: tre till av Johannes mest kända berättelser.
    { bookSlug: "john", storySlug: "woman-caught-in-adultery" },
    { bookSlug: "john", storySlug: "man-born-blind" },
    { bookSlug: "john", storySlug: "peter-restored" },
    // NY 2026-08-26: Markusevangeliets tre första berättelser — alla
    // välkända bibelberättelser som ofta citeras oberoende av evangelium.
    { bookSlug: "mark", storySlug: "blind-man-at-bethsaida" },
    { bookSlug: "mark", storySlug: "rich-young-ruler" },
    { bookSlug: "mark", storySlug: "blind-bartimaeus" },
    { bookSlug: "mark", storySlug: "widows-mite" },
    // NY 2026-08-26: hela Jona-boken — en av GT:s mest kända berättelser
    // oavsett religiös bakgrund (valen, fisken, Nineve).
    { bookSlug: "jonah", storySlug: "jonahs-calling-and-flight" },
    { bookSlug: "jonah", storySlug: "jonah-in-the-fish" },
    { bookSlug: "jonah", storySlug: "nineveh-repents" },
    { bookSlug: "jonah", storySlug: "jonahs-anger-and-gods-lesson" },
    // NY 2026-08-26: hela Rut-boken — en av GT:s mest lästa och älskade
    // berättelser, central i judisk tradition (Shavuot) och i Jesu
    // släkttavla.
    { bookSlug: "ruth", storySlug: "naomi-and-ruths-loyalty" },
    { bookSlug: "ruth", storySlug: "ruth-gleans-in-boaz-field" },
    { bookSlug: "ruth", storySlug: "ruth-at-the-threshing-floor" },
    { bookSlug: "ruth", storySlug: "boaz-marries-ruth" },
    // NY 2026-08-26: hela Ester-boken — en av GT:s mest dramatiska och
    // mest kända berättelser, grunden för Purimfesten.
    { bookSlug: "esther", storySlug: "vashti-and-the-search-for-a-queen" },
    { bookSlug: "esther", storySlug: "hamans-decree-against-the-jews" },
    { bookSlug: "esther", storySlug: "esther-risks-her-life" },
    { bookSlug: "esther", storySlug: "the-kings-sleepless-night" },
    { bookSlug: "esther", storySlug: "haman-falls" },
    { bookSlug: "esther", storySlug: "purim-established" },
    // NY 2026-08-27: Daniels sex klassiska berättande kapitel — bland
    // GT:s mest kända berättelser överhuvudtaget.
    { bookSlug: "daniel", storySlug: "daniel-refuses-the-kings-food" },
    { bookSlug: "daniel", storySlug: "nebuchadnezzars-statue-dream" },
    { bookSlug: "daniel", storySlug: "the-fiery-furnace" },
    { bookSlug: "daniel", storySlug: "nebuchadnezzars-madness" },
    { bookSlug: "daniel", storySlug: "belshazzars-feast" },
    { bookSlug: "daniel", storySlug: "daniel-in-the-lions-den" },
    // NY 2026-08-27: hela Första Samuelsboken — se README/Bibel-
    // överblicken, den starkaste kandidaten i hela GT.
    { bookSlug: "1-samuel", storySlug: "hannah-and-the-birth-of-samuel" },
    { bookSlug: "1-samuel", storySlug: "god-calls-samuel" },
    { bookSlug: "1-samuel", storySlug: "saul-anointed-king" },
    { bookSlug: "1-samuel", storySlug: "saul-rejected-as-king" },
    { bookSlug: "1-samuel", storySlug: "david-anointed-king" },
    { bookSlug: "1-samuel", storySlug: "david-and-goliath" },
    { bookSlug: "1-samuel", storySlug: "david-and-jonathans-friendship" },
    { bookSlug: "1-samuel", storySlug: "david-spares-sauls-life" },
    { bookSlug: "1-samuel", storySlug: "death-of-saul" },
    // NY 2026-08-27: fyra korta boktillägg på användarens begäran.
    { bookSlug: "leviticus", storySlug: "nadab-and-abihu" },
    { bookSlug: "deuteronomy", storySlug: "death-of-moses" },
    { bookSlug: "job", storySlug: "jobs-trial" },
    { bookSlug: "song-of-songs", storySlug: "song-of-songs" },
    { bookSlug: "jeremiah", storySlug: "jeremiah-in-the-cistern" },
    { bookSlug: "2-samuel", storySlug: "davids-lament" },
    { bookSlug: "2-samuel", storySlug: "ark-to-jerusalem-david-king" },
    { bookSlug: "2-samuel", storySlug: "davidic-covenant" },
    { bookSlug: "2-samuel", storySlug: "david-and-bathsheba" },
    { bookSlug: "2-samuel", storySlug: "absaloms-rebellion" },
    { bookSlug: "1-kings", storySlug: "solomons-wisdom" },
    { bookSlug: "1-kings", storySlug: "temple-built-and-dedicated" },
    { bookSlug: "1-kings", storySlug: "elijah-and-the-prophets-of-baal" },
    { bookSlug: "1-kings", storySlug: "elijah-at-horeb" },
    { bookSlug: "numbers", storySlug: "twelve-spies" },
    { bookSlug: "numbers", storySlug: "korahs-rebellion" },
    { bookSlug: "numbers", storySlug: "bronze-serpent" },
    { bookSlug: "numbers", storySlug: "balaams-donkey" },
    { bookSlug: "judges", storySlug: "deborah-and-barak" },
    { bookSlug: "judges", storySlug: "gideon" },
    { bookSlug: "judges", storySlug: "samson" },
    { bookSlug: "1-kings", storySlug: "queen-of-sheba" },
    { bookSlug: "1-kings", storySlug: "kingdom-divided" },
    { bookSlug: "2-kings", storySlug: "elijahs-ascension" },
    { bookSlug: "2-kings", storySlug: "naaman-healed" },
    { bookSlug: "2-kings", storySlug: "hezekiah-and-sennacherib" },
    { bookSlug: "nehemiah", storySlug: "nehemiah-rebuilds-the-wall" },
    { bookSlug: "acts", storySlug: "pentecost" },
    { bookSlug: "acts", storySlug: "stephen-martyred" },
    { bookSlug: "acts", storySlug: "pauls-conversion" },
    { bookSlug: "acts", storySlug: "paul-and-silas-in-prison" },
    { bookSlug: "luke", storySlug: "annunciation" },
    { bookSlug: "joshua", storySlug: "battle-of-jericho" },
    // ("moses-flees-to-midian" och "the-tabernacle" lämnas medvetet som
    // Tier 3 — mindre kända/mer perifera även bland bibelläsare.)
  ];
  for (const { bookSlug, storySlug } of wellKnownSlugs) {
    await prisma.story.updateMany({
      where: { slug: storySlug, book: { slug: bookSlug } },
      data: { isWellKnown: true },
    });
  }
  console.log(`Seedat Tier 2 (handplockat kända): ${wellKnownSlugs.length} berättelser.`);

  // ======================================================================
  // FAS 27: Skrivtid-uppskattningar (för /tidslinje) + tidslinje-metadata
  // ======================================================================
  // Kort, fri-text sammanfattning av samma dateringsresonemang som redan
  // finns i respektive boks `authorship`-fält (traditionell datering vs.
  // modern forskningskonsensus) — bara komprimerat till en rad för
  // tidslinjens kompakta vy.
  const writtenEstimates: Array<{ slug: string; estimate: string }> = [
    { slug: "genesis", estimate: "Traditionellt ca 1200-talet f.Kr. (Mose) — moderna forskare daterar ofta källorna till ca 950–500 f.Kr., slutredigering ca 500–400 f.Kr." },
    { slug: "exodus", estimate: "Traditionellt ca 1200-talet f.Kr. — moderna forskare ofta ca 600–500 f.Kr. för slutredigeringen." },
    { slug: "mark", estimate: "Traditionellt ca 55–65 e.Kr. (byggd på Petrus predikan) — moderna forskare ofta ca 65–75 e.Kr., troligen det äldsta evangeliet." },
    { slug: "jonah", estimate: "Traditionellt ca 780-talet f.Kr. (Jona själv, under kung Jerobeam II) — moderna forskare ofta ca 400-talet f.Kr., en betydligt senare, efterhandskonstruerad berättelse." },
    { slug: "ruth", estimate: "Okänd författare. Handlingen utspelar sig under domartiden (ca 1100-talet f.Kr.) — men boken kan vara nedtecknad betydligt senare, ofta daterad till ca 500-talet f.Kr." },
    { slug: "esther", estimate: "Okänd författare. Handlingen utspelar sig under kung Xerxes I (486–465 f.Kr.), men boken dateras vanligen till 100-talet f.Kr." },
    { slug: "daniel", estimate: "Traditionellt tillskriven Daniel själv (500-talet f.Kr.) — moderna forskare daterar ofta berättelsedelen (kap. 1-6) till 500/400-talet f.Kr. och synerna (kap. 7-12) till ca 160-talet f.Kr." },
    { slug: "1-samuel", estimate: "Okänd författare — handlingen utspelar sig ca 1100–1000-talet f.Kr., men boken sammanställdes troligen under eller efter kungatiden, med slutredaktion under/efter den babyloniska fångenskapen (ca 500-talet f.Kr.)." },
    { slug: "leviticus", estimate: "Traditionellt Mose (ca 1200-talet f.Kr.) — moderna forskare ser den ofta som prästerlig text sammanställd över lång tid." },
    { slug: "deuteronomy", estimate: "Traditionellt Mose (ca 1200-talet f.Kr.) — moderna forskare kopplar den ofta till Josias reform (ca 620 f.Kr.)." },
    { slug: "job", estimate: "Okänd författare och en av GT:s mest omdebatterade dateringar — förslag spänner från patriark-tid till efter den babyloniska fångenskapen." },
    { slug: "song-of-songs", estimate: "Traditionellt Salomo (ca 900-talet f.Kr.) — moderna forskare daterar den ofta senare, ibland till efterexilisk tid." },
    { slug: "jeremiah", estimate: "Traditionellt Jeremia/Baruk (sent 600-talet–tidigt 500-talet f.Kr., under och efter Jerusalems fall 587 f.Kr.) — moderna forskare ser boken som redigerad/utvidgad i flera steg efteråt." },
    { slug: "joshua", estimate: "Traditionellt Josua själv (ca 1200-talet f.Kr.) — moderna forskare daterar slutredigeringen ofta till ca 600-talet f.Kr. eller senare, som del av det deuteronomistiska historieverket." },
    { slug: "2-samuel", estimate: "Okänd författare — handlingen utspelar sig ca 1000-talet f.Kr., men boken sammanställdes troligen under eller efter kungatiden, med slutredaktion under/efter den babyloniska fångenskapen (ca 500-talet f.Kr.)." },
    { slug: "1-kings", estimate: "Okänd författare — handlingen utspelar sig ca 970-850-talet f.Kr., men boken sammanställdes troligen under eller efter kungatiden, med slutredaktion under/efter den babyloniska fångenskapen (ca 500-talet f.Kr.)." },
    { slug: "numbers", estimate: "Traditionellt Mose (ca 1200-talet f.Kr.) — moderna forskare ser den som en sammanvävning av flera äldre källor, slutredigerad betydligt senare." },
    { slug: "judges", estimate: "Okänd författare — handlingen utspelar sig ca 1200-1050-talet f.Kr., men boken sammanställdes troligen under kungatiden eller senare." },
    { slug: "2-kings", estimate: "Okänd författare — handlingen utspelar sig ca 850-560-talet f.Kr., men boken fick sin slutredaktion under/efter den babyloniska fångenskapen (ca 500-talet f.Kr.)." },
    { slug: "nehemiah", estimate: "Traditionellt Nehemja själv (ca 440-talet f.Kr., baserat på \"Nehemja-memoaren\") — moderna forskare daterar slutredigeringen ofta till ca 400-talet f.Kr." },
    { slug: "acts", estimate: "Traditionellt ca 62-63 e.Kr. (slutar mitt i Paulus fångenskap, utan att nämna hans död) — moderna forskare daterar den ofta till ca 80-90 e.Kr., strax efter Lukasevangeliet." },
    { slug: "matthew", estimate: "Traditionellt ca 70–80 e.Kr. — moderna forskare ofta ca 80–90 e.Kr." },
    { slug: "luke", estimate: "Traditionellt ca 60 e.Kr. — moderna forskare ofta ca 80–90 e.Kr., efter eller samtidigt med Matteus." },
    { slug: "john", estimate: "Traditionellt ca 90 e.Kr. (apostelns höga ålder) — moderna forskare ofta ca 90–100 e.Kr., det senast skrivna evangeliet." },
    { slug: "maps-of-meaning-2017", estimate: "Föreläsningar hållna 2017 (boken med samma namn gavs ut 1999)." },
    { slug: "12-rules-for-life", estimate: "2018" },
    { slug: "we-who-wrestle-with-god", estimate: "2024" },
    { slug: "beyond-order", estimate: "2021" },
  ];
  for (const { slug, estimate } of writtenEstimates) {
    await prisma.book.updateMany({ where: { slug }, data: { writtenEstimate: estimate } });
  }
  console.log(`Seedat skrivtid-uppskattningar: ${writtenEstimates.length} böcker.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
