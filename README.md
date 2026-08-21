# Berättelseindex

Ett lokalt verktyg för att bläddra i Bibelns (och senare andra centrala
texters) berättelser, med Jordan Petersons YouTube-föreläsningar som
fördjupande guide där de finns.

Bakgrund och fullständig plan diskuterades i chatten som skapade detta
projekt (2026-08-21) — se det samtalet för resonemang och research bakom
besluten nedan. Detta dokument är den levande sammanfattningen.

## Status: prototyp, fas 1 (textindex)

Det som finns just nu:

- **Datamodell** (`prisma/schema.prisma`): Corpus → Book → Story, med
  `Character`/`StoryCharacter` för att härleda "återkommande karaktär"
  automatiskt (finns karaktären i ≥2 stories räknas det som en cykel),
  `Theme` för temataggar, och `PetersonVideo`/`PetersonSegment` för
  video→berättelse-koppling med exakt tidsstämpel.
- **Seed-data** (`prisma/seed.ts`): 13 berättelser i Genesis (skapelsen t.o.m.
  Josef), grupperade i tre cykler (Noa, Abraham, Jakob) + enskilda
  berättelser. Metadata för Jordan Petersons 15 Genesis-föreläsningar och
  hans 5-delade "Death and Resurrection of Christ"-serie — **utan** riktiga
  YouTube-ID:n eller tidsstämplar än (se "Nästa steg").
- **UI**: startsida (böcker) → bokvy (berättelser grupperade cykel/enskild,
  med karaktärs- och tema-taggar) → berättelsevy (textreferens + Peterson-guide
  med grov titel-baserad kandidatmatchning tills riktig segmentdata finns).

## Källor (för research bakom seed-datat)

- Genesis-seriens 15 titlar: korsverifierat mot flera oberoende sidor
  (bl.a. [thecslewis-studygroup.org](https://thecslewis-studygroup.org/visitors-space-3/bible-series-jordan-petereson/)).
- "The Death and Resurrection of Christ: A Commentary in Five Parts" (2018),
  Petersons egen [tweet](https://x.com/jordanbpeterson/status/982000875915923456)
  och [Freerepublic-repost](https://freerepublic.com/focus/f-bloggers/3645367/posts).
- Exodus-serien (2021–2023, DailyWire+): 16 avsnitt, **paneldiskussion**
  (Peterson + Douglas Hedley, Os Guinness, James Orr, Dennis Prager, Stephen
  Blackwood, Jonathan Pageau), **bakom betalvägg**. Se [dailywire.com/show/exodus](https://www.dailywire.com/show/exodus).
  Inte solo-JP och inte fritt tillgänglig → hanteras separat, se nedan.

## Viktig avgränsning: upphovsrätt

- Vi lagrar **inte** bibeltext i databasen. `Story.startRef`/`endRef` pekar
  bara på ett referensintervall; själva versen hämtas on-demand från en
  öppen bibel-API (t.ex. [bible-api.com](https://bible-api.com), World
  English Bible, public domain).
- Vi lagrar **inte** fullständiga videotranskript, bara egna korta
  sammanfattningar (`PetersonSegment.keyPoints`) + länk med tidsstämpel till
  originalvideon på YouTube.
- **Exodus-serien** (DailyWire+, betalvägg) hanteras extra försiktigt: vi bör
  bara länka till trailer/köpsida, inte återge betalinnehåll, även för eget
  bruk — se avstämning i chatten (verktyget är för eget bruk, men vi håller
  ändå denna gräns för säkerhets skull).

## Nästa steg

1. **Fyll i riktiga YouTube-ID:n** för `PENDING-genesis-*` och
   `PENDING-christ-*` i `prisma/seed.ts` — hämta från den officiella
   spellistan (t.ex. `youtube.com/playlist?list=PLCew51JD0hBFfOUYl31kz23qPylA9QBnP`,
   verifiera mot Petersons egen kanal) via YouTube Data API eller `yt-dlp
   --flat-playlist`.
2. **Transkript → segment**: hämta undertexter per video (`yt-dlp
   --write-auto-sub`), och för var och en manuellt/halvautomatiskt (AI-
   assisterat) markera var respektive `Story` börjar/slutar i videon →
   fyll `PetersonSegment` med riktiga `startSec`/`endSec` + egen
   `keyPoints`-sammanfattning. ~20 videor totalt för Genesis + Kristus-serien,
   görbart för hand.
3. **Koppla in textfetch** mot bible-api.com i berättelsevyn (ersätt
   TODO-texten i `src/app/[corpus]/[book]/[story]/page.tsx`).
4. **Utöka Genesis-indexet** om fler substories önskas (just nu 13 stycken,
   kan brytas ner finare, t.ex. separera "Abraham och Lot" i fler delar).
5. **Nya Testamentet**: samma mönster, bygg vidare seed-data.
6. **Koranen**: ny `Corpus` (`quran`), egna `Book`/`Story` — utan
   `PetersonVideo`-koppling till att börja med (JP har ingen dedikerad
   Koran-genomgång).
7. **Exodus-serien**: ta separat beslut om hur/om den ska kopplas in, givet
   betalväggen.
8. **Nietzsche/Dostojevskij/Jung/Campbell**: egen "discovery-fas" — inget
   färdigt index finns, kräver att leta upp relevanta klipp i Petersons
   poddavsnitt/föreläsningar manuellt.

## Kom igång

```bash
npm install
npm run db:push    # skapar/uppdaterar dev.db från schema.prisma
npm run db:seed    # fyller Genesis-indexet
npm run dev         # startar appen på http://localhost:3000
```

`npm run db:studio` öppnar Prisma Studio för att bläddra/redigera datan
direkt.
