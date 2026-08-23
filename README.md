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
