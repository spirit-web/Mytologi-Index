# Berättelseindex

Ett lokalt verktyg för att bläddra i Bibelns (och senare andra centrala
texters) berättelser, med Jordan Petersons YouTube-föreläsningar som
fördjupande guide där de finns.

Bakgrund och fullständig plan diskuterades i chatten som skapade detta
projekt (2026-08-21, uppdaterad samma dag efter feedback) — se det
samtalet för resonemang och research bakom besluten nedan. Detta dokument
är den levande sammanfattningen.

## Status: prototyp, fas 1 (textindex) + schema för fas 2–4

Det som finns just nu:

- **Datamodell** (`prisma/schema.prisma`): `Corpus → Book → Story`, med
  `Character`/`StoryCharacter` för att härleda "återkommande karaktär"
  automatiskt (finns karaktären i ≥2 stories räknas det som en cykel),
  `Theme` för temataggar, `PetersonSeries` → `PetersonVideo` →
  `PetersonSegment` för video↔berättelse med exakt tidsstämpel, `Reference`
  för "vilka källor/personer/berättelser illustrerar Peterson sina poänger
  med", och `Parallel`/`ParallelStory` för tvärtext-jämförelser
  (arketyper som återkommer i flera berättelser/texter).
- **Seed-data** (`prisma/seed.ts`): 13 berättelser i Genesis (skapelsen t.o.m.
  Josef), grupperade i tre cykler (Noa, Abraham, Jakob) + enskilda
  berättelser. Metadata för `PetersonSeries`: Biblical Series: Genesis (15
  avsnitt), Death and Resurrection of Christ (5 delar), och Exodus (16
  avsnitt, panel, betalvägg — **avstängd som standard, togglebar**). Ett
  exempel-`Parallel` ("Uppoffring som återkommande arketyp", Kain & Abel ↔
  Isaks offer) visar hur tvärtext-jämförelser kommer fungera.
- **UI**: startsida (böcker) → bokvy (berättelser grupperade cykel/enskild,
  med karaktärs- och tema-taggar) → berättelsevy (textreferens, Peterson-guide
  med grov titel-baserad kandidatmatchning tills riktig segmentdata finns,
  arketyp-jämförelser, referens-sektion).

## Beslut från avstämningen 2026-08-21 (efter feedback)

- **Exodus tas med**, trots betalvägg/panelformat — modelleras som en
  togglebar `PetersonSeries` (`enabledByDefault: false`). Panelens övriga
  röster (Hedley, Guinness, Orr, Prager, Blackwood, Pageau) är helt ok att
  ta med — `PetersonSegment.speaker` markerar vem som pratar. Syftet är
  bredare storytäckning (Exodus innehåller berättelser Genesis-serien inte
  täcker), inte att bara replikera Peterson solo. Användaren är villig att
  betala för DailyWire+-access om det krävs för korrekt annotering.
- **Maps of Meaning blir ett eget huvudblock**, jämte Bibeln — modellerat
  som en egen `Corpus` med `kind: "framework"` (redan seedad som
  placeholder, se "Nästa steg"). **12 Rules for Life** bakas in som en
  `Book` under samma `Corpus` (den populära uppföljaren till samma
  ramverk).
- **Referens-index**: `Reference`-modellen fångar varje gång Peterson (i
  video eller bokkapitel) använder en person/berättelse/verk för att
  illustrera en poäng — även sådant som inte har egen `Story`/`Character`
  än (`externalLabel`, t.ex. "Nietzsche", "Raskolnikov"). Ger användaren
  en överblick över vilka källor Peterson faktiskt utgår ifrån.
- **Tvärtext-jämförelser** (`Parallel`/`ParallelStory`): identifierar var
  olika skrifter (t.ex. Bibeln och Koranen) uttrycker liknande budskap via
  olika berättelser, med egen text om likheter/skillnader, valfri koppling
  till ett `Theme`, och möjlighet att länka in Petersons egna resonemang om
  arketyper som går igen mellan kulturer.
- **Koranen och andra texter utan Peterson-täckning** byggs som egna
  `Corpus` utan `PetersonSeries`-koppling — ger ändå full överblick över
  antal/typ av berättelser, och kan senare länkas in i `Parallel`-jämförelser
  mot Bibeln.
