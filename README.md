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

## Fas 71 (2026-08-28): Buddhism

Fas 4 av 10 — starkast källäge av alla fyra nya civilisationer. Peterson
har en HEL, egen, namngiven Maps of Meaning-föreläsning ("Genesis and
the Buddha", 2017 års serie, redan seedad sedan tidigare i filen) som
specifikt jämför Första Mosebokens skapelseberättelser med Buddhas
ursprungsberättelse.

Två nya berättelser: **De fyra synerna** (hela citatet ur Ashvaghoshas
Buddhacharita, Cowells fria 1894-översättning, Sacred Books of the
East vol. 49, Internet Archive) — kung Suddhodanas profetia, det
instängda palatset, och den åldrade mannen som utlöser Den stora
försakelsen. **Dhammapada: Tvillingverserna** (Max Müllers fria
1881-översättning, Gutenberg #2017) — buddhismens mest citerade
öppningsverser, en aforism-samling i samma tradition som Ordspråksboken
eller Pirkei Avot.

Kopplat till videon direkt (`seed-workref-the-four-sights`) och en ny
Jordans Mytologi-Parallel: **"Ett fungerande utgångsläge, ett problem,
en lösning"** — till skillnad från kaosdrake-Parallelen (Fas 66/67/69/
70) handlar den här om själva BERÄTTELSESTRUKTUREN, inte en fysisk
konflikt. Starkast verifierad av alla fem Parallels hittills — inte
vår egen komparativa observation, utan en namngiven Peterson-
föreläsning ägnad exakt åt den.

**Känd, odokumenterad skörhet** (upptäckt vid granskning, inte fixad —
utanför fasens omfattning): kopplingen till videon `7XtEZvLo-Sc`
använder `findUniqueOrThrow` på en rad som skapas LÄNGRE NER i samma
seed-fil (momLectures-loopen). Fungerar eftersom `dev.db` aldrig är
helt tom vid en omkörning i den här sessionen, men skulle fallera på
en helt fräsch databas — samma mönster som redan finns för
`Nb5cBkbQpGY` sedan Fas 61/66/69.

## Fas 70 (2026-08-28): Vedisk mytologi (Indra och Vritra)

Fas 3 av 10. Direkt användarbeslut: läggs till som en Gita-KOPPLAD
berättelse, inte ett eget verk (Bhagavad Gita hör till samma vidare
vediska/hinduiska tradition som Rigveda). Verifierat: Peterson räknar
uttryckligen upp "Indra killing Vritra the Cosmic Serpent" tillsammans
med Marduk/Tiamat, Theseus/Minotauros och Jahve/Leviatan som varianter
av samma kaosdrake-mönster — men ingen exakt video+tidsstämpel
verifierad mot ett primärt transkript.

Hela citatet (Rigveda 1.32, Griffiths fria 1896-översättning,
Wikisource) — bland de allra äldsta texterna i hela appen (ca 1500–
1200 f.Kr.). Bonusfynd: Vritras mor heter Danu — ett kaos-modersnamn
som ekar Tiamat, tillagt i berättelsens egen sammanfattning.

Lagt till i "Hjälten som besegrar kaos-monstret"-Parallelen, som nu
spänner över FEM traditioner (Bibeln, Mesopotamien, Egypten, Grekland,
Vedisk mytologi) — synligt direkt på varje enskild berättelses sida.

**Sidofynd, sparat för Fas 76**: research bekräftade att Peterson
faktiskt citerat Bhagavad Gita direkt i 12 Rules for Life ("the sage
does not contrive to win, and therefore is not defeated") — en
konkret, verifierbar koppling att bygga vidare på när Gitan
färdigställs.

## Fas 69 (2026-08-28): Grekisk mytologi

Fas 2 av 10. Svagare Peterson-källäge än Taoismen (flaggat redan i Fas
67), men alla tre källtexter är fritt tillgängliga så HELA verifierade
passager kunde ändå användas: Hesiodos Theogonin (Evelyn-White övers.
1914, Gutenberg #348) för Zeus/Typhon och Prometheus, Sofokles Kung
Oidipus (F. Storr övers. 1912, Gutenberg #31).

- **Zeus och Typhon**: en av Petersons återkommande "kaosdrake"-
  exempel (samma mönster som Marduk/Tiamat, Horus/Seth) — lades till i
  "Hjälten som besegrar kaos-monstret"-Parallelen (Fas 66/67).
- **Prometheus stjäl elden**: ingen specifik Peterson-koppling
  verifierad, men en av världslitteraturens mest kända bilder för
  priset av förbjuden kunskap — inkluderad på egna meriter.
- **Oidipus (Kung Oidipus)**: kopplad till den redan seedade Freud-
  föreläsningen (Fas 61, "2017 Personality Lecture 09") — Oidipus-
  komplexet är kärninnehåll där. Peterson ställer (enligt research)
  Freuds läsning av myten ("misslyckad hjälte") mot Jungs bredare syn
  på hjälteresan.

Tre nya porträtt (Zeus, Prometheus, Oidipus — Wikimedia Commons,
public domain), tillagd i historiska tidslinjen (700–429 f.Kr.).

## Fas 68 (2026-08-28): Taoismen (Tao Te Ching)

Första fasen i en ny, tio-fas-plan (nya civilisationer + färdigställa
Koranen/Talmud/Gita + sammanlänkning — se chattlogg för fullständig
plan). Taoismen bedömdes vara Petersons MEST centrala icke-abrahamitiska
referens: 12 Rules for Life öppnar bokstavligen med Taoismens yin-yang-
symbol ("Order and chaos are the yang and yin of the famous Taoist
symbol: two serpents, head to tail").

Ny bok med 5 kapitel, alla med HELA verifierade citat (Laozi ~500-talet
f.Kr., fri text) — hämtade och kontrollerade ord för ord mot James
Legges klassiska översättning (Project Gutenberg #216, 1891, Legge
död 1897, väl fritt): kapitel 1 (öppningen), 2 (motsatsernas
ömsesidiga uppkomst — yin-yangs textuella rot), 11 (tomhetens nytta),
28 ("känn det manliga, behåll det kvinnliga" — direkt förelöpare till
Petersons maskulint/feminint-kodade ordning/kaos-språk), och 42
("Tao frambringade Ett... Två" — den kanoniska yin-yang-kosmogonin).

Kapitel 42 fick en `bookSourceRef`-koppling till "12 Rules for Life,
Overture" (boken själv, inte en video) — korskontrollerad mot flera
oberoende sekundärkällor snarare än ett eget digitalt exemplar (boken
är inte digitalt tillgänglig för oss, samma avgränsning som gäller
övriga 12 Rules-bokreferenser sedan tidigare faser).

**Ny Jordans Mytologi-koppling**: "Ordning och kaos som urkrafter" —
skiljer yin-yangs KONFLIKTFRIA dualitet från "Hjälten mot kaos-
monstret"-Parallelns AKTIVA KAMP-mönster (Fas 66), kopplad till
Bibelns tohu wa-bohu och Enuma Elishs Tiamat.

## Fas 67 (2026-08-28): Historisk tidslinje + "Jordans Mytologi"

Två nya sidor, ett schema-tillägg (via `prisma db push`, INTE `migrate
dev` — se nedan), och tre nya tvärtext-`Parallel`-poster.

**Ny sida `/tidslinje-historisk`**: alla ~41 böcker, oavsett tradition,
på EN gemensam tidsskala (2500 f.Kr.–idag), sorterad kronologiskt.
Kräver `Book.approxYearStart`/`approxYearEnd` (nya, nullable Int-fält)
— en sorterbar komplettering till den redan existerande fritexts-
`writtenEstimate`, INTE en ny oberoende bedömning: siffrorna är
hämtade direkt ur samma "moderna forskare"-uppskattningar som redan
stod där för Bibel-böckerna. För Källor & influenser/Andra religiösa
texter (som saknade writtenEstimate helt) användes motsvarande
etablerade forskningskonsensus (t.ex. Koranen 610–632, Talmud
ca 200–500, Bhagavad Gita ofta daterad 400–200 f.Kr., Gilgamesh-
eposets äldsta sumeriska version ca 2100 f.Kr.). Varje rad visar en
👁-markering om Jordan kommenterat något i boken, plus de mest
återkommande karaktärerna i just den boken.

**Bieffekt, upptäckt under arbetet**: `npx prisma migrate dev` ville
NOLLSTÄLLA hela dev-databasen (projektet har aldrig använt spårade
migrationer, bara `db push`, och Prisma tolkade den ospårade historiken
som en konflikt). Avbrutet innan något kördes — `db push` användes
istället, vilket applicerade schemaändringen additivt utan dataförlust.

**Ny sida `/jordans-mytologi`**: en samlingssida för det redan
existerande men aldrig UI-exponerade `Parallel`-konceptet (fanns i
schemat sedan tidigare, bara en enda exempel-post och ingen
översiktssida). Tre nya poster utöver det gamla uppoffrings-exemplet:
- **"Hjälten som besegrar kaos-monstret"** — Marduk/Tiamat, Osiris/
  Horus/Seth och Guds skapelseord, samma djupmönster i tre traditioner
  (Petersons egen, ofta upprepade tes).
- **"Syndafloden som återkommande arketyp"** — Noa, Nuh (Koranen) och
  Gilgamesh-eposets Utnapishtim, grundat i Eliades redan verifierade
  poäng om flodmyters nästan universella spridning.
- **"Adam och den första olydnaden"** — Bibelns och Koranens Adam,
  med skillnaden i hur syndafallets konsekvenser hanteras (bestående
  vs. direkt förlåtelse efter ånger).

`Parallel` fick även ett nytt `quote`-fält (ordagrant Peterson-citat,
när ett sådant faktiskt finns källverifierat) — lämnat NULL på alla
tre nya poster ovan: kopplingarna bygger på redan etablerad, väl
underbyggd research (delvis Petersons egna ord i sekundärkällor utan
en exakt pinpointad video+tidsstämpel än), inte en nyupptäckt, ordagrant
citerbar enskild replik. Ärligare att hålla `description` som egen
parafras här än att låtsas ett verbatim-citat som inte är verifierat.

## Fas 66 (2026-08-28): Egyptisk/mesopotamisk mytologi + tvärtraditions-karaktärslänkning

Föranledd av: "Jordan brukar referera till mesopotamiska historier och
egyptiska historier ... ögat över pyramiden ... civilisationers egna
gudar battle out sina värderingar." Två nya `Book` i `other-scriptures`
— men till skillnad från Fas 65 (bara skelett) har dessa RIKTIGT
innehåll direkt, eftersom vi redan hade verifierat Peterson-material
för de två centrala myterna:

- **Mesopotamisk mytologi**: Enuma Elish (Marduk & Tiamat) — hela
  Petersons poäng (varför Marduk väljs till kung: han kan SE och TALA,
  "logos"; kopplingen till syndafallet; kejsarens årliga rituella
  bekännelse) återanvänder ordagrant samma research som redan låg i
  appen sedan Fas 11, bara i en ny riktning (myten som eget verk,
  inte bara ett omnämnande på en bibel-sida). Plus Gilgamesh-eposet
  (hjälten som lämnar hemmet/civilisationen — föregångare till
  syndaflodsmyten), men UTAN en exakt verifierad tidsstämpel än.
- **Egyptisk mytologi**: Osiris/Horus/Seth-myten (samma
  återanvändnings-princip som ovan — "demokratiseringen av Osiris"
  till alla människors värde). Plus "Horus-ögat på pyramidens topp"
  — användarens eget exempel — som en egen berättelse, men **ingen
  Reference-rad lades till**: poängen är väl dokumenterad över många
  av Petersons föreläsningar/intervjuer (flera oberoende
  sekundärkällor citerar samma resonemang) men ingen exakt
  video+tidsstämpel har verifierats mot ett primärt transkript än —
  samma ärliga avgränsning som gäller Gilgamesh ovan.

**Andra civilisationer Peterson återkommer till (efterfrågat av
användaren) — inte byggda än, men värda att flagga:**
- **Taoismen/yin-yang-symbolen** — enligt research en av de MEST
  centrala referenserna i hela hans författarskap (12 Rules for Life
  öppnar bokstavligen med "Order and chaos are the yang and yin");
  starkast kandidat för nästa tillägg.
  - **Grekisk mytologi** (Zeus mot Typhon, Prometheus, Oidipus) —
  används ofta i jämförelser med Marduk/Tiamat-mönstret, svagare
  källäge än Taoismen men värt en egen fas.
  - Vedisk/hinduisk mytologi (Indra mot Vritra) nämndes också i
  sökningen — troligen mest relevant som en till Bhagavad Gita-
  anknuten referens snarare än ett helt eget verk.

**Tvärtraditions-karaktärslänkning**: Koranens redan seedade
berättelser om Adam, Noa (Nuh), Abraham (Ibrahim, båda story-
stubbarna), Mose (Musa), Josef (Yusuf) och Maria/Jesus (Maryam)
länkades till EXAKT SAMMA `Character`-rad som redan används i
Bibel-korpusen — inte nya, dubblerade karaktärer. Det här är vad som
driver den nya UI-markeringen: på story-sidan får en karaktärs-etikett
en accent-färg + "⇄"-ikon och en tydlig ruta ("Samma karaktär i andra
traditioner") med klickbara länkar när personen förekommer i en annan
korpus — och personsidan (`/personer/adam` osv.) visade redan
automatiskt båda traditionernas berättelser under "Förekommer i" utan
någon kodändring (samma mekanism som redan fanns för Nietzsche/Jung-
kapitlens författar-länkning, Fas 58).

## Fas 65 (2026-08-28): Relevans-filtrerade berättelse-stubbar för Koranen, Talmud, Bhagavad Gita

Fas 64 gav bara tomma `Book`-rader. Den här fasen går ett steg djupare
— en STORY-stub per relevant avsnitt (bara `title`/`startRef`/`endRef`/
`orderInBook`, `quote`/`summary` medvetet NULL, ingen fejk-placeholder-
text) — så att kommande faser vet exakt VILKA suror/traktat/kapitel
som ska fyllas i, inte bara att "något" ska fyllas i.

**Relevans-sorteringsmodellen** (samma tre nivåer oavsett verk):
- **(A) Delar som redan överlappar med Bibel-korpusen** — högst
  prioritet, eftersom det möjliggör framtida tvärkorpus-länkning
  (samma person/berättelse ur en annan traditions lins, jämför redan
  existerande We Who Wrestle with God ↔ Genesis-länkning).
- **(B) Kort men kulturellt/teologiskt centralt material** — även utan
  Bibel-överlapp eller Peterson-koppling (t.ex. Al-Fatiha, Pirkei
  Avot, Bhagavad Gitas mest citerade kapitel).
- **(C) Verifierat Peterson-refererat material** — högsta prioritet
  OM det finns, men ingen sådan koppling hittad/verifierad än för
  dessa tre verk (till skillnad från Källor & influenser-kapitlen).

**Medvetet uteslutet, inte bortglömt**: rent juridiskt/tekniskt
material utan narrativt/filosofiskt innehåll — Koranens arvs- och
äktenskapslagstiftning, Talmuds tusentals sidor halakha-debatt (utöver
de utvalda aggada-berättelserna), Bhagavad Gitas mer repetitiva
yoga-praktik-kapitel (6, 13–17). Detta är appens egen avgränsning
("berättelseindex", inte en fullständig digital utgåva), samma princip
som redan gäller för Psaltaren/Ordspråksboken/breven i Bibel-korpusen.

**Resultat**: 10 Koran-stubbar (Adam, Noa, Abraham x2, Mose, Josef,
Maria/Jesus, Nattresan, plus Al-Fatiha och Tron-versen), 7 Talmud-
stubbar (Akhnais ugn, Kamtza/Bar Kamtza, Choni, Hillel-konvertiten, De
fyra i Pardes, Rabbi Akivas död, Pirkei Avot), 6 Gita-kapitel (1, 2, 3,
11, 12, 18).

**Bieffekt-bugg hittad och fixad**: story-sidan gated tidigare
bibeltext-hämtning (bible-api.com) och "Läs på BibleGateway"-länken på
`corpus.kind === "scripture"` — vilket nu även träffade Koranen/
Talmud/Gita (samma `kind`, för att återanvända annan scripture-logik
som avsaknad av författar-attribution). Resultatet blev en förvirrande
"kunde inte hämta versstexten"-felruta och en trasig BibleGateway-länk
på varje ny stub. Fixat genom att gata om just dessa två ställen till
`corpus.slug === "bible"` specifikt (`src/app/[corpus]/[book]/[story]/page.tsx`)
— övrig `kind === "scripture"`-logik (t.ex. ingen citat-författare
krävs) är fortfarande korrekt oförändrad. Verifierat live på alla tre
nya böcker efteråt.

## Fas 64 (2026-08-28): Skelett för andra religiösa texter

Ny Corpus `other-scriptures` ("Andra religiösa texter", kind
"scripture") med tre platshållar-`Book`-rader: Koranen, Talmud,
Bhagavad Gita. INGA Story-rader än — ren struktur, så att kommande
faser vet exakt var innehållet ska in. Varje bok kommer enligt
tidigare effort-uppskattning kräva flera egna faser (som Bibelböckerna
själva) den dag den faktiskt fylls i; syftet här var bara att göra
"vad som är kvar" synligt och navigerbart redan nu, inte att börja
fylla i innehållet.

## Fas 63 (2026-08-28): Bredda referens-djupet (Solzjenitsyn, Eliade, Neumann, Paglia)

Fyra tänkare fanns redan lätt representerade i appen — som `refCharacterDefs`
med enstaka, verifierade videoreferenser knutna till deras personsida —
men saknade helt egna verk i "Källor & influenser". Samma person=bok-
mönster som Nietzsche/Jung/Freud/Dostojevskij, tillämpat på:

- **Aleksandr Solzjenitsyn** (d. 2008, skyddad till 2078): Gulagarkipelagen.
  Kopplad till en HEL, dedikerad Peterson-föreläsning ("2017 Personality
  13: Existentialism via Solzhenitsyn and the Gulag").
- **Mircea Eliade** (d. 1986, skyddad till 2056): Det heliga och det
  profana samt En historia om religiösa idéer. Båda kopplade till redan
  verifierade citat/tidsstämplar (Noa-föreläsningen resp. Lex Fridman
  #448, där Peterson uttryckligen säger att han använde "Sacred and the
  Profane" i arbetet med We Who Wrestle with God).
- **Erich Neumann** (d. 1960, skyddad till 2030): Medvetandets ursprung
  och historia samt Den stora modern. Kopplade till Jordan B. Peterson-
  podcasten #491 (Dawkins/O'Connor), där Peterson kallar förstnämnda
  "ett verk av geni".
- **Camille Paglia** (lever): Sexual Personae. Kopplad till hela
  "Modern Times"-intervjun (2017), ett av Petersons tidigaste och mest
  sedda poddavsnitt, där boken är huvudämnet.

Alla sex citat är — liksom Jung tidigare — min egen svenska parafras av
verkets kärntes, inte en direktöversättning av en specifik skyddad
utgåva. Sex nya, verifierade `Reference`-rader kopplar respektive verk
till en riktig video/tidsstämpel; tre återanvänder exakt samma,
redan faktakontrollerade video+tidsstämpel som de äldre personsides-
referenserna redan pekade på (ny riktning, ingen ny research krävdes).

Sex nya porträttbilder hämtade (Wikimedia Commons, licens/källa
verifierad per fil innan nedladdning): Eliade, Neumann, Paglia — samt,
som en passande sidoeffekt (upptäckt att de saknades helt, gav "F"-
bokstavscirklar istället för bilder i citat-attributionen), Carl Jung,
Sigmund Freud och Fjodor Dostojevskij.

**Allvarlig, pre-existerande bugg hittad och fixad under verifiering**:
Eliades personsida visade "Peterson refererar till Mircea Eliade (109)"
— en absurt hög siffra. Grundorsak: `references`-arrayens uppsert
(det generella "person nämns i en video"-flödet, separat från de nyare
verk-specifika `seed-workref-*`-raderna) använde en sammansatt unik
nyckel `{videoId, storyId, characterId}` där `storyId` sattes till
`story?.id ?? ""` i uppslaget men till `story?.id` (dvs `undefined` →
NULL i databasen) vid skapandet — en tom sträng matchar aldrig NULL,
så VARJE gång `npx prisma db seed` kördes om skapades en helt ny
dubblettrad för alla referenser utan kopplad story, istället för att
uppdatera den befintliga. Resultat: 331 rader i databasen där bara 66
var unika (265 dubbletter, ansamlade över mängder av tidigare
seed-körningar under hela projektets historia). Fixat genom att byta
till samma stabila, deterministiska id-mönster (`seed-charref-*`) som
redan användes på alla andra `Reference`-uppserter i filen; de 265
dubblettraderna städades bort och idempotens verifierad genom att köra
seed två gånger i rad utan att radantalet ökade.

## Fas 62 (2026-08-28): Fjodor Dostojevskij i "Källor & influenser"

Fortsätter listan (Nietzsche → Jung → Freud → nu Dostojevskij), med
FÖRSTA gången forskning på specifika verk-kopplingar gjordes UPPFRONT
istället för i efterhand — tre riktiga, fristående Petersonvideor
hittades och lades in direkt: en "Brilliant Breakdown"-genomgång av
Anteckningar från källarhålet, en hel föreläsning om Brott och straff,
och en om Storinkvisitorn (Bröderna Karamazov). Fem verk totalt, tre
med HELA verifierade passager (Dostojevskij dog 1881, fri text) —
källarhålsmannens berömda öppningsmonolog, Raskolnikovs teori om "den
extraordinäre människan", och Storinkvisitorns tal om frihetens
olidliga tyngd. Onda andar och Idioten fick kortare, väletablerade
citat utan lika djup verifiering.

Sidoeffekt: personsidan visade två REDAN BEFINTLIGA Peterson-
kopplingar till Dostojevskij (Kain & Abel- och Jakob-föreläsningarna i
Biblical Series, båda om just Brott och straff) som fanns i databasen
sedan tidigare men aldrig synts ihop med hans egna verk förrän nu.

**Två självrättade buggar innan commit**: (1) de tre nya videorna lades
först felaktigt under "Lex Fridman Podcast"-serien (kopierat från Fas
61:s mönster utan eftertanke — de är inte Lex Fridman-avsnitt).
Upptäckt vid granskning, flyttade till en ny, ärligare serie
"Fristående YouTube-klipp". (2) Fixen syntes ändå inte live efter
första om-seedningen — orsaken var att `petersonVideo.upsert()`
använde `update: {}` (tomt objekt) för dessa rader, så när `seed`
kördes om uppdaterades bara NYA rader korrekt, medan de redan
existerande (felmärkta) videoraderna aldrig fick sitt `seriesId`
skrivet om. Fixat genom att sätta `update: { seriesId:
standaloneClipsSeries.id }` explicit, verifierat live efteråt.

## Fas 61 (2026-08-28): Fixa Jordan-emblem-buggen + citat-attribution + verifierade verk-kopplingar

Direkt användarfeedback (skärmdump): Jordans emblem visades på ALLA
verk-sidor för Nietzsche/Jung/Freud, trots att ingen faktisk Peterson-
koppling fanns. Grundorsak: `hasPetersonContent`/tier-logiken (tre
ställen: bok-sidan, tidslinjen, gamification.ts) antog att
`Story.quote` alltid är PETERSONS eget citat — sant för hans egna
böcker (12 Rules, We Who Wrestle, ...) men fel för "influences"-
korpusen, där `quote` är PERSONENS EGET citat (Fas 58-60). Fixat på
alla tre ställen: `Story.quote` räknas bara som Peterson-innehåll när
boken INTE tillhör `influences`-korpusen; en riktig `Reference`-rad
(med videoId eller bookSourceRef) mot storyn räknas dock alltid.

**Citat-attribution**: berättelsesidan visar nu VEM som säger
citatet — personens porträtt/initial + namn ovanför citatet
("CITAT AV FRIEDRICH NIETZSCHE"), eller Jordans egen badge när det är
hans eget citat (alla andra framework-böcker). Avgörs via en ny
`role: "författare"`-koppling på StoryCharacter, satt när verk-
storyerna skapades.

**Klickbara kopplingar**: "Peterson refererar hit från"-sektionen
(story-sidan) länkade tidigare bara som text — nu riktiga länkar:
video+tidsstämpel → YouTube, bookSourceRef → uppslaget mot den
faktiska storyn (parsar "${bokens namn}, ${startRef}"-mönstret
omvänt, samma konvention som redan användes åt andra hållet).

**Sex verifierade verk-kopplingar** tillagda som riktiga
`Reference`-rader (inte gissningar): Nietzsches "Den galne mannen"
och Freuds "Totem och tabu" återanvänder två REDAN seedade Maps of
Meaning-videor (samma video, ny riktning — nu synlig på både
föreläsningens OCH verkets sida). Fyra nya källor hittades och
lades in med riktiga YouTube-ID:n i två nya `PetersonSeries`
("2017 Personality Lectures" och "Lex Fridman Podcast"): Freuds
Drömtydning (Personality-föreläsning 9), Jungs Människan och hennes
symboler (Personality-föreläsning 7, "Carl Jung and the Lion King"),
Nietzsches Så talade Zarathustra och Bortom gott och ont (båda från
Lex Fridman-podden avsnitt 448). De 14 återstående verken saknar
MEDVETET en Reference-rad — ingen verifierad, citerbar Peterson-
koppling till just det specifika verket hittades.

## Fas 60 (2026-08-28): Nietzsches egna ord i fulltext + Sigmund Freud

Direkt användarönskemål: "lägg in [Nietzsches] viktigaste [citat] även om
Jordan inte analyserat eller refererat till dem... hela paragrafer...
även hela kapitel". Eftersom Nietzsche dog 1900 är hans verk fria från
upphovsrätt — tre HELA, ordagrant verifierade nyckelpassager lades till
som egna stories (utöver de sex kortare per-verk-sammanfattningarna
från Fas 58): De tre förvandlingarna (helt kapitel, kamel→lejon→barn),
Den galne mannen (hela "Gud är död"-liknelsen, afor. 125), och
Övermänniskan (Zarathustras torg-tal ur företalet). All text hämtad
direkt från Project Gutenbergs fria utgåvor (Thomas Common-
översättningen av Zarathustra, ebooks/1998; Den glada vetenskapen,
ebooks/52881) och kontrollerad ord för ord mot källfilen — ingen
återgivning ur minnet. Uppdaterade även "Bortom gott och ont"-citatet
till den fullständiga, verifierade avgrunds-aforismen (146).

**Sigmund Freud** lades också till (samma "person = bok"-mönster,
samma önskemål utökat till honom). Fem verk: Drömtydning (med en
fullständigt verifierad passage, "via regia till det omedvetna" —
hans äldre verk från 1899–1923 är fria från upphovsrätt i USA),
Vardagslivets psykopatologi, Totem och tabu (redan kopplad till
Peterson via en befintlig Reference-rad om fadersmordet), Jaget och
detet, och Civilisationen och dess missnöje. Petersons koppling
grundad i hans egen podcast-episod "Sigmund Freud and the Dynamic
Unconscious" samt hans ursprungliga personlighetspsykologi-
föreläsningsserie.

**Viktig skillnad att hålla koll på framöver:** Nietzsche (död 1900)
och Freuds äldsta verk (1899–1913) är fria — generösa, fullständiga
citat är juridiskt okej. Jung (död 1961) är fortfarande copyright-
skyddad — hans citat MÅSTE förbli korta, oavsett hur mycket
sammanhang som vore önskvärt. Samma gräns gäller framtida tänkare:
Dostojevskij (död 1881, fri) och Solzjenitsyn (död 2008, Gulag-
arkipelagen utgiven 1973, INTE fri) hamnar på var sin sida.

## Fas 59 (2026-08-28): Carl Jung i "Källor & influenser"

Samma mönster som Nietzsche (Fas 58). Sex verk: Människan och hennes
symboler (Jungs sista, mest tillgängliga bok), Den röda boken (hans
mest personliga, länge outgivna huvudverk), Psykologiska typer
(grunden till Big Five/Myers-Briggs), Aion (Kristus som arketyp för
Självet — den mest direkta bryggan till Petersons Bibelföreläsningar),
Symboler och transformation (boken som orsakade brottet med Freud),
och Minnen, drömmar, tankar (självbiografin). Citaten är MEDVETET
egna, korta svenska återgivningar snarare än en specifik publicerad
översättares exakta ordalydelse, eftersom Jungs verk (död 1961)
fortfarande är copyrightskyddade — till skillnad från Nietzsche (död
1900, fri text). Personsidan `/personer/carl-jung` visar nu både hans
egna verk OCH de två redan existerande Reference-kopplingarna
(Pinocchio-skuggan, arketyp-begreppet) på samma sida, helt utan ny
kod.

## Fas 58 (2026-08-28): Ny korpus "Källor & influenser" — Friedrich Nietzsche

Första fasen i den nya "utanför Bibeln"-satsningen, direkt efter
användarens idé: varje tänkare Peterson ofta bygger vidare på blir en
egen "bok" (`kind: "framework"`, ny korpus `influences`), med hans
viktigaste VERK som egna Story-poster — `quote` är ett kort, fritt
citat av TÄNKAREN själv (omvänt av hur `quote` används i Petersons
egna böcker), `summary` bär Petersons konkreta koppling. Varje
verk-story länkas dessutom till personens befintliga `Character`-rad
via `StoryCharacter`, så personsidan (`/personer/nietzsche`)
automatiskt listar hans egna verk under "Förekommer i" — ingen ny
kod behövdes, bara återanvändning av befintlig UI.

Sex verk: Den glada vetenskapen (Gud är död), Så talade Zarathustra
(Övermänniskan), Bortom gott och ont (viljan till makt), Till
moralens genealogi (ressentiment), Avgudaskymning, Ecce Homo (amor
fati). Petersons kopplingar grundade i verifierbara källor: Lex
Fridman-podden avsnitt 448 (2024-10-11, "Nietzsche, Hitler, God,
Psychopathy, Suffering & Meaning"), hans publicerade förord/
föreläsningsserie till en nyutgåva av "Beyond Good and Evil", och den
redan seedade Maps of Meaning-kopplingen (föreläsning 8, "Gud är
död"/Tiamat). Citaten är korta och hämtade ur fria, äldre
översättningar (Nietzsche dog 1900) — samma upphovsrättsprincip som
resten av appen.

## Fas 57 (2026-08-28): Research — Petersons spridda bibelkommentarer utanför de tre kända serierna

Gedigen sökning (via subagent) efter om Peterson kommenterat någon av
sessionens nytillagda berättelser (David & Goljat, Daniel, Ester,
Simson, Gideon, pingstdagen, Stefanus, Paulus omvändelse, m.fl.)
utanför sina tre etablerade bibelserier (Genesis-föreläsningarna,
Exodus-panelen, Kristi död/uppståndelse-sammanslagningen). Resultat:

- **En fjärde formell serie upptäcktes**: "The Gospels" (DailyWire+,
  dec 2024–jan 2025, 10 avsnitt paneldiskussion — samma format som
  Exodus). Avsnittsnamnen antyder brett innehåll som sannolikt täcker
  flera Lukas/Johannes-berättelser (förlorade sonen, Sackeus, Emmaus)
  men ligger bakom betalvägg. Användaren saknar DailyWire+-access för
  att verifiera exakt avsnitt↔story-koppling — lämnas olänkad tills
  vidare, dokumenterad i seed.ts vid `christSeries`.
- Ett svagt fynd (gäst-pastor predikar om förlorade sonen i Petersons
  podcast) bedömdes INTE vara "Jordans egen tolkning" och lades
  medvetet inte in.
- För alla övriga sökta berättelser: inget citerbart hittades —
  webbsökning indexerar podcast-ljud dåligt, så detta är ett negativt
  sökresultat, inte bevis på att han aldrig nämnt dem.

Ingen ny data lades till denna fas — bara research + dokumentation för
framtida sessioner.

## Fas 56 (2026-08-28): Emblem-finputsning + tre riktiga buggar hittade och fixade

Föranledd av en direkt begäran om att leta igenom appen efter saknade
emblem och bildbuggar. Tre fynd:

1. **Emblem-finputsning**: bok-emblem genereras automatiskt (ingen kod
   krävs för nya böcker), men 20 böcker — alla från den här sessionen
   plus flera äldre (Markus, Johannes, Jona, Rut, Ester, Daniel) —
   hade bara det generiska 📖-emblemet. Lade till egna emoji/namn för
   alla 20 i `BOOK_BADGE_STYLE`.
2. **4 saknade bildfiler**: `exodus/water-from-rock-and-amalek/06-09.jpg`
   fanns i databasen men inte på disk — en ofullständig nedladdning
   från Fas 6, långt innan den här sessionen. Full skanning av alla
   1598 StoryImage-rader bekräftade att detta var det ENDA problemet
   (inga andra saknade filer, inga korrupta/för små filer, inga
   saknade credits, inga hål i bildordningen, inga trasiga
   porträtt-referenser). Laddade om de 4 filerna i samma upplösning
   som resten av bildsetet.
3. **Två dubblett-karaktärer**: "Elia" fanns som både `elia` (befintlig
   sedan Matteus/Markus förklaringsberget) och `elijah` (skapad av
   misstag i Fas 47/51 istället för att återanvända `elia`) — splittrade
   hans statistik i två separata karaktärsrader. Samma bugg för "Josua":
   `josua` (befintlig sedan Exodus) vs `joshua` (skapad av misstag i Fas
   45/48). Båda dubbletterna slogs ihop till de befintliga sluggarna;
   de föräldralösa `StoryCharacter`-raderna och dubblett-`Character`-
   raderna togs bort manuellt (seed-scriptets upsert-mönster tar aldrig
   bort gamla rader på egen hand). En fullständig sökning efter fler
   namn-dubbletter bland alla karaktärer bekräftar: inga fler kvar.

## Fas 55 (2026-08-27): Peterson-korslänkar färdigställda + stor citat-städning i Andra Moseboken

Föranledd av frågan "finns det något med högre prioritet kvar, eller
Jordans analyser?" — två separata fynd:

1. **"We Who Wrestle with God" kap. 8 (Elia) och 9 (Jona)** stod sedan
   Fas 12 medvetet olänkade eftersom varken Första Konungaboken eller
   Jona fanns i Bibel-korpusen då. Båda finns nu (Elia sedan Fas 47,
   Jona sedan tidigare i sessionen) — korslänkarna färdigställda mot
   `elijah-at-horeb` respektive `jonah-in-the-fish`.
2. **Andra Moseboken (Exodus) hade ~145 ostädade citat-kontamineringar**
   kvar från Fas 6 — långt innan citat-kontaminerings-buggen ens
   upptäcktes (första gången i Daniel, betydligt senare i sessionen).
   Detta var alltså en verklig kvalitetsbrist i redan publicerat
   innehåll, inte ny text. Städat med samma metod som resten av
   sessionen: 134 automatfixade + 11 manuellt fixade. En bredare
   regex användes den här gången (fångar citat utan punkt efter
   bokförkortningen, t.ex. "1 Kon 18,40" utan punkt) — samma bredare
   sökning hittade och fixade även enstaka missade instanser i Första
   Konungaboken, Andra Samuelsboken, Daniel och Första Samuelsboken
   från tidigare i sessionen. En fullständig sökning över ALLA
   bibelböcker bekräftar nu: inga kvarvarande citat-kontamineringar
   någonstans i appen.

## Fas 54 (2026-08-27): Gabriels bebådelse — Lukasevangeliet kompletterat

Fas 7 av 7, sista punkten i planen (den enda med "Ev."-förbehåll —
räknades som bekräftad eftersom du bad mig fortsätta med hela
listan). Gabriels bebådelse (Luk. 1:26-38) läggs in som en ny första
story i Lukasevangeliet, FÖRE julberättelsen (som kronologiskt sker
efteråt) — alla existerande Lukas-stories fick därför sitt
`orderInBook` skjutet +1. Krävde extraktion av ett helt nytt kapitel
(Lukas 1, 80 verser — bara 26-38 används i storyn, men hela kapitlet
sparades för framtida bruk). NT-text: samma manuella
"Herre"-genomgång som i Fas 53 — fem genuina Gud-Fadern-referenser
konverterades (bl.a. Marias "Guds tjänarinna"), medan Elisabets
hälsning "min Herres moder" (som syftar på det ofödda Jesusbarnet)
lämnades orörd. Ny karaktär: Gabriel. 9 bilder (Lambsongs, CC BY-NC).

Med detta är hela sjufas-planen från den här sessionen genomförd:
Numeri, Domarboken, Första Konungaboken (klar), Andra Konungaboken,
Nehemja, Apostlagärningarna, och nu Gabriels bebådelse.

## Fas 53 (2026-08-27): Apostlagärningarna — pingst, Stefanus, Paulus

Fas 6 av 7 i planen, sista NT-boken denna omgång. Fyra berättelser:
Pingstdagen (kap. 2), Stefanus — den förste martyren (kap. 6:8-7:60),
Paulus omvändelse (kap. 9:1-31), och Paulus och Silas i fängelset
(kap. 16:16-40). NT-text — endast de "säkra" gudsnamn-mönstren
(HERREN/Herren → Gud) kördes automatiskt, men två blinda
felkonverteringar upptäcktes ändå vid manuell genomgång av varje
kvarvarande "Herre": 9:10 (berättarrösten "sade Herren" hade blivit
"sade Gud" — samma röst som Ananias sedan tilltalar "Herre", dvs.
Jesus, inte Gud Fader) och 16:31 ("Tro på Herren Jesus" hade blivit
det obegripliga "Tro på Gud Jesus", eftersom mönstret "Herren" följt
av ett namn inte är säkert att konvertera blint). Båda rättade.
Citat-extraktionen var annars helt ren.

## Fas 52 (2026-08-27): Nehemja — murbygget

Fas 5 av 7 i planen. En enda story (kap. 1-6, hela den sammanhängande
berättelsen): Nehemja hör om Jerusalems ruiner, ber, får kung
Artasastas tillstånd, reser dit och leder murbygget till ett slut på
52 dagar trots Sanballats och Tobias hån, hot och mordkomplotter.
Extraktionen var återigen helt ren — noll citat-kontamineringar,
tredje gången det händer denna session (efter Numeri och delar av
tidigare böcker). Två källset (16+23 bilder) delar en story-mapp,
omnumrerade till löpande visningsordning.

## Fas 51 (2026-08-27): Andra Konungaboken — Elia/Elisa, Naaman, Hiskia och Sanherib

Fas 4 av 7 i planen. Tre berättelser: Elias himmelsfärd (kap. 2,
vagnen av eld, manteln till Elisa), Naaman botas (kap. 5, den
arameiske härförarens spetälska och Gehasis girighet), och Hiskia och
Sanherib (kap. 18-19) — den Jesaja-tråd som medvetet sparades hit
redan i Fas 47, för att slippa dubbelteckna Hiskia/Sanherib-
berättelsen om Jesaja någonsin indexeras separat. Jerusalems
SLUTGILTIGA fall (kap. 24-25, kung Sidkia) täcks redan via Jeremia
(Fas 44) och indexeras medvetet INTE igen här. 54 automatfixade +
5 manuellt fixade citat-kontamineringar, två fullständigt återskapade
förlorade verser (19:1, samma "verse wraps text"-mönster som setts
tidigare) samt en manuell smyckning av en genuin källtext-lucka
(2:11, "en vagn eld" saknade "av" jämfört med den parallella "hästar
av eld" i samma vers).

## Fas 50 (2026-08-27): Första Konungaboken färdigställd — Saba och rikets splittring

Fas 3 av 7 i planen — färdigställer Första Konungaboken (Fas 47
lämnade dessa två medvetet därhän). Drottningen av Saba (kap. 10) —
ren text, inget AI-tillåtet bildset hittat trots förnyad sökning.
Rikets splittring (kap. 11-12) — Salomos avfall, Jerobeams profetia
och uppror, Rehabeams dårskap, de tio stammarnas utbrytning och
guldkalvarna i Betel/Dan. 25 bilder (Sweet Publishing, CC BY-SA).
31 automatfixade + 3 manuellt fixade citat-kontamineringar, en
fullständigt återskapad förlorad vers (11:36).

## Fas 49 (2026-08-27): Domarboken — Debora, Gideon, Simson

Fas 2 av 7 i planen. Tre berättelser: Debora, Barak och Jael (kap. 4,
delar Sweet Publishings 20-bildsset), Gideon och de 300 männen (kap.
6-8, ETT sammanhängande avsnitt byggt av TVÅ källset — fläcken
(FB_Gideon_Fleece, 19 bilder) och striden (FB_Gideon_Midianites, 12
bilder) — delar en story-mapp med filerna omdöpta till löpande
visningsordning, samma mönster som Josefs tre bildset i Genesis), och
Simson (kap. 13-16, Lambsongs). 52 automatfixade citat-kontamineringar
plus tre manuellt fixade stragglare, inklusive en genuin DUBBLETT av
`<verse name="28">` i källkorpusen (Dom. 16:28) där en tom
fotnotsversion råkade skriva över den riktiga Simson-bönen vid
extraktion — upptäckt via omvänd sökning efter versens verkliga
position, första gången den bugvarianten setts denna session (skiljer
sig från de tidigare "text-taggen nästlad fel"-buggarna).

## Fas 48 (2026-08-27): Fjärde Moseboken (Numeri) — ökenvandringens uppror och under

Fas 1 av 7 i den plan användaren gav för att arbeta igenom resten av
"starka kandidater"-listan, en bok/punkt i taget. Fyra berättelser:
Spejarna i Kanaan (kap. 13-14, folkets otro dömer dem till fyrtio års
ökenvandring), Koras uppror (kap. 16, ren text — inget AI-tillåtet
bildset hittat), Kopparormen (kap. 21:4-9, korsfästelse-förebilden i
Joh. 3:14), och Bileam och åsnan (kap. 22-24). Extraktionen var
ovanligt ren — noll citat-kontamineringar att fixa, första gången
det hänt en hel bok på en gång denna session.

## Fas 47 (2026-08-27): Första Konungaboken — Salomos vishet, templet, Elia

Fortsätter listan över "starka kandidater". Fyra berättelser: Salomos
vishet (kap. 3, domen mellan de två mödrarna), Templet byggs och
invigs (kap. 8, molnskyn fyller templet), Elia och Baals profeter
(kap. 17-18, EN sammanhängande story från Elias introduktion till
Karmel-tävlingen, samma mönster som "Absaloms uppror"), och Elia vid
Horeb (kap. 19, den sakta susningen). 65 automatfixade + 12 manuellt
fixade citat-kontamineringar, en fullständigt återskapad förlorad
vers (3:1, samma "text-taggen nästlad i fel verse-element"-bugg som
tidigare — se Fas 42/43/44).

Utelämnat medvetet: Drottningen av Saba (kap. 10) — inget AI-tillåtet
bildset hittades (närmaste träff, "Solomon the Temple builder", har
AI-adaptationer förbjudna). Rikets splittring efter Salomo (kap.
11-12) — lägre narrativ prioritet, mest politisk uppräkning.

## Fas 46 (2026-08-27): Andra Samuelsboken — Davids kungadöme

Fortsätter listan över "starka kandidater", naturlig fortsättning på
Första Samuelsboken (Fas 42). Fem berättelser, arton bibelkapitel
extraherade (1, 5-7, 11-13, 15-18), 88 automatfixade + 9 manuellt
fixade citat-kontamineringar, en manuellt insatt saknad kolon (13:1,
källfelet fanns redan i XML-korpusen) och en missad `HERRES`-variant
(6:11) som normaliseringsscriptets vanliga mönster inte fångade:

- **David sörjer Saul och Jonatan** (kap. 1) — ren text, inget
  AI-tillåtet bildset hittat för klagosången.
- **David blir kung — arken förs till Jerusalem** (kap. 5-6) — Ussas
  död, David dansar inför arken, Mikals förakt. 19 bilder (Sweet
  Publishing, CC BY-SA).
- **Guds förbund med David** (kap. 7) — Natans profetia om en evig
  kungaätt (den messianska källtexten). Ren text.
- **David och Batseba** (kap. 11-12) — inkl. Natans lammparabel och
  Salomos födelse. 20 bilder (Sweet Publishing, CC BY-SA), tas upp
  tydligt men ej explicit.
- **Absaloms uppror** (kap. 13-18) — EN sammanhängande story från
  Amnon & Tamar till Absaloms död, samma mönster som "Josef och hans
  bröder". 25 bilder (Sweet Publishing, CC BY-SA).

Nya karaktärer: Batseba, Natan, Uria, Absalom, Amnon, Joab, Mikal,
samt "Tamar (Davids dotter)" — egen slug eftersom "tamar" redan
pekar på Judas sonhustru från Första Moseboken 38 (Fas 44), som är
en annan person med samma namn.

**Bugfix (samma fas):** bok-sidans radlayout klippte fel bort
bokprefixet ur slutreferensen — regexen letade efter "första siffran
i strängen" för att strippa bort bokens namn, vilket fungerade för
"Genesis 34:31" men inte för boknamn som redan BÖRJAR med en siffra
("2 Samuel 1:27" visade hela "2 Samuel 1:1–2 Samuel 1:27" istället
för "2 Samuel 1:1–1:27"). Påverkade även Första Samuelsboken. Fixat
i `src/app/[corpus]/[book]/page.tsx` genom att matcha
kapitel:vers-mönstret från slutet av strängen istället.

## Fas 45 (2026-08-27): Josua — Jerikos murar faller

Fortsätter listan över "starka kandidater" bland de otäckta böckerna
(Numbers, Josua, Domarboken, Andra Samuelsboken, Kungaböckerna,
Nehemja, Apostlagärningarna): Josua som tolfte bok, en enda story —
Jerikos fall (kap. 6), den mest kända episoden i boken. Nio bilder
(Lambsongs, CC BY-NC, AI-adaptationer tillåtna).

## Fas 44 (2026-08-27): Dina, Juda & Tamar, samt Jeremia i brunnen

Direkt uppföljning av frågorna i Fas 43 (svaren gavs, sen genomfördes
tilläggen):

- **Dina och Sikem** (Första Moseboken 34): ny story i slutet av
  Jakob-cykeln (seriesOrder 8, direkt efter försoningen med Esau).
  Ren text — inget AI-tillåtet bildset hittades för denna berättelse
  (rimligt givet ämnet). Ny karaktär: Dina.
- **Juda och Tamar** (Första Moseboken 38): ny fristående story,
  indexerad separat från "Josef och hans bröder" trots att den ligger
  inom samma kapitelspann (ett känt sidospår mitt i Josef-berättelsen).
  Ren text, samma skäl som Dina. Nya karaktärer: Juda (även kopplad
  till Josef-berättelsen, där han faktiskt har en roll) och Tamar.
- **Jeremia** (tionde boken, ny bok): "Jeremia i brunnen — Jerusalems
  fall" (kap. 37–39) — den enda sammanhängande berättande episoden i en
  bok som annars mestadels är profetisk poesi. 19 bilder (Sweet
  Publishing, CC BY-SA, AI-adaptationer tillåtna). Under extraktionen
  hittades och lagades samma typ av käll-XML-fel som i Daniel/Samuel
  (citat-kontaminering + ett kapitelrubrik-läckage in i vers 38:28/39:1,
  återskapat direkt ur rå XML).

Båda nya Genesis-stories tillagda i Tier 2 (handplockat kända) — Dina
och Juda/Tamar har egna Torah-parashor och är väletablerade berättelser
trots att Peterson inte täckt dem.

## Fas 43 (2026-08-27): Fyra korta boktillägg på direkt användarförfrågan

Uppföljning av Bibel-överblicken (Fas 42): fyra nya, korta böcker,
alla med bara EN berättelse vardera eftersom resten av respektive bok
är icke-narrativ:

- **Tredje Moseboken (Leviticus)**: Nadab och Abihus död (kap. 10) —
  bokens enda riktiga narrativa inslag. Ingen bildkälla hittad (för
  obskyrt ämne för barnbibel-illustrationer) — ren text.
- **Femte Moseboken (Deuteronomium)**: Moses död (kap. 34) — bokens
  enda NYA narrativa inslag utöver lagtexten. Sex bilder (delmängd av
  ett större 21-bilders Sweet Publishing-set om Moses död/Josuas
  tillträde, CC BY-SA, AI tillåtet).
- **Job**: "Jobs prövning", EN berättelse byggd av bara ramen (prolog
  kap. 1-2 + epilog kap. 42, inte den 39 kapitel långa poetiska
  mittdelen). Sju bilder (Lambsongs, CC BY-NC, AI tillåtet).
- **Höga Visan**: hela boken (8 kapitel) som ren text UTAN bilder —
  kärleksdikt/dialog, ingen scen att illustrera, tillagd enbart för
  att kunna läsas i appen på användarens uttryckliga önskan.

Även: en fullständig, publicerad överblick över alla 66 böcker i den
protestantiska kanon (status per bok — klar/stark kandidat/icke-
narrativ) samt skriftliga svar om Juda & Tamar, Dina, Paulusbreven i
korthet, och var Satan/ärkeänglarna förekommer i Bibeln.

## Fas 42 (2026-08-27): Första Samuelsboken — elfte boken

Den starkaste kandidaten i hela Gamla testamentet (se den publicerade
Bibel-överblicken): nio berättelser genom hela boken — Hanna och
Samuels födelse (1), Gud kallar Samuel (3), Saul smörjs till kung
(9-10), Saul förkastas som kung (15), David smörjs till kung (16),
David och Goljat (17), Davids och Jonatans vänskap (18-20), David
skonar Sauls liv (24), Sauls död (31). Tolv kapitel extraherade totalt.

Samma korsreferens-städning som Daniel krävdes igen (94 av 299 verser
kontaminerade, samma flerstegs-regex), plus en vers (3:2) som helt
tappat sin text till samma XML-kvirk som Dan 1:1 — återställd manuellt.

Nio bildset (Lambsongs och Sweet Publishing, alla CC BY-NC/BY-SA med
AI-adaptioner tillåtna) täcker boken — Sauls död använder bara fem
bilder (10-14) ur ett större 16-bilders set om hans sista dagar.
Upptäckte och fixade under verifiering: bildtexterna för just den
delade bild-mängden hade fel array-index (förväntade bildtexter vid
index 0-4 istället för 9-13, som matchar filnumren 10-14) — patchat
med tomma platshållare för index 0-8.

## Fas 41 (2026-08-27): Bok-sidans radlayout stramades upp + Markus fick en till berättelse

**Layout:** Ordantal, karaktär-taggar och tema-taggar visades tidigare
som ett enda ombrytande kluster till höger om varje berättelserad —
rörigt för rader med många taggar (särskilt synligt i Johannes/Lukas
efter Fas 40:s tillägg). Varje kategori ligger nu på egen rad,
staplade under titel/referens istället.

**Markus** (3 → 4 stories): Den blinde mannen i Betsaida (8:22-26) —
unik för Markus, det enda undret Jesus utför i två steg (mannen ser
först "gående träd" innan en andra beröring ger full syn). Sökte även
efter Legion/den besatte mannen i Gerasa (5:1-20, redan avvisad sedan
Fas 33) och den döve/stumme mannen (7:31-37) — enda hittade bildseten
för båda var Lumo Project Films, som förbjuder AI-adaptioner; inga
Lambsongs/Sweet Publishing/Richard Gunther-alternativ hittades för
någon av dem, så båda förblir utanför appen.

## Fas 40 (2026-08-27): Lukas och Johannes fyllda ut med fler kända berättelser

**Lukas** (6 → 10 stories): Herdarna och Jesu födelse (2:1-20, Lukas
egen julberättelse — skiljer sig helt från Matteus vise män, egen
bildkälla), Tolvårige Jesus i templet (2:41-52, den enda bevarade
episoden ur Jesu barndom), Liknelsen om fariséen och publikanen
(18:9-14), Vandringen till Emmaus (24:13-35, unik för Lukas). Ny
karaktär: Kleopas (uttryckligen namngiven i 24:18).

**Johannes** (7 → 10 stories): Kvinnan som ertappades med
äktenskapsbrott (8:1-11, "den av eder som är utan synd..."), Mannen
som var född blind (9:1-41, ett helt kapitel ägnas åt förhöret),
Petrus upprättas (21:1-25, tredubbel bekräftelse som svarar mot den
tredubbla förnekelsen hos Matteus).

Text extraherad för sex nya kapitel (Luk 2, 18, 24; Joh 8, 9, 21).
NT-vokativ-scan gav en (1) riktig träff: Simeons lovsång (Luk 2:29,
"Herre, nu låter du din tjänare fara hädan i frid") är riktad till
Gud, inte till spädbarnet Jesus — korrigerad till "Gud". Övriga sju
träffar (18:41, 8:11, 9:36, 9:38, 21:15-17, 21:20-21) är alla genuint
tilltal till Jesus och lämnades orörda.

GNPI-bildset för både kvinnan vid äktenskapsbrottet och Petrus
upprättelse hittades men förbjuder AI-adaptioner — Arabs for Christ-
alternativ användes istället för båda (samma mönster som upprepade
gånger tidigare i projektet).

## Fas 39 (2026-08-27): Daniel — tionde boken

De sex klassiska, berättande kapitlen (1-6) i Daniels bok: Daniel
vägrar kungens mat, Nebukadnessars dröm om bildstoden, den brinnande
ugnen, Nebukadnessars vansinne, Belsassars gästabud (skriften på
väggen) och Daniel i lejongropen. Kapitel 7-12 (apokalyptiska syner —
fyra vilddjuren, väduren och bocken, de sjuttio årsveckorna) lämnas
utanför, samma avgränsning som redan gäller för andra profet-/
uppenbarelsetexter i appen.

**Datakvalitetsstädning vid extraktion** (Daniels källtext visade sig
ovanligt problematisk jämfört med alla tidigare böcker): 65 av bokens
196 verser hade akademiska korsreferenser ("1 Mos. 10,10.", "Dan.
6,28. 10,1." osv.) hopklistrade direkt i versslutet av
extraherings-scriptet — städat bort med en flerstegs-regex (verifierat
noll kvarvarande träffar, och noll träffar av samma mönster i redan
seedad Genesis-text, som kontroll). Dessutom hade vers 1:1 helt
tappat sin riktiga text till en XML-strukturkvirk (kapitelrubriken
nästlad i FÖREGÅENDE vers-element, en känd men sällan utlöst kvirk i
källformatet) och fick sin text återställd manuellt direkt från
källkoden — samma kvirk, fast vid en SISTA vers, hittades även vid
gränsen 3:30/4:1 och åtgärdades likadant.

Fem bildset (Sweet Publishing, Bible Scenes/Jeremy Park och Lambsongs,
alla CC BY eller CC BY-NC/BY-SA med AI-adaptioner tillåtna) täcker de
sex berättelserna. Belsassars gästabud-setet (Bible Scenes,
fotorealistiskt/arkitektoniskt) visade sig sakna mänskliga figurer i
alla 16 bilder — Belsassar fick därför medvetet inget porträtt.

## Fas 38 (2026-08-27): Genesis och Matteus fyllda ut med fler kända berättelser

Svar på "gör klart Genesis, Exodus och Matteus": Exodus bedömdes redan
täcka hela sin huvudberättelse (13 stories, kallelse → plågor →
uttåg → öken → Sinai → guldkalv → förnyat förbund) — inga fler
tillägg gjorda där denna gång. Genesis och Matteus fick däremot fyra
respektive två nya, välkända berättelser:

**Genesis** (18 → 22 stories): Hagar och Ismael föds (16:1-16), Isak
föds — Hagar och Ismael skickas bort (21:1-21), Rebecka vid brunnen
(24:1-67, Abraham-cykelns avslutande episod), Jakob och Esau försonas
(33:1-20, Jakob-cykelns avslutande episod — löser upp spänningen från
"Jakob köper Esaus förstfödslorätt" och "...lurar till sig Isaks
välsignelse"). Fyra nya bildset (Sweet Publishing/Lambsongs, CC BY-SA
och CC BY-NC, alla AI-adaptioner tillåtna), ny karaktär "Hagar".

**Matteus** (22 → 24 stories): Tempelrensningen (21:12-17, ny episod
i Passionsveckan direkt efter Intåget i Jerusalem) och Fåren och
getterna (25:31-46, avslutar kapitel 25:s liknelse-trilogi tillsammans
med de tio brudtärnorna och de anförtrodda punden). Den senare har
medvetet INGA bilder — samma sökning som redan gjordes i Fas 24
bekräftades: alla hittade bildset för "Sheep and goats" har licens
som förbjuder AI-adaptioner. Bibeltexten fanns redan fullt extraherad
för båda kapitlen sedan tidigare faser, så inget nytt extraherings-
arbete krävdes för Matteus den här gången.

## Fas 37 (2026-08-26): Ordantal även på tidslinjen

Samma "N ord · Kort/Medellång/Lång"-etikett som redan fanns på bok-
sidorna visas nu under varje berättelses referens på `/tidslinje` med
— önskemål från användaren, för att kunna se längden direkt utan att
klicka in sig på varje berättelse. `lengthLabel()` flyttades från
`[corpus]/[book]/page.tsx` till `src/lib/bible.ts` (bredvid
`countWords()`) så båda sidorna delar exakt samma logik/trösklar
istället för att duplicera den.

## Fas 36 (2026-08-26): Ester — nionde boken

Hela Ester-boken (10 kapitel) seedad som sex berättelser: Vasti och
sökandet efter en ny drottning (1:1-2:23), Hamans påbud mot judarna
(3:1-15), Ester riskerar sitt liv (4:1-5:14), Kungens sömnlösa natt
(6:1-14), Hamans fall (7:1-8:17), Purimfesten instiftas (9:1-10:3).
Text från 1917 års kyrkobibel — normaliseringsscriptet hittade
konsekvent NOLL träffar på "Gud"/"HERRE", vilket är korrekt: Ester är
den enda bibelboken vars grundtext aldrig nämner Gud vid namn, ett
känt drag hos boken, inte ett missat extraheringsfel. Tre bildset i
samma serie som Rut (Sweet Publishing, "Story of Esther" del 1-3, CC
BY-SA, AI-adaptioner tillåtna) täcker hela boken, delade mellan sex
berättelser via fileStart/fileEnd. Alla sex Tier 2. Bokinfo nämner
den ovanliga avsaknaden av Guds namn samt kopplingen till Purimfesten.

## Fas 35 (2026-08-26): Rut — åttonde boken

Hela Rut-boken (4 kapitel) seedad i ett svep, precis som Jona: fyra
sammanhängande berättelser — Noomi och Ruts trohet (1:1-22), Rut
plockar ax på Boas åker (2:1-23), Rut vid tröskplatsen (3:1-18), Boas
gifter sig med Rut (4:1-22). Text från 1917 års kyrkobibel, GT-normalisering
utan komplikationer. Tre bildset i samma konstnärsstil (Sweet
Publishing, "The story of Ruth" del 1-3, CC BY-SA, AI-adaptioner
tillåtna) täcker hela boken — del 3 (kapitel 3-4) delas i sin tur
mellan de två sista berättelserna via samma fileStart/fileEnd-mönster
som Jona. Alla fyra Tier 2. Bokinfo nämner den akademiska debatten om
Ruts syfte som möjligt motargument mot Esra/Nehemjas krav på etnisk
renhet, samt kopplingen till Jesu släkttavla (Matt. 1:5).

## Fas 34 (2026-08-26): Jona — sjunde boken, första "mindre profeten"

Hela Jona-boken (4 korta kapitel) seedad i ett svep, uppdelad i fyra
sammanhängande berättelser: Jonas kallelse och flykt (1:1-16), Jona i
fiskens buk (2:1-11), Nineve omvänder sig (3:1-10), Jonas vrede och
Guds lärdom (4:1-11). Text extraherad från 1917 års kyrkobibel — som
GT-text normaliserades "HERREN"/"Herre" blint till "Gud" utan behov av
NT-vokativ-scan (den regeln gäller bara NT, se tidigare faser). Ett
enda rikt bildset (Richard Gunther, 26 bilder, CC BY-NC, AI-adaptioner
tillåtna) delades mellan de fyra berättelserna via
fileStart/fileEnd/orderStart — samma mönster som redan användes för
delade bildset i Genesis (t.ex. FB_RG_Lot mellan Abraham/Lot- och
Sodom/Gomorra-berättelserna). Alla fyra markerade Tier 2 — Jona är en
av de mest kända GT-berättelserna oavsett religiös bakgrund (judendom:
läses vid Jom Kippur; kristendom: "Jonas tecken" hos Jesus; islam: Yunus
har en egen sura i Koranen).

## Fas 33 (2026-08-26): Markusevangeliet — sjätte boken

Markus tillagt som en ny, sjätte bok i Bibel-korpusen (efter Genesis,
Exodus, Matteus, Lukas, Johannes) — en första grund med tre
berättelser som inte redan täcks via de andra evangelierna: den rike
unge mannen (10:17-31), blinde Bartimaios (10:46-52) och änkans två
skärvar (12:41-44), alla markerade Tier 2 (välkända). Text extraherad
och normaliserad från samma 1917-källa; vokativ-scan för "Herre"/"Gud"
gav noll falska träffar den här gången (inklusive korrekt bevarat
"Gud sade till min herre" i 12:36, ett Psalm 110-citat, inte
tilltal). Valde bort Legion/den besatte mannen i Gerasa (Markus 5) —
enda hittade bildsetet hade licens som uttryckligen förbjuder
"A.I. adaptations", utan Lambsongs-alternativ. Bokinfo
(beskrivning/författarskap/religiös koppling) och skrivtids-
uppskattning (ca 65–75 e.Kr., troligen det äldsta evangeliet)
tillagda enligt samma mönster som övriga böcker.

## Fas 32 (2026-08-26): Två till Johannes-berättelser + Tier 2-rättelse

Johannes från 5 till 7 berättelser: Jesus tvättar lärjungarnas fötter
(13:1-17, Petrus/Judas återknyter till Matteus) och Tomas som tvivlade
(20:19-29). Valde bort ett Good Shepherd-set (Johannes 10) — enda
hittade alternativet hade licens som uttryckligen förbjuder
"A.I. adaptations". Rättade även ett missat steg från Fas 31: alla sju
Johannes-berättelser markerade som Tier 2 i seed.ts (glömdes bort när
boken ursprungligen lades till).

## Fas 31 (2026-08-25): Johannesevangeliet — femte boken

Ny bok: 5 berättelser, allt material som INTE finns i Matteus/Lukas
(Johannes delar nästan inga scener med de synoptiska evangelierna) —
Bröllopet i Kana, Nikodemus, Kvinnan vid Sykars brunn, Lasarus
uppväckt, samt prologen "I begynnelsen var Ordet" (1:1-18), medvetet
utan bildgalleri (inget bra scenbaserat bildset för ett filosofiskt
stycke) men för tematiskt central för att utelämna — Logos-temat
hänger direkt ihop med Genesis/Jacques Derrida-referensen redan i
appen. Maria från Betania och Marta återknyter till samma
Character-rader som i Lukas (Lasarus systrar). Samma NT Herre/Gud-fel
som tidigare hittat och rättat i kap. 4 och 11 INNAN det skeppades.

## Fas 30 (2026-08-25): Tre nya Lukas-berättelser

Lukasevangeliet från 3 till 6 berättelser: Maria och Marta (10:38-42,
direkt efter Barmhärtige samariten i samma kapitel), Det förlorade
fåret och myntet (15:1-10, samma "förlorat och återfunnet"-trilogi som
Förlorade sonen), Den rike mannen och Lasarus (16:19-31, Abraham
återknyter till samma Character-rad som i Genesis). Ny karaktär "Maria
från Betania" medvetet skild från "maria" (Jesu mor) för att undvika
namnkollision. Alla tre tillagda i Tier 2 (lika kända/centrala som
bokens övriga liknelser).

## Fas 29 (2026-08-25): Bok- och cykel-emblem blev automatiska

De hårdkodade `bookBadge(...)`/`seriesBadge(...)`-anropen i
`gamification.ts` ersatta med `getDynamicBadges(stats)`, som bygger ett
emblem per bok och ett per berättelsecykel direkt från `stats.byBook`/
`bySeries` — alltså från vad som faktiskt finns i databasen just nu,
inte en lista jag måste komma ihåg att uppdatera. Två små, helt
VALFRIA stil-kartor låter kända favoriter (Genesis, Jakob-cykeln, ...)
behålla sina handplockade emoji/namn; saknas en bok/cykel där får den
bara en generisk ikon (📖/🔗) istället — aldrig inget emblem alls.
Effekt, verifierat live: gick från 17 till 19 emblem automatiskt utan
kodändring för själva innehållet — förutom Lukas-mästare dök en helt
ny "Passionsveckan klar" upp för Matteus Passionsvecka-cykeln, som
aldrig haft ett handskrivet emblem förut. Direkt användarönskemål: nya
böcker/cykler ska få emblem automatiskt allteftersom de läggs till.

## Fas 28 (2026-08-24): Lukasevangeliet — ny bok

Fjärde boken i Bibel-korpusen (efter Genesis, Exodus, Matteus): de tre
mest kända Lukas-unika berättelserna som inte finns i Matteus alls —
Den barmhärtige samariten (10:25-37), Liknelsen om den förlorade sonen
(15:11-32), Sackeus i trädet (19:1-10). Alla tre Tier 2 (handplockat
kända). Ny karaktär Sackeus, nytt tema Förlåtelse.

**Viktig upptäckt under textextraktionen**: till skillnad från Matteus
använder Lukas "Herren" även i BERÄTTAR-röst om Jesus (inte bara som
vokativt tilltal) — t.ex. "utsåg Herren sjuttiotvå andra" (10:1) och
"satte sig ned vid Herrens fötter" (10:39, Maria vid Jesu fötter). Den
blinda gudsnamn-normaliseringen hade gjort båda till "Gud", vilket
skulle ha läst som att GUD (inte Jesus) skickade ut lärjungarna/att
Maria satt vid Guds fötter. Rättade 13 sådana fall i kap. 10 och 19
INNAN de skeppades, genom att läsa varje förekomst i sitt sammanhang —
behöll "Gud" för genuina tilltal till Gud Fadern (t.ex. "du himmelens
och jordens Gud") och fasta fraser som "Guds rike". Sanity-checkade
Matteus för samma mönster i efterhand — inga träffar där (Matteus
narrator-röst kallar sällan Jesus "Herren" på samma sätt).

## Fas 26–27 (2026-08-24): Sparade citat, dagbok, rangordning, tidslinje

**Citat-stjärnmärkning**: varje enskilt Peterson-citat (segment-citat,
versnotering, eller framework-bok-citat som 12 Rules for Life) kan nu
stjärnmärkas individuellt, oavsett vilken av de tre citat-bärande
modellerna det sitter på (`Story.quote`/`PetersonSegment.quote`/
`VerseCommentary.quote` — samma tre fält `quoteIsFavorite`/`quoteRank`/
`diaryNote` upprepade på alla tre snarare än en gemensam polymorf
tabell, se `src/lib/quotes.ts`). Ny **/citat**-sida visar alla
stjärnmärkta citat i EN gemensam, globalt rangordnad lista — varje post
med förklaringstext, berättelsens miniatyrbild (för snabb visuell
igenkänning) och ett eget dagbokskommentar-fält (auto-sparas). Upp/ner-
knappar för manuell rangordning (medvetet valt över drag-and-drop —
samma resultat, mycket enklare att göra tillförlitligt). Story-sidan
visar en liten räknare bredvid "Markera som klar" när berättelsen har
sparade citat.

**Ny /tidslinje-sida**: alla korpusar/böcker i kanonisk ordning, varje
boks berättelser i sin `orderInBook`-sekvens, med avklarad/stjärnmärkt/
Tier-status synlig per rad — tänkt för att kunna scanna efter luckor i
sin egen läsordning. Varje bok visar en kort skrivtids-uppskattning
(nytt `Book.writtenEstimate`-fält) bredvid författarskapet.
Tidslinjen avslöjade direkt en genuin bugg: "Tabernaklet" (Exodus 25:1)
låg placerad EFTER guldkalven (32) och de nya lagtavlorna (33–34) i
läsordningen, trots att instruktionerna för tabernaklet gavs innan
guldkalven hann hända — rättad till rätt kronologisk plats. Ett bra
exempel på att en översiktsvy avslöjar data-fel som är osynliga när
man bara bläddrar en bok i taget.

## Fas 25 (2026-08-24): Djupdykning i Eden — outnyttjat material i redan nedladdade transkript

Användaren kom ihåg rätt att Jordan har mer att säga om Eden än de 2
versnoteringar som fanns — samma föreläsning (Bibelserien avsnitt 4,
`Ifi5KkXig3s`) var redan nedladdad från en tidigare fas men aldrig
genomsökt fullt ut. Lade till 2 nya versnoteringar (Gen 2:8 om den
"murade trädgården" som kultur/natur-balans, Gen 3:1 om ormens
"listighet" och en gnostisk läsart av ormen som medvetenhetens
frigörare) och 3 nya Peterson-referenser (en andra, distinkt
Törnrosa-läsning om överbeskydd, en kritisk Frost-kommentar, och en
Harry Potter/alkemi-koppling). Ett bra exempel på att mycket av det
redan nedladdade materialet fortfarande är delvis outforskat — samma
metod (gå tillbaka till transkriptet, sök brett, läs i sitt sammanhang)
kan upprepas för andra redan täckta berättelser om användaren minns
att Jordan sagt mer än vad som står inne.

**GitHub**: projektet har nu ett privat repo på
[github.com/spirit-web/biblisk-berattelse-index](https://github.com/spirit-web/biblisk-berattelse-index),
skapat och pushat via GitHub CLI (`gh`).

## Fas 24 (2026-08-24): Genesis + Exodus helt klara

De två sista luckorna i Andra Moseboken täpptes till, på uttrycklig
begäran om fullständighet:

- **Jetro ger Mose råd** (18:1-27) — Jetros besök och rådet att
  delegera dömandet till lägre domare. Inget FreeBibleimages-set finns
  för det här specifika kapitlet trots upprepad sökning (inte en
  licensfråga den här gången — det verkar helt enkelt inte finnas) —
  lades ändå in som appens FÖRSTA helt textbaserade story, utan
  bildgalleri, hellre än att lämna kapitlet outtäckt.
- **Nya lagtavlor och Guds härlighet** (33:1-34:35) — den direkta
  uppföljningen till guldkalven: Mose ber för folket, ser Guds
  härlighet passera, får nya tavlor efter att ha slagit sönder de
  första, kommer ner med ett strålande ansikte.

Andra Moseboken är nu 13 berättelser och täcker hela bokens narrativa
båge kapitel för kapitel. **Genesis och Exodus är därmed båda
fullständiga** — inga kända luckor kvar i något av de två böckerna.

## Fas 23 (2026-08-24): Två till Matteus-berättelser

Matteusevangeliet 20 → 22 berättelser: Liknelsen om de tio brudtärnorna
(25:1-13, direkt före punden-liknelsen i samma kapitel) och Petrus
förnekar Jesus (26:69-75, egen story trots att det ligger inom
rättegångs-kapitlet — en egen psykologisk vändpunkt om svaghet under
press, skild från Judas förräderi). Sökte även Fader vår (Matt
6:9-13) men det enda hittade bildsetet hade explicit "A.I. adaptations
prohibited" — utelämnat.

## Fas 22 (2026-08-24): Referens-baserad karaktärsremsa + tre nya Matteus-berättelser

**Karaktärsremsan gäller nu även framework-böcker**: Maps of Meaning,
12 Rules for Life m.fl. saknar riktiga StoryCharacter-kopplingar (ingen
är en "karaktär i berättelsen" i Bibel-mening) och visade därför
"0 karaktärer" trots ett rikt referens-index. `getCharacterStats()`
räknar nu även `Reference`-rader (personer/verk Peterson refererar
till) som "förekomster", så Maps of Meaning-sidan visar 19 referererade
tänkare/verk och 12 Rules for Life visar Solzjenitsyn/Frankl. Krävde en
datamodell-fix: `bookReferences`-loopen för 12 Rules for Life pekade
tidigare `storyId` mot ett EV. tvärboks-mål (t.ex. Genesis vid
syndafallet) istället för regelns egen story — det gjorde att
referensen aldrig dök upp någonstans användaren faktiskt tittade.
Samma system används automatiskt för Koranen och andra framtida verk
utan extra arbete.

**Header-ikonen** (länken till "Ditt framsteg") byttes från en tecknad
generisk figur till den riktiga Jordan Peterson-bilden, samma croppade
badge som Tier 1-märkena.

**Matteus utökad** från 17 till 20 berättelser: Petrus bekännelse
(16:13-20), Liknelsen om vetet och ogräset (13:24-30), Liknelsen om de
anförtrodda punden (25:14-30). Rättade proaktivt samma NT Herre/Gud-fel
som i Fas 20 (se `normalize_divine_name.py`-varningen) i de nya
kapitlen INNAN de skeppades — 7 fall. Sökte även bildset för
"Unforgiving servant" och "Sheep and goats" men samtliga hittade hade
licens som uttryckligen förbjuder "A.I. adaptations" — utelämnade
medvetet istället för att chansa.

## Fas 21 (2026-08-24): Karaktärsporträtt, karaktärsemblem, prioritetsnivåer

**Karaktärsremsa under "Om boken"**: varje bok-sida visar nu porträtt (i
en eller flera rader, radbryts naturligt) av alla karaktärer som
förekommer i boken, med namn och `x/y` — x = avklarade berättelser med
personen, y = totalt antal berättelser personen förekommer i, räknat
GLOBALT över hela appen (inte bara den bok man står på), eftersom
karaktärer som Mose/Elia nu återkommer över flera böcker. Porträtt är
inte AI-genererade — samma återanvända scenbilder som redan fanns på
`Character.portraitPath`; karaktärer utan bra bild får en enkel
bokstavs-cirkel istället för en dålig bild.

**Karaktärsemblem**: ny sektion på framsteg-sidan, ett emblem per
karaktär (35 st) som "låses upp" när ALLA berättelser med den personen
är avklarade — samma `x/y`-data som ovan, delad via en ny
`getCharacterStats()`-funktion i `gamification.ts`.

**Prioritetsnivåer** (synliga som små märken på varje berättelse-rad):
- **Tier 1** — verifierat Peterson-innehåll finns (samma `hasPetersonContent`-
  logik som redan användes för poängsystemet) → Jordan Petersons eget
  porträtt som märke (croppad/cirkelbeskuren version av en bild
  användaren tillhandahöll, sparad lokalt som `/images/badges/
  jordan-peterson-badge.png` — används bara som en liten intern ikon i
  denna privata app, inte återpublicerad någonstans).
- **Tier 2** — handplockat känd/central berättelse (t.ex. Röda havet,
  Bergspredikan, Bespisningen av de fem tusen) trots att Peterson ännu
  inte kopplats till den → fylld stjärna i accentfärg. Byggd genom att
  gå igenom alla berättelser UTAN Peterson-koppling och bedöma allmän
  kändhet (`isWellKnown`-fält på Story, handplockad lista i seed.ts) —
  se seed.ts-kommentaren för exakt lista och resonemang.
- **Tier 3** — allt annat (default, inget märke). I nuvarande innehåll
  bara två berättelser (Mose flyr till Midjan, Tabernaklet) — de allra
  flesta redan inlagda berättelserna är antingen Peterson-täckta eller
  välkända, vilket är en ärlig avspegling av hur boken byggts hittills.

**Klarmarkering är nu grön, inte brun/svart**: nytt `--success`-
designtoken (grönt, ljust+mörkt läge) ersätter `--accent` för
klarmarkerings-bocken på både story-sidan och bok-listans rader.
Bytte samtidigt Unicode-tecknet "✓" mot en egen SVG — vissa typsnitt
renderar checkmark-tecknet som en färgad emoji-glyf som ignorerar
CSS-färg, vilket var trolig orsak till att bocken syntes mörk/svart
även med `text-white` satt.

## Fas 20 (2026-08-23): Tabernaklet + fyra nya Matteus-berättelser

**Exodus** fick en tolfte berättelse, Tabernaklet (Exodus 25-40, 34
bilder) — sammanfattat som EN story eftersom kapitlen mest är
detaljerade bygginstruktioner utan Peterson-kommentar att luta sig mot.
Text-sektionen visar bara kap. 25 (förbundsarken) som representativt
utdrag, medvetet inte hela 25-40, för att undvika en missvisande "kunde
inte hämta"-varning (upptäckt live: hela intervallet 25-40 spänner över
kapitel 32, som redan används av guldkalv-storyn, så versbladet visade
fel berättelses text tills spannet begränsades).

**Matteus** utökad från 13 till 17 berättelser: Jesus kallar sina
första lärjungar (4:18-22), Bespisningen av de fem tusen (14:13-21),
Jesus går på vattnet (14:22-33), Förklaringen på berget (17:1-13) — den
sista länkar Mose och Elia till SAMMA Character-rader som redan
används i Exodus, så de nu visas som återkommande över böcker.
Medvetet undvek ett Lumo Project-bildset för lärjunga-kallelsen trots
bättre tematisk träff, eftersom dess licens uttryckligen förbjuder
"AI adaptations" — använde ett annat, CC BY-SA-licensierat set istället.

**Rättat samma dag**: gudsnamn-normaliseringen (byggd för Gamla
testamentets "HERREN" = JHVH) visade sig också träffa Nya testamentets
"Herre" som direkt tilltal till JESUS (t.ex. Petrus: "Herre, här är oss
gott att vara" vid förklaringen på berget) — hade blivit felaktigt
"Gud", vilket fick det att låta som att folk bad till Gud i tredje
person istället för att tala direkt till Jesus som stod framför dem.
Efter avstämning med användaren rättades 11 fall i Matteus kap. 8-27
tillbaka till "Herre" (behöll "Gud" för de 3 fall som faktiskt är
GT-citat om Gud, samt Jesu egen Psalm 22-referens "Min Gud, min Gud").
Dokumenterat i `normalize_divine_name.py` så misstaget inte upprepas om
fler NT-kapitel extraheras — regeln är bara säker att köra blint på GT.

## Fas 19 (2026-08-23): Bättre omslagsbilder + tre nya Exodus-berättelser

**Omslagsbilder**: `Story.thumbnailOrder` (nytt fält) låter boklistans
lilla omslag skilja sig från galleriets första bild. Många källset
börjar med en abstrakt, enfärgad "titelkort"-siluett (t.ex. ett gult
moln med en svart figur) som är okej längre in i galleriet men såg
intetsägande ut som omslag — direkt feedback från användaren, med
skärmdump. Bytte 16 berättelsers omslag i Genesis/Exodus/Matteus mot en
mer detaljerad bild längre in i samma redan nedladdade bildset (Jesus
korsfäst, Pilatus tvår sina händer, dopet i vattnet, m.fl.). För
Skapelsen — där källsetet inte hade något som visade jorden — hämtades
"The Blue Marble" (NASA/Apollo 17, 1972, public domain, Wikimedia
Commons), exakt det användaren föreslog som exempel. Hittade och
fixade samtidigt två till instanser av samma fileNum/order-missmatch-
bugg som i Fas 16 (Kains vrede-bilderna i Genesis, Exodus tio-plågorna).

**Andra Moseboken utökad** från 7 till 10 berättelser: Mose dödar
egyptiern och flyr till Midjan (2:11–22, fyller luckan innan den
brinnande busken), Manna och vaktlar i öknen (kap. 16), Vatten ur
klippan och striden mot Amalek (kap. 17). Text extraherad från samma
Språkbanken-XML, gudsnamnet normaliserat och läck-kontrollerat. Nya
karaktärer: Sippora, Josua (inget bra porträttfoto hittat i de
begränsade bildseten — `portraitPath` lämnas null, samma princip som
Esau). Ett tidigare olänkat Peterson-panelklipp ("Are You in Egypt, the
Desert, or the Promised Land?") kopplades till manna-berättelsen.

**Progress-sidan**: raderna under "Framsteg per bok" är nu klickbara
länkar till respektive bok (`stats.byBook` bär nu med `corpusSlug`).

## Fas 17 (2026-08-23): JBP Podcast avsnitt 491 (Dawkins & O'Connor) — meme/arketyp-böcker

Ny `PetersonSeries` för Petersons eget podcastflöde (skilt från
Bibelserien/Maps of Meaning). Första avsnittet: "491. Symbolic Patterns:
Memes, Archetypes, Dragons, Genes" med Richard Dawkins & Alex O'Connor
(2024-10-21) — efterfrågat direkt av användaren, som mindes att Peterson
namngav böcker för att koppla ihop Dawkins meme-begrepp med Jungianska
arketyper. Verifierat mot nedladdat undertext-transkript, inte bara
sekundärkällor (ASR-texten stavar "Erich Neumann" groteskt fel, "Eric
noyman"/"Eric nyman", men innehållet är otvetydigt i sammanhanget).

Hittade och la till: Erich Neumann (*The Origins and History of
Consciousness*, *The Great Mother* — Jungs "kanske störste elev"),
Mircea Eliade (*The Sacred and the Profane*, samt samma *A History of
Religious Ideas* som redan fanns citerad från Bibelseriens Noa-
föreläsning, se Fas 15 — nu bekräftad från ytterligare en källa) och
Camille Paglia (som studerat Neumann). **Om Piaget**, som användaren
undrade om: en fullständig transkript-sökning hittade INGEN
Piaget-referens i just det här avsnittet — Piaget-kopplingen finns
istället redan indexerad från Maps of Meaning föreläsning 5 (se Fas 8.1),
troligen det användaren mindes.

## Fas 16 (2026-08-23): Genesis komplett (kap. 46–50) + bildbugg

Sista biten av Första Moseboken: Jakob flyttar till Egypten,
familjeåterförening, Jakobs välsignelse av sina söner (kap. 49) och
bådas död. Peterson gjorde aldrig fler avsnitt efter "Joseph and the
Coat of Many Colors" (hans Bibelserie slutade vid episod 15) så ingen
video täcker det här — texten läggs ändå in för att göra Genesis
komplett kapitel-för-kapitel. Text extraherad från samma Språkbanken-
XML som tidigare kapitel, gudsnamnet normaliserat och läck-kontrollerat.
Bilder från FreeBibleimages.org "Joseph is reunited with Jacob"-setet
(Gen 45:16–46:34, CC BY-SA 4.0 — annan licens än de tidigare Lambsongs-
seten, angivet separat per bild).

Hittade och fixade samtidigt en bugg från en tidigare fas: `joseph-and-
his-brothers` kombinerar tre bildset i EN mapp, där filerna döptes om
till sitt visningsnummer vid nedladdning — men bildsökvägen byggdes på
råa käll-filnummer istället, så bildordning 10–28 pekade av misstag på
samma 10 filer som 1–10 (osynliga dubbletter av de första bilderna
istället för de riktiga, redan nedladdade "coat"/"brothers"-bilderna).
Verifierat live: alla 28 bilder är nu distinkta.

## Fas 8 (2026-08-22): Referens-index + klickbara etiketter

`Reference`-modellen (fanns i schemat sen tidigare men var oanvänd) fylld
med 8 verifierade citeringar — hämtade ur transkript vi redan läst i
tidigare faser, ingen ny research. Refererade tänkare (Dostojevskij, Jung,
Freud, Platon, Sam Harris, Alexander Luria, Michelangelo) modelleras som
riktiga `Character`-poster (inte fri text) så de får en egen sida precis
som bibliska karaktärer.

Nya globala sidor: `/personer` + `/personer/[slug]`, `/teman` +
`/teman/[slug]`. Alla karaktärs- och tema-etiketter i appen är nu
klickbara länkar dit. **Detta fungerar automatiskt för alla framtida
böcker/korpusar** (Koranen m.fl.) utan extra arbete — sidorna är inte
knutna till en specifik bok, de listar tvärs över hela databasen.

## Fas 15 (2026-08-23): Referenser på verk-nivå + Eliade och Frazer

Nytt `Reference.work`-fält: vilket SPECIFIKT verk Peterson citerar (t.ex.
"Brott och straff", "Pietà (skulptur)"), inte bara personen/idén i
allmänhet — svaret på "vilken bok av Dostojevskij/Nietzsche/Jung citeras
var". Bara ifyllt när ett verk faktiskt namnges i det vi läst/verifierat
— Nietzsche/Jung/Freud/Platon har inget verk-fält eftersom inget
specifikt verk namngavs i transkripten, hellre tomt än gissat. Fyllt i
för de 6 referenser där ett verk redan var namngivet: Dostojevskij ×2
(Brott och straff), Milton (Paradise Lost), Dante ×2 (Inferno),
Michelangelo (Pietà). Visas nu på både story-sidan och personsidan.

**Två nya referenser hittade** i Noa-föreläsningen (Biblical Series 6):
Mircea Eliade (namnger sin egen bok *A History of Religious Ideas*) och
James Frazer (*The Golden Bough*) — båda försvann i en tidigare
textsökning efter "Eliade" eftersom YouTubes auto-undertexter stavat
namnen katastrofalt fel ("Mercuria Eliata"/"Mel Elliott", "JG Fraser...
golden bow"). En äldre kommentar i seed.ts påstod redan att Eliade
nämndes där, men det hade aldrig faktiskt verifierats mot transkriptet
förrän nu — löst genom att läsa passagen i sitt sammanhang istället för
att bara textsöka på namnet.

**Gilgamesh-eposet** undersöktes (på användarens direkta fråga) men
hittades INTE i något nedladdat transkript — utelämnat snarare än gissat.

Referens-index nu 26 personer/verk, 28 referenser (upp från 24/26).

## Fas 14 (2026-08-23): Beyond Order: 12 More Rules for Life (2021)

Fjärde boken i Maps of Meaning-korpusen. Uppföljaren till 12 Rules for
Life — tolv nya regler, tyngdpunkten mer på kaos-sidan (för mycket
osäkerhet/upplösning) än ordnings-sidan av modellen. Samma metod som
tidigare bok-faser: inget digitalt exemplar tillgängligt, varje regels
citat korskontrollerat mot minst två oberoende sekundärkällor (Goodreads
officiella citatsida, Shortform kapitelsammanfattningar) 2026-08-23. Där
inget längre verifierat citat gick att hitta används regelns egen
ordalydelse som citat (samma princip som regel 4/6 i första boken).

Nytt "Bortom ordningen"-emblem tillagt i gamification-modulen (se Fas 13)
för symmetri med de andra bok-specifika emblemen.

## Fas 13 (2026-08-23): Gamification — klarmarkering, favoriter, emblem, poäng

Ny `StoryProgress`-modell (egen tabell, inte fält på `Story` — seed.ts
upsertar Story-poster vid varje ny fas, och användarens framsteg får
aldrig nollställas av det). Ingen inloggning/userId, appen är byggd för
en enda användare.

- Checkbox ("Markera som klar") + stjärnknapp ("Extra viktig") på varje
  story-sida, via Server Actions med optimistisk UI.
- Ny sida `/framsteg`: en "Jordan Peterson-visdomsmätare" (andel
  klarmarkerade AV de berättelser som faktiskt har verifierat
  Peterson-innehåll — segment eller bokcitat, inte bara ren bibeltext),
  övergripande procent, poäng, 16 emblem (milstolpar, bokspecifika,
  cykel-specifika), framsteg per bok, och en "Extra viktiga"-lista.
- Enkel poängmodell: 10 poäng per klarmarkerad berättelse, +10 bonus om
  den har Peterson-innehåll, +5 per extra-viktig-markering.
- Tecknad (INTE fotorealistisk) vägvisar-maskot i headern länkar till
  `/framsteg` — en stiliserad SVG-karikatyr för personligt/lokalt bruk,
  inte ett porträtt.
- ✓/★ syns nu även direkt i bokens berättelselista.

**Medvetet inte byggt än**: en dialog-/samtalsfunktion där "Jordan"
guidar eller svarar användaren — sparat till en senare fas.

## Fas 12 (2026-08-23): We Who Wrestle with God (2024) — ny bok

Petersons senaste bok tillagd som en tredje bok i Maps of Meaning-
korpusen (`we-who-wrestle-with-god`). Nio kapitel i kronologisk ordning
(skapelsen → Adam & Eva → Kain & Abel → Noa → Babels torn → Abraham →
Moses → Elia → Jona), varje kapitel format "Gud som X" applicerat på en
Gamla testamentet-berättelse — boken är Petersons mest direkta och
omfattande bibeltolkning sedan 2017 års Bibelserie-föreläsningar, men
som en genomskriven bok, inte transkript.

Samma metod som 12 Rules for Life: inget digitalt exemplar/transkript
av boken tillgängligt, så varje kapitels citat+sammanfattning är
korskontrollerad mot flera oberoende sekundärkällor (Gospel Coalition-
recension, SuperSummary studieguide, TEDS-reflektion, Prodigal
Catholic-sammanfattning m.fl.) 2026-08-23.

De sju första kapitlen (skapelsen t.o.m. Moses) cross-linkar direkt till
redan indexerade Genesis/Exodus-berättelser via `bookSourceRef`-mönstret
från Fas 10 — story-sidans referens-query generaliserades från
hårdkodat "12-rules-for-life" till alla `corpus.kind === "framework"`-
böcker, så samma kod nu servar båda böckerna (och alla framtida). Kapitel
8 (Elia, 1 Kungaboken) och 9 (Jona) saknar ärligt cross-link eftersom de
bibelböckerna inte är indexerade i vår Bibel-korpus ännu.

## Fas 11 (2026-08-23): Mesopotamien/Egypten/Logos + symbolbilder + buggfix

**Buggfix**: bilderna på "Jakob arbetar för Rakel"-sidan visade sig vara
trasiga (upptäckt av användaren via skärmdump). Orsak: `public/images/`-
mappen hette `jacob-serves-laban` men story-sluggen (som seed.ts bygger
bildsökvägen ifrån) är `jacob-serves-laban-for-rachel-and-leah` — döpte
om mappen. Kontrollerade programmatiskt att inga andra av de 41
bildseten i seed.ts har samma typ av mappnamn-mismatch.

**Mesopotamien/Egypten/Logos**: grävde fram ett tidigare ohanterat
~30-minutersblock i Maps of Meaning-föreläsning 8 om den babyloniska
skapelsemyten Enuma Elish (Tiamat, Kingu, Marduk vald till kungars kung
för att han kan SE och TALA — en tidig "logos"-idé) och dess egyptiska
motsvarighet (Osiris/Horus som farao, "demokratiseringen av Osiris").
Plus en Derrida/"strid mot logos"-referens i Genesis-föreläsning 2,
kopplad till en ny verseNote på Genesis 1:3 ("Varde ljus").

**Symbolbilder för ramverksböckerna**: till skillnad från
Bibelböckerna finns inget bildarkiv för Maps of Meaning/12 Rules for
Life. Löst med tre noga utvalda, öppet licensierade bilder från
Wikimedia Commons (en Marduk/Tiamat-relief — med en ärlig notis om att
identifieringen är omtvistad i modern forskning, se bildtext — samt en
Osiris/Isis/Horus-relief och ett hummerfoto för regel 1). **Medveten
avgränsning**: det här är EN handfull utvalda bilder för de rikaste
referaten, inte samma scen-för-scen-bildtäckning som Bibelböckerna har.
Fem nya persondporträtt (Solzjenitsyn, Nietzsche, Dante, Milton, Frankl)
återanvänder samma `Character.portraitPath`-mönster.

## Fas 10 (2026-08-23): Jakob/Laban-sagan + bok-interna referenser i 12 Rules for Life

**Jakob-cykeln fylld ut ytterligare** — nu 6 avsnitt: "Jakob arbetar för
Rakel — men får Lea" (Genesis 29:1–30:24) och "Jakob blir rik och flyr
från Laban" (30:25–31:55), insorterade mellan Jakobs stege och
brottningsscenen. Samma arbetssätt som Fas 9: ett redan nedladdat
transkript (Bibelseriens avsnitt 14, "Wrestling with God") visade sig
täcka hela Laban-sagan i detalj. Nya karaktärer: Laban, Rakel, Lea — alla
med porträttbilder. En tredje, fristående Dostojevskij-referens hittades
(Raskolnikov/Brott och straff kopplat till Jakobs "karmiska" bestraffning
— att bli lurad av Laban på samma sätt han lurade Esau).

**Ny funktion: bok-interna referenser i 12 Rules for Life.** Boken
refererar inte bara till Petersons egna YouTube-föreläsningar utan också
till andra verk/personer/berättelser INOM boktexten själv — t.ex.
syndafallsberättelsen i Regel 2, Solzjenitsyns Gulagarkipelagen i Regel
6/8/11, Kain och Abel i Regel 7, Viktor Frankl i Regel 8. Detta
återanvänder `Reference`-modellen (byggd i Fas 8) med `bookSourceRef`
som källa istället för en video — målet kan vara antingen en redan
indexerad `Story` (länkar tvärs över till Genesis, t.ex. "Adam och Eva i
Edens lustgård" direkt från Regel 2-sidan) eller en `Character` (ny
egen sida per refererad person, t.ex. Solzjenitsyn samlar nu automatiskt
ihop alla tre kapitel som nämner honom på sin `/personer/`-sida). Ny
sektion "Referenser i det här kapitlet" visas på varje rule-sida där det
finns data.

Sex referenser tillagda, korskontrollerade mot minst två oberoende
sekundärkällor (främst LitCharts karaktärs-/kapitelanalyser) 2026-08-23
eftersom boken — till skillnad från YouTube-materialet — saknar
transkript att verifiera mot. **Medveten avgränsning**: det här är EN
riktad research-insats, inte en fullständig genomgång av alla tolv
kapitel. Solzjenitsyn är den enda referens som med säkerhet återkommer i
flera kapitel; regel 1, 3, 4, 5, 9, 10 och 12 saknar här en lika tydligt
verifierbar, namngiven extern referens och är utelämnade snarare än
gissade — kan byggas ut senare om fler verifierbara källor hittas.

## Fas 9 (2026-08-23): Jakob köper förstfödslorätten + lurar till sig välsignelsen

Två nya Genesis-berättelser insorterade i Jakob-cykeln, i kronologisk
ordning FÖRE Jakobs stege: "Jakob köper Esaus förstfödslorätt" (Genesis
25:19–34) och "Jakob lurar till sig Isaks välsignelse" (Genesis 27:1–45).
Bygger på ett transkript som redan fanns nedladdat sedan tidigare
(Bibelseriens avsnitt 13, "Jacob's Ladder") — det visade sig innehålla en
lång, detaljerad genomgång av båda scenerna innan föreläsningen ens når
själva stege-drömmen. Nya, verifierade citat och tidsstämplar, plus en ny
Dante-referens (Peterson kopplar Esaus mordplan till Dantes Inferno, där
förräderi rankas som värst av alla synder). Ny karaktär: Rebecka. Nytt
tema: "Svek & bedrägeri". Esau och Rebecka fick porträttbilder för första
gången (Esau saknade tidigare bild helt eftersom inget nedladdat bildset
visade honom).

Bildmaterial nedladdat och verifierat från FreeBibleimages: `ls-jacob-esau`
(9 bilder, förstfödslorätten) + `jacob-deceives` (13 bilder, välsignelsen).
Bibeltext: Genesis 25 och 27 extraherade från 1917 års kyrkobibel-XML och
gudsnamn-normaliserade (inga Herre/HERREN-förekomster i just dessa kapitel).

**Bugg hittad och fixad under arbetet**: alla fyra story-upsert-loopar
(Genesis, Matteus, Exodus, Maps of Meaning) hade en `update: {}`
no-op-klausul — ändringar av `seriesOrder`/`orderInBook` på redan seedade
rader slog aldrig igenom vid omseedning, bara vid förstagångsskapande. Det
gjorde att Jakob-cykeln initialt sorterades fel (nya kapitel korrekt, gamla
kapitel kvar på sina ursprungliga positioner). Fixat i alla fyra loopar.

## Fas 8.2 (2026-08-23): 12 Rules for Life — riktiga citat + förklaringar

`Story.quote` (nytt fält) håller ett kort, verbatim citat direkt ur boken
per regel — hållet medvetet kort (en mening) av samma upphovsrättsskäl som
gäller Peterson-videocitaten. Till skillnad från videomaterialet finns
inget transkript att verifiera bokcitat mot, så varje citat är istället
korskontrollerat mot minst en oberoende sekundärkälla (Goodreads
officiella citatsida för boken, LitCharts kapitelsammanfattningar m.fl.)
innan det skrevs in — se kommentaren i `seed.ts` ovanför `rules`-arrayen.
Varje regel har också fått en omskriven, flerradig sammanfattning av
Petersons poäng och andemening (istället för tidigare enradiga
generiska beskrivning). Citat+sammanfattning visas nu i "Text"-sektionen
på varje regels sida — samma yta som tidigare bara visade en
platshållartext för ramverkskapitel. Samma yta gjorde även Maps of
Meaning-föreläsningarnas sammanfattningar synliga för första gången.

**Är 12 Rules for Life samma innehåll som Maps of Meaning/Bibelserierna?**
Nej — samma underliggande världsbild och psykologiska ramverk (arketyper,
kaos/ordning, ansvar, mening kontra bekvämlighet), men 12 Rules for Life
är i grunden en NY, mer tillgänglig bok: kortare, anekdotdriven, riktad
till en bredare publik, med långt mindre bibeltolkning och färre
akademiska referenser. Vissa teman (t.ex. hierarki/hummar-forskningen i
regel 1, syndafallet i regel 2) är omformuleringar av idéer som också
finns i Maps of Meaning/Bibelserierna, men boken i sin helhet innehåller
mycket nytt material (personliga anekdoter, kliniska fall från hans
terapipraktik, konkreta livsråd) som inte täcks av föreläsningarna.

## Fas 8.1 (2026-08-23): Rättelse — Nietzsche, + fler referenser med tidsstämplar

Fas 8 påstod felaktigt att Nietzsche INTE nämns i Maps of Meaning. Det var
fel, och byggde bara på att bara de första ~5–10 minuterna av varje
föreläsnings transkript hade lästs, inte hela. En riktad textsökning
("grep" på kända namn/verk) genom samtliga redan nedladdade transkript —
följt av att faktiskt läsa varje träff i sitt sammanhang innan den skrevs
in — hittade en verifierad Nietzsche-referens (föreläsning 8, 01:50:42:
kopplar den mesopotamiska skapelsemyten till "Gud är död" och en kritik av
postmodernismen) plus 12 till: Milton, Dante, Piaget, Darwin, och fem
Disney-filmer/bokserier (Lejonkungen, Törnrosa, Den lilla sjöjungfrun,
Peter Pan, Harry Potter, Sagan om ringen/Bilbo).

Referens-indexet har nu **18 refererade personer/verk och 20 referenser**
(upp från 7/8), och varje ny post har en exakt, transkript-verifierad
`atSec`-tidsstämpel som länkar direkt till rätt sekund på YouTube.

**Medveten avgränsning**, för öppenhets skull: det här är fortfarande INTE
en fullständig genomgång av alla ~30 timmar Maps of Meaning-material — det
vore inte rimligt att läsa rad för rad. Freud, Piaget och Darwin nämns
alla upprepade gånger genom hela serien; här finns EN representativ,
verifierad referens per person, inte varje enskild förekomst. Fler träffar
finns kvar i redan nedladdade transkript (bl.a. ytterligare Freud- och
Harry Potter-omnämnanden) som kan läggas till senare vid behov.

## Bokpresentationer (2026-08-22)

Varje bok visar nu en "Om boken"-sektion: vad den täcker, traditionell
författarskapsattribuering (+ kort not om modern forskningskonsensus där
den skiljer sig, t.ex. dokumentära hypotesen för Genesis/Exodus), samt
koppling till judendom/kristendom/islam — inklusive var Koranen har
parallellt material (Ibrahim/Musa/Isa) och var den uttryckligen skiljer
sig (t.ex. förnekandet av korsfästelsen, sura 4:157). Karaktärsantal och
antal kopplade Peterson-videor är INTE hårdkodat — härleds live från
befintliga relationer i databasen.

## Fas 7 (2026-08-22): Maps of Meaning + 12 Rules for Life

Framework-korpusen (fanns bara som tom platshållare sen tidigare) fylld:

- **"Maps of Meaning" (2017 års föreläsningsserie)**: 12 stories, en per
  University of Toronto-föreläsning. Använde 2017-föreläsningsserien
  istället för 1999-boken (som bara har 5 kapitel — för kort för ett
  meningsfullt index). YouTube-ID:n hämtade direkt ur den officiella
  spellistan (`yt-dlp --flat-playlist`), fritt tillgängliga utan
  inloggning. Varje Story har ett självrefererande `PetersonSegment`
  (videon ÄR kapitlet). Sammanfattningarna bygger på att läsa öppningen
  (~5–10 min) av 11 av 12 transkript — INTE en fullständig genomläsning
  av alla ~2,5 h per avsnitt. Föreläsning 7 saknade undertexter helt
  (`yt-dlp`: "no subtitles") — dess beskrivning är uttryckligen bara
  titel-baserad.
- **"12 Rules for Life"**: 12 stories, en per regel. Ingen video-koppling
  än (inget enskilt kanoniskt klipp per regel — materialet är utspritt
  över hundratals intervjuer/poddar, samma "discovery-fas"-läge som
  Nietzsche/Dostojevskij, se nedan).

## Fas 6 (2026-08-22): Andra Moseboken (Exodus) på djupet

Nytt bokobjekt `exodus` (order 2, mellan Genesis och Matteus). 7 stories
(Mose i vassen → Guldkalven), 4 karaktärer (Mose, Farao, Aron, Mirjam),
83 bilder. Bibeltext extraherad från samma 1917-korpus (13 nya kapitel).

**Peterson-koppling begränsad till säkra fall**: försökte samma
transkript-metod som för Genesis/Kristus, men `yt-dlp` fick "Please sign
in" på de fyra mest lovande klippen (10 plågorna, Sinai x2, guldkalven)
— de kräver inloggning vi inte har och som vi inte ska försöka kringgå.
Löste det genom att bara koppla klipp där TITELN entydigt namnger
berättelsen (4 av 16 klipp), med `startSec: 0` och `keyPoints` som
uttryckligen säger att kopplingen är titel-baserad, inte verifierad mot
innehållet. Resterande 12 klipp finns kvar bläddringsbara i den
togglebara Exodus-serien utan tvingad story-koppling.

**Bugfix i gudsnamns-normaliseringen**: upptäckte via en live-sida att
det vokativa "HERRE"/"Herre" (utan "-N", t.ex. "HERRE, varför skulle...")
inte fångades av föregående regex (som bara matchade "HERREN"/"Herren").
Kontrollerade sammanhanget för alla 9 träffar innan fix — alla var
riktade till Gud. Gemena "herre"/"herres"/"herrar" (34 träffar totalt)
lämnades AVSIKTLIGT orörda — de syftar genomgående på mänskliga herrar
(Esau, Josefs egyptiske herre, Aron som tilltalar Mose "min herre"), inte
Gud. Kört om på alla tre extraherade böcker, verifierat noll kvarvarande
gudsnamnsläckor.

## Fas 5.5 (2026-08-22): Bibeltexten på svenska — 1917 års kyrkobibel

Bytte bort World English Bible (engelska, hämtad live från bible-api.com)
mot **1917 års kyrkobibel** på svenska, efter uttrycklig önskan. Källa:
[Språkbankens bibel1917-korpus](https://spraakbanken.gu.se/en/resources/bibel1917)
(Göteborgs universitet, CC BY 4.0) — en ordannoterad XML-korpus (161 MB
uppackad). Extraherade bara de ~37 kapitel vår story-index faktiskt
använder (26 i Genesis, 11 i Matteus) med ett Python-skript
(`extract_1917.py`, körd engångs i sessionens scratchpad, inte sparad i
repot) som bygger ihop `<w>`-token till löptext per vers.

**Gudsnamnet normaliserat**: enligt uttrycklig önskan ("använd Gud som
namn för Gud") körs all extraherad text igenom en regex-normalisering
(`normalize_divine_name.py`) som ersätter "HERREN"/"Herren"/"HERRENS"/
"Herrens" med "Gud"/"Guds" — inklusive att kollapsa "HERREN Gud" (vanligt
i Gen 2–3) till bara "Gud" istället för "Gud Gud". Verifierat: noll
kvarvarande träffar på "Herren" i hela datasetet efter körning.

**Data lagras nu lokalt** i `src/data/bible-sv-1917/{genesis,matthew}.json`
(kapitel → vers → text) — `src/lib/bible.ts` läser därifrån istället för
att anropa en extern API. Det innebär att vi nu FAKTISKT lagrar bibeltext
i repot (till skillnad från tidigare avgränsning), men det är okej: 1917
års översättning är fri från upphovsrätt (utgiven 1917, ingen upphovsman
i livet), och källkorpusen (Språkbankens digitalisering) är uttryckligen
CC BY 4.0 — tillåter både lagring och bearbetning (t.ex. gudsnamns-
normaliseringen) med attribution.

**Övervägt och avfärdat**: "Svenska Kärnbibeln" (via wldeh/bible-api,
`sv-skb`) hittades också och fungerar tekniskt, men är licensierad
**CC BY-NC-**ND** 4.0 — "No Derivatives" förbjuder uttryckligen att ändra
ord/interpunktion**, vilket hade gjort gudsnamns-normaliseringen till ett
licensbrott. Valde bort den av det skälet, inte kvalitet (den är faktiskt
en rikare, mer kommenterad översättning).

Jordan Petersons egna citat (`quote`-fälten) påverkas INTE av detta —
de är fortsatt på engelska, oavsett bibeltextens språk, enligt tidigare
beslut om att inte omformulera hans ord.

## Fas 5 (2026-08-22): Nya testamentet — Matteusevangeliet

Nytt bokobjekt `matthew` (testament: "new"), 13 stories från födelsen till
uppståndelsen, grupperade i en "Passionsveckan"-cykel (intåg → uppståndelse,
7 avsnitt) + 6 enskilda tidigare stories (dop, frestelse, bergspredikan,
såningsmannen, stormen). 8 nya karaktärer, 130 bilder nedladdade (samma
FreeBibleimages-mönster som Genesis).

**Viktig skillnad mot Genesis-seriens Peterson-koppling**: "The Death and
Resurrection of Christ"-videon är EN sammanslagen video (inte 5 separata
som ursprungligen antaget) med riktiga kapitelmarkeringar (verifierat via
`yt-dlp --print chapters`). Till skillnad från Genesis-föreläsningarna är
det INTE en vers-för-vers-bibelläsning utan en tematisk essä byggd av
äldre blogginlägg — bekräftat genom att ladda ner och grep:a hela
transkriptet efter narrativa ankare (Gethsemane, Judas, Pilatus, Golgota,
tomma graven) utan träffar. Enda direkta bibelscitatet i hela videon är
Matteus 27:46 ("Eli Eli lama sabaktani"), som han läser i slutet av
kapitlet "Narratives and Sacrifice" — det är den enda `VerseCommentary`
på NT-sidan. De två andra segmenten (crucifixion, resurrection) är
kopplade på ren segment-nivå utan versankare, ärligt reflekterande att
källmaterialet inte ger mer precision än så.

**Första innehåll skrivet direkt på svenska** (efter användarens önskan om
att fortsätta på svenska): Matteus-bildtexterna i
`image-captions-matthew.json` är översatta från källans engelska alt-text
direkt till svenska, INTE bara kopierade på engelska som Genesis-
bildtexterna. Genesis-bildtexterna (`image-captions.json`) väntar
fortfarande på en översättningspass, se "Nästa steg".

## Bildkällor (2026-08-22)

Alla 13 Genesis-stories har nu illustrerade scenbilder (156 st totalt),
nedladdade från [FreeBibleimages.org](https://www.freebibleimages.org/)
till `public/images/genesis/<story-slug>/` — **inte hotlänkade** mot deras
CDN (de har inte gett explicit tillåtelse att vi belastar deras servrar
löpande, och lokala filer är mer robusta för ett offline-vänligt personligt
verktyg). Bildernas CDN-URL:er följer ett förutsägbart mönster
(`media.freebibleimages.org/stories/<KOD>/overview-thumbnails/NN_<KOD>_Thumbnail.jpg`,
480×360px) som verifierades med `curl` innan nedladdning.

De flesta stories använder **Lambsongs** (Jill Kemp, text / Richard
Gunther, konst — lambsongs.co.nz) för en sammanhållen visuell stil över
hela Genesis. Två stories (Adam & Eva, Kallelsen av Abram) fick inget
Lambsongs-set och använder andra krediterade konstnärer istället — märks
i UI:t per bild.

| Story | Källkod(er) | Konstnär |
|---|---|---|
| creation | FB_LS_Creation_Days | Lambsongs |
| garden-of-eden | FB_FN_Adam_Eve | Fishnet Bible Stories |
| cain-and-abel | FB_LS_Cain_Abel + FB_LS_Cain_Anger | Lambsongs |
| noahs-flood | FB_LS_Noah_Ark | Lambsongs |
| tower-of-babel | FB_LS_Tower_Babel | Lambsongs |
| call-of-abram | FB_RP_Abraham_Calling | freebibleimages.org |
| abraham-and-lot | FB_RG_Lot | Richard Gunther |
| covenant-with-abram | FB_LS_Abram | Lambsongs |
| sodom-and-gomorrah | FB_RG_Lot (samma set som ovan, sena bilder) | Richard Gunther |
| binding-of-isaac | FB_LS_Abraham_Isaac | Lambsongs |
| jacobs-ladder | FB_LS_Jacob_Ladder | Lambsongs |
| jacob-wrestling | FB_LS_Jacob_Israel | Lambsongs |
| joseph-and-his-brothers | FB_LS_Joseph_Dreams + _Coat + _Brothers | Lambsongs |

**Licens: CC BY-NC** (kontrollerad på `ls-cain-abel`-setet: personligt/
undervisningsbruk tillåtet, kommersiellt bruk EJ tillåtet, härledda verk
och AI-bearbetning tillåtet på just det setet — **licensdetaljer varierar
per set**, kolla om appen någonsin blir delad/publik). Fullt okej för
nuvarande personliga-bruk-status.

**Karaktärsporträtt** återanvänder bild nr. 1 från en relevant story
(arkivet har inga fristående porträtt, bara scenbilder) — en första
gissning per karaktär, byt gärna manuellt via `npm run db:studio` mot en
bättre bild när du bläddrat igenom galleriet.

**Uppslag som gjordes bilden av**: `Bash`/`curl` för att gissa och
verifiera CDN-koder (t.ex. `FB_LS_Noah_Ark`, `FB_RG_Lot`) direkt utan att
behöva öppna varje sida i webbläsaren — snabbare än att klicka igenom
16 story-sidor för hand.

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

## Uppdatering 2026-08-22: full text i appen + versnivå-kommentarer

Efter feedback (kontrast/design, att bibeltexten faktiskt ska synas i
appen, och att Petersons genomgång ska knytas till specifika verser i
stället för bara hela berättelsen):

- **Fullständig bibeltext, alltid i appen**: `bible.ts` hämtar nu varje
  kapitel för sig och klipper ihop dem, så även flerkapitel-berättelser
  (Noa: Gen 6–9, Josef: Gen 37–45) renderas i sin helhet — ingen
  "läs resten på annan sajt"-kompromiss längre. En permanent länk till
  BibleGateway finns ändå kvar som referens.
- **Vers-för-vers-layout**: texten radbryts vid varje ny vers (som i
  Petersons egna föreläsningsbilder) i stället för att flyta ihop i ett
  stycke.
- **`VerseCommentary`** (ny modell): för de specifika verser Peterson går
  in på extra djupt, visas nu — direkt inline efter just den versen — ett
  kort utvalt citat + en egen sammanfattning av poängen. Detta är en
  djupare nivå än `PetersonSegment.quote`/`keyPoints` (som gäller hela
  berättelsen). **Utökad täckning** (fortfarande inte komplett — täcker
  9 av 13 stories, en eller ett par verser per story): Skapelsen (v1:14),
  Adam och Eva (v2:25, v3:7), Kain och Abel (v4:4–5), Babels torn
  (v11:7–9), Kallelsen av Abram (v12:1), Noa (v6:9), Sodom och Gomorra
  (v18:23–32), Isaks offer (v22:5), Jakobs stege (v28:12–13), Jakob
  brottas (v32:28), Josef (v37:3–4). Saknas ännu: förbundet med Abram.
  Kräver mycket transkript-grävande per vers — se "Nästa steg".
- **Avvägning kring fullständiga transkript**: användaren efterfrågade
  Petersons ord "ordagrant" om varje mening — vi bygger medvetet bara
  korta utvalda citat (1–2 meningar), inte hela transkriptsegment, eftersom
  det senare börjar likna bulk-kopiering av hans upphovsrättsskyddade tal
  snarare än citat i kommentarssyfte. Beslutet står tills vidare men kan
  omprövas.

## Nästa steg

1. ~~Fyll i riktiga YouTube-ID:n~~ **Klart 2026-08-21**: alla 15
   Genesis-föreläsningar verifierade mot officiella kanalen via oEmbed.
   Kristus-serien visade sig vara EN sammanslagen video (inte 5) —
   kapitel-tidsstämplar för de fem delarna är fortfarande TODO. 16 fria
   Exodus-klipp tillagda (ett spot-verifierat, resten från archive.org-
   mirror, bör stickprovskontrolleras mer om serien aktiveras på riktigt).
   Avsnitt 11:s klipp hittades inte.
2. ~~Transkript → segment~~ **Klart 2026-08-21/22 för Genesis**: alla 13
   Genesis-stories har nu ett riktigt `PetersonSegment.startSec` (Noa har
   två, ett per video). Metod: `yt-dlp --write-auto-sub` → egen parser
   (`prisma/seed.ts`-grannmapp, se scratchpad) dedupar auto-undertexterna
   → grep efter var Peterson faktiskt börjar läsa/diskutera respektive
   bibeltext (inte bara nämner den) → tidsstämpel + egen kort
   sammanfattning. `endSec` är fortfarande obestämt för alla (svårare att
   hitta exakt "slutar prata om X och går vidare" utan djupare
   transkriptanalys) — kvarstår som förbättring. Kristus-serien (5
   kapitel i EN video) och Exodus-panelen är inte annoterade än.
3. **Koppla in textfetch** mot bible-api.com i berättelsevyn (ersätt
   TODO-texten i `src/app/[corpus]/[book]/[story]/page.tsx`).
4a. **Utöka `VerseCommentary`-täckningen**: just nu bara 5 verser
    annoterade (av potentiellt hundratals). Kräver att gå igenom
    respektive videos transkript (redan nedladdat för alla 15, se
    scratchpad-mappen från sessionen) vers för vers och plocka ut var
    Peterson gör en specifik poäng.
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