- **Framtida, fristående modul (ej påbörjad)**: en "perception & psykisk
  hälsa"-funktion (kopplad till användarens psykologprogram) som analyserar
  vilken perception/tolkningsmönster som återkommer i berättelser/personer
  med god vs. dålig psykisk hälsa, och vad som krävs för att förskjuta
  perceptionen. Ska fungera fristående från textindexet, men kunna
  återanvända samma `Story`/`Character`-analyser som underlag. Håll
  isolerad från kärnmodellen tills den aktivt tas upp igen — ingen
  premature koppling in i `Story`/`Reference` än.

## Källor (för research bakom seed-datat)

- Genesis-seriens 15 titlar: korsverifierat mot flera oberoende sidor
  (bl.a. [thecslewis-studygroup.org](https://thecslewis-studygroup.org/visitors-space-3/bible-series-jordan-petereson/)).
- "The Death and Resurrection of Christ: A Commentary in Five Parts" (2018),
  Petersons egen [tweet](https://x.com/jordanbpeterson/status/982000875915923456)
  och [Freerepublic-repost](https://freerepublic.com/focus/f-bloggers/3645367/posts).
- Exodus-serien (2021–2023, DailyWire+): 16 avsnitt, **paneldiskussion**
  (Peterson + Douglas Hedley, Os Guinness, James Orr, Dennis Prager, Stephen
  Blackwood, Jonathan Pageau), **bakom betalvägg**. Se [dailywire.com/show/exodus](https://www.dailywire.com/show/exodus).
  Fullständig avsnittslista med titlar är inte research:ad än (bara 3 av 16
  titlar bekräftade hittills) — se "Nästa steg".

## Viktig avgränsning: upphovsrätt

- Vi lagrar **inte** bibeltext i databasen. `Story.startRef`/`endRef` pekar
  bara på ett referensintervall; själva versen hämtas on-demand från en
  öppen bibel-API (t.ex. [bible-api.com](https://bible-api.com), World
  English Bible, public domain).
- Vi lagrar **inte** fullständiga videotranskript, bara egna korta
  sammanfattningar (`PetersonSegment.keyPoints`) + länk med tidsstämpel till
  originalvideon på YouTube.
- **Exodus-serien** (DailyWire+, betalvägg): länka gärna till köp-/
  streamingsidan, men undvik att återge/lagra fullständigt betalinnehåll —
  egna korta sammanfattningar + tidsstämplar (samma modell som övriga
  serier) är rimligt.

## Nästa steg

1. ~~Fyll i riktiga YouTube-ID:n~~ **Klart 2026-08-21**: alla 15
   Genesis-föreläsningar verifierade mot officiella kanalen via oEmbed.
   Kristus-serien visade sig vara EN sammanslagen video (inte 5) —
   kapitel-tidsstämplar för de fem delarna är fortfarande TODO. 16 fria
   Exodus-klipp tillagda (ett spot-verifierat, resten från archive.org-
   mirror, bör stickprovskontrolleras mer om serien aktiveras på riktigt).
   Avsnitt 11:s klipp hittades inte.
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
   `PetersonSeries`-koppling till att börja med.
7. **Exodus-serien**: hämta fullständig avsnittslista (16 titlar, bara 3
   bekräftade hittills), bygg `Story`-täckning för Andra Mosebok-berättelser
   som Genesis-serien inte rör (t.ex. Moses i vassen, brinnande busken, de
   tio plågorna, Röda havet, de tio budorden) och annotera segment med
   `speaker` per panelist.
8. **Maps of Meaning + 12 Rules for Life**: research kapitel-/
   föreläsningslista (2017 University of Toronto-föreläsningarna, ~13–25
   delar) för att fylla `maps-of-meaning`-korpusen (redan seedad som tom
   placeholder) med riktiga `Story`-poster (kapitel/föreläsningar).
9. **Referens-index**: börja fylla `Reference` i takt med att vi annoterar
   video-/kapitel-segment — varje gång Peterson nämner Nietzsche,
   Dostojevskij, Jung, Campbell etc. för att illustrera en poäng.
10. **Fler `Parallel`-poster**: särskilt Bibeln↔Koranen när Koranen är
    indexerad.
11. **Perception & psykisk hälsa-modulen**: separat initiativ, se ovan —
    tas upp igen när kärnindexet är moget.

## Kom igång

```bash
npm install
npm run db:push    # skapar/uppdaterar dev.db från schema.prisma
npm run db:seed    # fyller Genesis-indexet
npm run dev         # startar appen på http://localhost:3000
```

`npm run db:studio` öppnar Prisma Studio för att bläddra/redigera datan
direkt.
