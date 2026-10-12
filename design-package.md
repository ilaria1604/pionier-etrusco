# Design package: Camping Pionier Etrusco (Tier 1)

Deploy folder: `pionier-etrusco/` (index.html + assets/). Raw generations and review files live in `review/`, outside it.

## 1. The brand premise

**Di casa, dal 1953.** The logo is an Etruscan banqueter raising his cup to welcome a guest: the gesture of hospitality. Three generations of the same family have run this pineta since 1953, guests come back every summer, and the whole marina is three minutes on foot. The site teaches and sells one idea: under these pines you are at home. Every section answers "what does home look like here": who welcomes you (the family), where you sleep (your home for the week), your neighbourhood (the marina on foot), the family table (restaurant, bar, pool), day trips and back home at night, the whole family including the dog (camper stop), and the closing line invites the visitor to come home this summer.

## 2. The palette as CSS tokens

Taken from the brand guide (Declinaz_LOGO Pionier2021: teal #00ADAA, light teal #A6D9D7, brown #745E51, sand #D3C4B9, off-white) and tuned to the dusk grade of the hero. Declared deviation: sand canvas + a serif display is close to a banned default look, but here it IS the brand's own printed palette, the accent is the brand teal (not terracotta), and the signature line motif keeps it off the stock template. Final dusk tones get sampled from the approved footage after the video gate.

```css
:root{
  --canvas:#F3EEE7;        /* sabbia chiara, never pure white */
  --panel:#E9E0D5;         /* raised cards, sand */
  --night:#17211D;         /* pineta at dusk: hero stage, footer */
  --accent:#00807E;        /* deep brand teal: CTA fill with white text (4.8:1) */
  --accent-hover:#006B69;
  --accent-bright:#00ADAA; /* the logo's teal: lines and marks on dark */
  --accent-muted:#A6D9D7;  /* acqua chiara: whisper glows, particles, borders */
  --text-secondary:#6A574B;
  --text-primary:#33271F;  /* tronco di pino */
}
```

## 3. The type trio

- Display: **Young Serif** 400. Warm, heavy, vintage; the painted signs of a 1950s Italian seaside.
- Body: **Figtree** 400, 500, 600. Quiet and legible.
- Mono labels: **Courier Prime** 400, 700. The typewriter of a 1953 guest register.

## 4. The band map (hero ~480vh, starting points for the flick test)

Footage: one 6s shot. 0 to 1.5s high above the umbrella-pine canopy at sunset, sea glowing on the horizon. 1.5 to 3.5s straight vertical descent into the crowns, needles brushing the lens, sun flaring through branches. 3.5 to 5s through the branches, the camp below with warm string lights. 5 to 6s at rest at eye level: the A-frame glamping glowing under the pines. Action lane: the vertical centre; text lives left, in the sky and canopy shadow. Settle: glamping right of centre, text left.

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.22 | above the canopy, sunset haze | kicker "Montalto Marina · dal 1953" / h1 "Sotto i pini, a tre minuti dal mare." | blur-to-sharp (the haze clears), one-time load ramp |
| 2 | 0.25 to 0.50 | descent into the crowns, needles on the lens | "Tre generazioni della stessa famiglia." / "Dal 1953 accogliamo chi torna ogni estate." | drift-down (words fall with the camera) |
| 3 | 0.53 to 0.76 | through the branches, lights appear below | "Il mare, i locali, il paese." / "Tutto a piedi." | scatter (characters gather like lights coming on) |
| 4 | 0.82 to 1.00 | at rest before the glamping | h2 "Bentornati a casa." / "Piazzole, bungalow e glamping nella pineta di Montalto Marina. Aperti da aprile a settembre." / CTA "Richiedi disponibilità" + "Scopri il campeggio" | word-by-word rise into staged settle |

## 5. The static-hero copy block (phones, reduced motion)

Over the ending frame (glamping at dusk), cropped to keep the A-frame:
- kicker: "Montalto Marina · dal 1953"
- headline: "Sotto i pini, a tre minuti dal mare."
- subline: "Tre generazioni della stessa famiglia vi accolgono nella pineta di Montalto Marina. Aperti da aprile a settembre."
- CTA: "Richiedi disponibilità"

## 6. The below-fold outline (every section funnels to #richiesta)

Nav: logo mark + "Pionier Etrusco" · La famiglia · Dove dormire · Il mare · In campeggio · Dintorni · button "Richiedi disponibilità".

**S1 La famiglia** (the logo figure draws itself in line; register-style year stamps)
- label: "Registro ospiti · dal 1953"
- h2: "Tre generazioni, la stessa pineta."
- body: "Il Pionier Etrusco nasce nel 1953 nella pineta di Montalto Marina. Oggi lo porta avanti la terza generazione della stessa famiglia."
- body: "Ci trovi alla reception, al bar, tra le piazzole. Sappiamo chi arriva e chi torna, e tanti ospiti tornano ogni estate con figli e nipoti."
- stamps: "1953 · si apre il campeggio" / "Poi · seconda generazione" / "Oggi · terza generazione"
- album captions: "La reception" / "I fiori della reception"

**S2 Dove dormire** (tabbed showcase with real photos; different skeleton from S1)
- label: "Dove dormire"
- h2: "Scegli la tua casa per l'estate."
- Piazzole: "Per camper, roulotte e tende, all'ombra dei pini. Corrente, acqua e servizi con docce calde." (photos 19, 129, 135)
- Bungalow: "Sette bungalow in legno, con cucina, bagno e veranda. Letti matrimoniali e a castello per le famiglie." (photos 133, 72, 102, 91)
- Glamping: "Due capanne in legno nella pineta. La sera si accendono le lucine." (photos 1, 125)
- Home: "Due case luminose con veranda coperta, per chi vuole più spazio." (photos 121, 166?)  [check which photos are the Home units with the owner]
- Mobile home: "Due mobile home più semplici, per una vacanza essenziale a due passi dal mare." (photos to confirm)
- CTA link: "Chiedi se è libera"

**S3 Il mare** (THE interactive moment)
- label: "Il mare"
- h2: "Il mare è a tre minuti. Provalo."
- button: "Tieni premuto per andare al mare"
- while holding: a line path draws from "La tua piazzola" through drawn pines to "La spiaggia"; a typewriter clock runs 0:00 to 3:00. Release early: eases back.
- on completion: "Sei arrivato." then "Spiagge, locali, negozi: la marina è tutta a piedi. La macchina resta ferma per tutta la vacanza." (photos 140 sunset, 14 kayak and SUP)
- reduced motion: final state shown, no hold required.

**S4 In campeggio**
- label: "In campeggio"
- h2: "Tutto quello che serve, sotto casa."
- Ristorante: "Pizza, pesce e cucina di casa, a pochi passi dalla tua piazzola."
- Bar: "Il caffè del mattino e l'aperitivo della sera."
- Piscina: "Una piccola piscina per i pomeriggi più caldi."
- Animazione: "Giochi e serate per i bambini, e un po' anche per i grandi."
- E-bike: "Noleggio e-bike per la costa e l'entroterra." (photo 185)
- Kitesurf: "Siamo convenzionati con una scuola di kitesurf a Pescia Romana."
- note (only if no photos arrive): line illustrations instead of photos for restaurant, bar, pool, animation. No invented photos of real facilities.

**S5 Con il cane**
- h2: "Viaggi con il cane? Nell'area camper stop è il benvenuto."
- body: "Nella zona camper stop i cani sono ammessi. Scrivicelo nella richiesta e ti teniamo una piazzola lì."
- link: "Richiedi una piazzola camper stop"

**S6 Dintorni** (a drawn map strip, approximate times by car)
- label: "Dintorni"
- h2: "Una gita al giorno. La sera si torna a casa."
- Vulci: "Il parco archeologico e il ponte dell'Abbadia. Circa 25 minuti."
- Tarquinia: "Le tombe etrusche dipinte, con i banchetti che ricordano il nostro logo. Circa 25 minuti."
- Argentario: "Porto Santo Stefano, Porto Ercole, le cale. Circa 50 minuti."
- Isola del Giglio: "Il traghetto parte da Porto Santo Stefano."
- La Tuscia: "Borghi di tufo, lago di Bolsena, Tuscania."
- Pescia Romana: "Spiagge ampie e kitesurf. Circa 10 minuti."

**S7 Dicono di noi** (slow marquee of short verbatim phrases from public reviews)
- "Pineta fantastica" · "Personale cordiale e molto presente" · "Ben ombreggiato" · "La pizza è una goduria al palato" · "Bungalow molto carini" · "Tranquillo"
- attribution: "Dalle recensioni degli ospiti"

**S8 Domande frequenti** (h2: "Prima di partire.")
- "I cani sono ammessi?" / "Sì, nell'area camper stop. Se viaggi con il cane, scrivilo nella richiesta e ti diamo una piazzola lì."
- "Quanto è lontano il mare?" / "Tre minuti a piedi. Il campeggio è al centro della marina: spiaggia, locali e negozi si raggiungono senza auto."
- "Le piazzole sono all'ombra?" / "Sì, sono sotto i pini della pineta. Ci sono piazzole per camper, roulotte e tende."
- "Quando conviene venire?" / "Siamo aperti da aprile a settembre. Luglio e agosto sono i mesi più pieni. Se cerchi più calma e più scelta, giugno e settembre sono perfetti."
- "Cosa c'è dentro il campeggio?" / "Ristorante, bar, una piccola piscina, animazione e noleggio e-bike. Per il kitesurf siamo convenzionati con una scuola a Pescia Romana."
- "Come prenoto?" / "Compila la richiesta qui sotto: si apre la tua email con tutto già scritto. Oppure chiamaci allo 0766 802807 o al 329 3671083. Ti rispondiamo noi, di persona."

**S9 Richiesta (the single CTA, id="richiesta")**
- h2: "Quest'estate, torna a casa."
- sub: "Dicci quando vuoi venire e come viaggi. Ti rispondiamo noi, di persona."
- fields: Nome / Email / Telefono (facoltativo) / Arrivo / Partenza / Sistemazione [Piazzola camper, Piazzola roulotte, Piazzola tenda, Area camper stop con cane, Bungalow, Glamping, Home, Mobile home, Non so ancora] / Adulti / Bambini / Messaggio (placeholder "Per esempio: viaggiamo con un cane, arriviamo in serata...")
- button: "Prepara la richiesta"
- handling: mailto to info@pionieretrusco.com with subject and body pre-filled.
- success state: "La tua email è pronta. Controlla i dati e premi Invia." / fallback: "Non si è aperta? Scrivici a info@pionieretrusco.com o chiamaci allo 0766 802807."

**Footer**
- logo, "Camping Pionier Etrusco", "Via Vulsinia 2, 01014 Montalto Marina (VT)", "0766 802807 · 329 3671083", "info@pionieretrusco.com", "Aperto da aprile a settembre"
- disclosure: "Il video iniziale è un'illustrazione creata con l'intelligenza artificiale. Le foto nelle sezioni sono del campeggio."

## 7. The vector layer plan

- **Signature: la linea etrusca.** One thin teal line in the logo's single-line drawing style. It draws itself on scroll: under the hero it becomes the Etruscan running wave from the brand guide (page 5) as the divider; in S3 it becomes the path from the pitch to the sea. Absence test: without it the page loses both the Etruscan identity and the walk-to-the-sea story.
- The logo banqueter traced to SVG and drawn on in S1.
- Hand-drawn umbrella-pine silhouettes (single line) along the S3 path and the S6 map strip.
- Whisper particles: pine pollen motes drifting in warm light over the hero settle and S3.
- Environment layer: one fixed background of dappled pine shade moving slowly over the sand canvas, 70s cycle.
- Reduced motion: every line fully drawn, particles and drift stopped.

## 8. The engineering list

Blob fetch with the loading ring (streamed if over 8 MB), dt-normalized lerp, gated deadlock-safe seeks, delta-gated DOM writes, band pacing in vh with the flick test, the four-layer legibility system with the worst-frame audit, the five static-hero gates live in CSS and JS with change listeners, complete without video, the quality floor, and the whole-site-animated standard. All per `scrub-pipeline.md`.

## 9. The copy gate

Every viewer-facing line above ships verbatim. The built page must pass the Phase 9 gate: zero em dashes, zero stock words (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions), plus the body-copy sweep for AI tells. Deliberate devices here ("Il mare, i locali, il paese." / "Tutto a piedi.") are craft and stay.

---

## Revision 2 (owner feedback, 25 Sep 2026)

Hero band copy (verbatim, owner's wording):
| Band | Copy |
|---|---|
| 1 | chip "Camping Pionier Etrusco · dal 1953" / h1 "Dove il mare incontra la Maremma." |
| 2 | "Sotto una pineta, a 3 minuti dal mare." |
| 3 | "3 generazioni della stessa famiglia." / "Dal 1953 accogliamo chi torna ogni estate." |
| 4 | "Bentornati al Camping Pionier Etrusco." / "Piazzole, bungalow, glamping e home nella pineta di Montalto Marina. Aperti da aprile a settembre." / CTA "Prenota" + "Le sistemazioni" |

Static hero: chip as band 1, "Dove il mare incontra la Maremma.", "Sotto una pineta, a 3 minuti dal mare. 3 generazioni della stessa famiglia vi accolgono dal 1953.", CTA "Prenota".

Menu (from the current site): Il camping · Sistemazioni (Piazzole e camper stop, Bungalow, Glamping, Home) · Servizi · Spiagge · Tariffe · Escursioni · Contatti · button "Prenota".

Home page order: hero, Il camping (storia, fauna della pineta), Sistemazioni (4 cards to detail pages, ombrellone incluso), Il mare e le spiagge (walk + Montalto Marina, Murelle, Burano, Argentario), Servizi (ristorante e pizzeria, bar, piscina e area relax, animazione e Mini Club, kayak e kitesurf, noleggio bike + extras), Cani (camper stop pet friendly rules), Tariffe 2026 (season bar, tabs: Bungalow / Glamping e Home / Piazzole / Abbonamenti, offerte strip, PDF), Escursioni (map + 7 places), Dicono di noi, FAQ (6), Prenota form, footer with P. IVA.

Detail pages (generated from one template): piazzole.html, bungalow.html (Monolocale 20, Trilocale 28, Trilocale Superior 48), glamping.html (Luxury Lodge 45), home.html (Premium Comfort 34). Each: photo hero, intro + dotazioni, tipologie with planimetrie, gallery with lightbox, tariffe 2026, incluso / da sapere, CTA to the form with the type preselected (?sist=), other accommodations.

Facts source: current site campingpionieretrusco.it and the official PDF "tariffe-2026.pdf" (PDF wins where they differ: silence from 22:00, short stays 4/4 to 14/6). Mobile homes removed on owner's request.

## Revision 3 (owner feedback, 25 Sep 2026)
- Band 4 headline: "Bentornati al Pionier Etrusco."
- The mono chip is replaced by a round campsite badge (embroidered-patch style, inline SVG): double ring, "CAMPING PIONIER ETRUSCO" on the top arc in Young Serif, "MONTALTO MARINA" on the bottom arc, two small umbrella pines at the sides, the banqueter mark in the centre, "dal 1953". Used in band 1 (rotates in with the load ramp) and in the static hero.
- Detail pages: breadcrumbs over the photo removed. Replaced by an accommodation switcher on solid surfaces: "← Tutte le sistemazioni" + segmented Piazzole · Bungalow · Glamping · Home with the current page in teal.
- Logo PNGs regenerated with pure white strokes (straight alpha).

## Revision 4 (owner feedback, 25 Sep 2026)
- Band 1 badge: replaced by the OFFICIAL round logo from the brand guide (page 2, "declinazioni formato e colore", round version). Extracted as pure vector from the PDF (review/logo/logo-round.svg), inlined once as <symbol id="logo-round">, shown in cream with a soft round backing.
- Band 4: no more heavy black plateau. The scrim now sits on the headline only, with a soft falloff (--sa .78). The subline was removed so the block stays below the string lights, and the band starts at 0.87 so the text lands when the camera is at rest. Audit 3.77 to 4.72 on four screens; flick test OK.
- Camper stop / dogs block (home and piazzole page): quiet card on sand (small photo, smaller heading, plain text link) instead of the full teal band.

## Revision 5 (owner feedback, 25 Sep 2026)
- Hero captions rewritten as ONE sentence told across the four bands (owner's pick):
  1 "Dove il mare incontra la Maremma," / 2 "sotto una pineta a 3 minuti dal mare," / 3 "una famiglia accende le luci per voi, dal 1953." / 4 "Bentornati al Pionier Etrusco."
  Band 3 lands exactly when the string lights appear in the footage (echo principle). Static hero: headline band 1 + subline "sotto una pineta a 3 minuti dal mare, una famiglia accende le luci per voi, dal 1953."
- Historic photos: 4 of 6 from the owner's PDF (25092026_IrJ.pdf), extracted at native resolution, rotated upright: vintage "Camping Pionier" postcard, black and white entrance, colour postcard of the avenue under the pines, family at table. Left out: donkey cart (partial crop) and the hammock postcard (sideways, low detail). Shown as "Dall'archivio di famiglia" polaroid album in the story section, replacing the reception photos.
- Legibility audit after the change: bands 4.05 to 7.91 at 1440x900 and 1280x800.

## Revision 6 (owner feedback, 25 Sep 2026)
- Interactive moment: press-and-hold replaced by a single click. Button "Vai al mare"; one click runs the walk along the path with an eased 1.4 s animation while the clock counts 0:00 to 3:00, then the arrival content appears. Button becomes "Rifai la passeggiata" (click replays). Works with mouse, touch and Enter/Space; reduced motion jumps straight to 3:00.

## Revision 7 (owner feedback, 25 Sep 2026)
- Servizi: 5 cards instead of 6. The big photo card is now "Sport" and holds all sport info: Noleggio bike / Kayak sul fiume Fiora ("Weekend in kayak, anche con una notte in tenda sulle rive. Non serve essere atleti. Offerte Camping + Kayak in primavera e a settembre.", from the current site's offer page) / Kitesurf (scuola convenzionata di Pescia Romana) / Beach volley, bocce e calcetto (area relax, accanto alla piscina). The separate "Kayak e kitesurf" card was removed; the pool card no longer repeats the sports. Grid now fills exactly: big card 2x2 + four cards.

## Revision 8 (owner feedback, 25 Sep 2026)
- Accommodation cards: subtitle aligned across cards (titles reserve two lines and sit on the bottom line on multi-column layouts), subtitle in Figtree 500 15.5px; price row grouped ("da € 9 a notte"), "+ € 10 a persona" removed (home and detail pages).
- Band 4: "Benvenuti al Pionier Etrusco." bigger, one wide line across the lawn at the bottom (clamp 38px to 76px, capped by viewport height), buttons on the same row at the right; soft scrim on the headline only.
- One entrance for every phrase: all four bands use the same word-by-word rise (same ramp 0.06); the round logo fades and rises with band 1.
- Audit: bands 3.75 to 9.47 on four screens (band 3 gets a deeper scrim below 760px of height).

## Revision 9 (owner feedback, 25 Sep 2026)
- Accommodation card title "Piazzole" (was "Piazzole e camper stop"), home and detail pages; the two-line title reservation removed, all titles and subtitles align on one line.
- Camper stop CTA (home dog card and piazzole page): "Richiedi info" calls 0766 802807, with the note "Le tariffe del camper stop si ricevono per telefono: 0766 802807" (camper stop prices are not public).
- Contacts in the Prenota section: list with icons, phones and email in Young Serif 21 to 26px, small mono labels (Fisso, Cellulare, Email, Indirizzo).

## Revision 10 (owner feedback, 25 Sep 2026)
- The "casa" concept is replaced by "camping" in all copy:
  - storia: "Il nostro obiettivo è semplice: che il Pionier Etrusco diventi il vostro camping, quello a cui tornare ogni estate."
  - sistemazioni h2: "Scegli il tuo modo di fare camping."
  - servizi h2: "Tutto quello che serve, dentro il camping."
  - escursioni h2: "Una gita al giorno. La sera si torna in camping."
  - prenota h2: "Quest'estate, ci vediamo in camping."
  - bungalow lede "Bungalow in legno immersi nella pineta secolare, ..."; intro h2 "Camping sotto i pini, in un bungalow di legno."
  - glamping lede "... con tutti i comfort: cucina, bagno privato e due camere. Il camping in tenda, ma comodo."
- Headings: max-width 24ch with balanced wrapping (no orphan word on the last line).

## Revision 11 (owner feedback, 25 Sep 2026)
- Escursioni map: campsite pin moved inland from (374,232), which sat 8 units on the sea side of the coast, to (390,206), 24 units on land; label "Pionier Etrusco" moved to the right of the pin (408,212), 37+ units above the coastline, no crossing. Also fixed two labels the coast line touched: Tarquinia now right of its point (576,337), Argentario below its symbol (40,170).

## Revision 12 (owner photo and video selection, 28 Sep 2026)
- 9 owner videos encoded as silent vertical reels (540x960, H.264, no audio track, ~1 to 2 MB each, poster frames), loaded lazily near the viewport, autoplaying muted only while at least 55% visible, paused off screen and on hidden tabs; click, tap or Enter toggles pause; reduced motion never autoplays. Instagram-like card: progress bar, avatar with the logo mark, caption.
- Home: new dark section "Il camping, dal vivo." with 7 reels (pineta, glamping, piazzole, docce e servizi, e-bike sulle strade bianche, fino a Vulci, kitesurf) and prev/next buttons, placed after Servizi.
- Detail pages: "Dal vivo." reels (piazzole 2, glamping 2, bungalow 1).
- Photos: bungalow types get their own mini galleries from the owner's 2/4/6-posti folders (lightbox browses per gallery); new heroes (bungalow exterior, glamping at night with lights, piazzole at sunset, Home at dusk); refreshed galleries; bathrooms added to the piazzole gallery; Sport card photo = e-bike at the lake near Vulci; "Oggi" row of three flower photos above the family archive.
- Left out: the photo of a woman holding a dog next to the pool loungers (dogs are not allowed in the pool area).

## Revision 13 (owner feedback, 28 Sep 2026)
- Duplicates removed, best kept: Home (keep home-2 golden light as hero and card; drop home-esterno with grey structure and photographer shadow, drop home-1 hidden by a tree); Glamping (one daylight shot glam-fiori, one night shot glam-notte as hero; dropped glamping-giorno, glam-bici, glamping-sera, interiors 2 and 4); Bungalow (hero bung-hero cropped to remove the camper at the left; dropped bungalow-pineta, bung-esterno-2 with camper, and general-gallery photos that repeated the Monolocale room, veranda and bathroom); Piazzole (dropped viale-camper = camper-stop, piaz-3 cluttered, hero piaz-11 no longer repeated in the gallery). Home page cards now use bung-hero, glam-fiori, home-2.
- Professional grade on all 53 site photos, rendered from the originals (HEIC) in one pass (scratchpad grade.py): exteriors = S-curve with opened shadows + vibrance 0.2 + clarity; wood interiors = cooled orange cast (colortemperature 7800 mix 0.5 + colour balance), bright airy mids, clean whites, wood saturation 0.9; night = lifted shadows; sunsets = richer contrast; old-site interiors = light clarity only. Pre-grade copies kept in review/foto-prima-correzione.

## Revision 14 (owner feedback, 28 Sep 2026)
- Piazzole page: the "Area camper stop" block moved to the bottom (after Tariffe, before the final CTA band), photo removed (.cani-band.no-photo, single column).
- bung-pino (bungalow gallery): pink paving slabs cleaned of bird droppings, stains and debris and made uniform. Higgsfield gpt_image_2_5 retouch on a 4:5 crop of the paving only (2.75 credits), colour-matched to the graded photo (U +3, V -5, Y +2) and composited back with a feathered mask on the tree and step side; tree, deck, stones and weeds stay original. Master saved as review/bung-pino-pulita.png; manifest marks it 'keep' so re-grading never overwrites it.

## Revision 15 (owner feedback, 28 Sep 2026)
- Detail pages: the separate "Dal vivo." reels section is gone. Owner picked "Reel dentro la galleria": the reels are now tiles inside the "Guarda da vicino." masonry, mixed with the photos (slots 2 and 5), full column width, 9:16, same Instagram-style card (progress bar, avatar, caption), autoplay muted only while visible. Lightbox still browses photos only.
- Gallery subtitle on pages with video (owner's pick): "Il verde della pineta, in pochi secondi." Not shown on home.html, which has no video.

## Revision 16 (owner feedback, 28 Sep 2026)
- Camper stop / dog banner: no photo anywhere on the site (home #cani and piazzole #camper-stop both use .cani-band.no-photo). No page references camper-stop.jpg any more.
- Spacing rule: wherever a section meets a neighbour with a different background, its content keeps at least 24px from that edge (home #cani now has 48px on top, like piazzole #camper-stop). Automated audit on all 5 pages, desktop and phone: passes.

## Revision 17 (owner photo review, 28 Sep 2026)
- Bungalow types use ALL photos from the owner's reviewed folders, graded with the same pipeline:
  - Monolocale (2 posti, 6): mono-passerella, mono-camera, mono-cucina, mono-veranda, mono-bagno, mono-doccia.
  - Trilocale 28 (4 posti, 8): tri-esterno, tri-ingresso, tri-104, tri-cucina, tri-camera, tri-bagno, tri-veranda, tri-veranda-2.
  - Superior 48 (6 posti, 8): sup-esterno, sup-soggiorno, sup-soggiorno-2, sup-cucina, sup-camera, sup-bagno, sup-bagno-2, sup-veranda.
- Cover ("Immagine copertina bungalow", 6 posti folder): bungalow page hero = bung-cover.jpg (16:9 from the 3024x4032 original, left 25% cropped out to remove the grey building); home and detail-page cards = bung-cover-card.jpg (4:5 crop centred on the bungalow).
- Fix: plan figures had the browser's default figure margin (tiny plans, overflow on phones); .type .plan now margin 0.

## Revision 18 (owner feedback, 28 Sep 2026)
- New bungalow cover = "EXT bungalow 4 posti" (tiled roof, awnings, hedge, globe lamp): bung-cover.jpg (16:9 band from the 3024x4032 original, centred on the bungalow) for the bungalow page hero; bung-cover-card.jpg (4:5, full width) for the home and detail-page cards. The photo also stays in the Trilocale 28 gallery.
- The previous cover ("Immagine copertina bungalow", 6 posti folder) moves into the Superior gallery as sup-pineta.jpg (grey building cropped out), so every photo in the 2/4/6 posti folders is still used.

## Revision 19 (owner feedback, 28 Sep 2026)
- Sea section ("Il mare è a 3 minuti. Provalo."): collapsed before the click. The arrival content and the four beaches sit in .mare-more (grid rows 0fr, aria-hidden) and open to 1fr with a 0.9s ease when the walk reaches 3:00 (.mare.open). It stays open on "Rifai la passeggiata". Collapse is applied by the script, so without JS the content stays visible; reduced motion opens it immediately. Measured: desktop 930px closed / 1633px open; phone 696px / 2077px.

## Revision 20 (owner feedback, 28 Sep 2026)
- Removed from the Superior gallery: "Bagno bungalow grande" (window with checkered curtain) = sup-bagno-2.
- Missing rooms taken from the current site (campingpionieretrusco.it/bungalow/ and its three detail pages, saved in review/oldsite-bung): Trilocale 28 gets the bunk-bed room (T-06 -> tri-castello); Superior gets the second bedroom with two beds (2026 photo, Trilocale-cameretta -> sup-cameretta) and the bunk-bed room (S-02-2 -> sup-castello). Monolocale: nothing missing (the site's older bathroom photos show the pre-renovation bathroom).
- Not added, pending owner: the 2026 Superior kitchen photo (Trilocale-cucina.png, induction hob) differs from the owner's kitchen photo.

## Revision 21 (owner confirmation, 28 Sep 2026)
- Superior kitchen: the current kitchen is the induction one. sup-cucina.jpg now comes from the site's 2026 photo (Trilocale-cucina.png, 1400px); the owner's older kitchen photo ("Cucina bungalow grande buona") is no longer used. Alt: "Trilocale Superior: la cucina con piano a induzione".

## Revision 22 (owner feedback, 28 Sep 2026)
- Removed bung-veranda-cappello (veranda table with the branded tote bag, hat and books) from the bungalow gallery.

## Revision 23 (owner feedback, 28 Sep 2026)
- mono-camera (Monolocale bedroom) retouched with Higgsfield gpt_image_2_5 (2k, 2.75 credits): bedspread smoothed and neatly made, the hat hanging at the top left removed, window light balanced (garden and pines visible, luminous curtain). Master review/mono-camera-ritoccata.png, pre-retouch copy in review/foto-prima-correzione; manifest marks it keep.
- mono-camera, 2 more retouches (5.5 credits): more daylight and a sunbeam on bed and floor; through the window a distant umbrella pine on the left with a reed fence (cannucce) behind; then the sheer curtain closed across the window, pine softly visible through it. Master replaced in review/mono-camera-ritoccata.png.

## Revision 24 (owner feedback, 28 Sep 2026)
- Detail-page footer: removed the photo-credits line ("Foto del campeggio. Le foto degli interni e le planimetrie provengono dal sito del campeggio."). The home footer keeps the AI note about the opening video.

## Revision 25 (owner feedback, 28 Sep 2026)
- Settle band ("Benvenuti al Pionier Etrusco.") moved to the LEFT as a block: two lines ("Benvenuti al" / "Pionier Etrusco.", max-width 8.6em) with the two buttons below, top at 38vh, beside the narrowing A-frame (left edge ~39% of the frame at mid height). Size follows the free room: clamp(34px, (50vw - 19.6vh - gut - 40px) / 8.1, 96px); checked on 6 screens (1024 to 2560 wide), never touches the glamping.
- Band now starts at 0.9 (ramp 0.05) so the text lands once the camera rests; soft plateau scrim on the headline (--sa .83, fades to 0 at the edges); ghost button gets a dark translucent fill over the string lights. Audit: band 4 at 3.68 to 4.15 on four screens; flick test 6/3/2 for every band.

## Revision 26 (owner feedback, 28 Sep 2026)
- End cue: a round arrow at the bottom centre of the last scene (54px, dark translucent fill, soft bob), fades in with the settle (progress 0.94 to 0.985), links to #camping (smooth scroll). Always visible on the static hero (phones, reduced motion), hidden on very short screens. Tested: hidden at top and mid video, visible at the end, click lands on the story section; phone OK.

## Revision 27 (owner feedback, 28 Sep 2026)
- The small "SCORRI" mono label with chevron is gone. One scroll cue for the whole video: the same round arrow (54px, dark translucent fill, cream border, soft bob) at the bottom centre of every scene, visible once the video is ready (or failed). Click = next phrase (scrolls to where that phrase is assembled: 0.32, 0.59, 0.96), from the last scene = #camping. aria-label "Avanti". Tested through all four scenes.

## Revision 28 (owner feedback, 28 Sep 2026)
- Camper stop / dog section spacing balanced on home (#cani) and piazzole (#camper-stop): 72px above and below the card; the card spans the full content width (like the other sections) with inner padding clamp(24-36px) x clamp(24-44px). Measured 72/72 on desktop and phone.

## Revision 29 (owner feedback, 28 Sep 2026)
- Escursioni map: the teal ring (was the Bolsena lake around La Tuscia) now circles Vulci (ellipse translated to centre 420,132); Vulci label moved right of the ring (482,137); La Tuscia label placed next to its point (560,83, end-anchored). No label overlaps on desktop or phone.

## Revision 30 (owner feedback, 28 Sep 2026)
- The address opens Google Maps (new tab; the Maps app on phones): contacts in Prenota (label "Indirizzo · apri in Google Maps") and the footer address on all 5 pages. URL: google.com/maps/search/?api=1&query=Camping Pionier Etrusco, Via Vulsinia 2, Montalto Marina.

## Revision 31 (owner pick, 28 Sep 2026)
- Story stamps under the logo (owner picked "La pineta"): "1953 · Le prime tende, all'ombra dei pini." / "Poi · I pini crescono. Anche la famiglia." / "Oggi · Terza generazione, stessa ombra." (.stamps max-width 420px, one line each on desktop).
- Rev 31b: third stamp ("Oggi") removed on owner request; two lines remain.

### Rev 32: detail hero facts no longer look like buttons
The owner found the pill chips under the lede looked clickable. `.facts` is now a plain info line: a hairline rule above, Figtree 500 15.5px text with a small teal dot before each item, no border, no fill. The rule spans only the row (`width:fit-content`). One row on desktop; wraps to 2 or 3 rows on phones with no overflow.

### Rev 33: camping map redrawn in the site style (preview only)
The owner supplied the printed camping map. Redrawn as SVG, traced in the source pixel space (2000x1381) so the layout stays faithful. It has 185 pitch cells with numbers, 7 bungalows, glamping, technical rooms, 31 service markers and the left zone (area mediterranea, laghetto, parcheggio, camper stop, area sport, piscina).
Style: cream ground; muted sage land with filled crown pattern; teal fence line; earthy pitch tones (P #E6C9A8, T #C4855C, G #7A4E3D); Courier Prime numbers; white marker discs with teal line icons.
Views: "Tutto il camping" and "Zoom sulle piazzole" (viewBox tween; numbers only in zoom). Legend buttons filter by type or service; tooltips on hover or tap. Phones: 1000px map in a horizontal scroller.
Files:
- `assets/mappa.css`, `assets/mappa.js`;
- preview page `mappa-anteprima.html` (noindex). Delete it before deploy;
- generator `scratchpad/mappa/gen-mappa.mjs`.
Placement not decided yet. The original map has no Home category.

### Rev 34: map placed in the home page and anchor fix
- The map section `#mappa` now sits after Servizi, on a panel background. Heading "Ogni piazzola, ogni servizio." `gen-mappa.mjs` injects it between `<!-- mappa:start -->` and `<!-- mappa:end -->`. The preview page is deleted.
- `index.html` links `assets/mappa.css` and `assets/mappa.js`.
- The Piazzole page intro links to `index.html?vista=piazzole#mappa`, which opens the map on the zoom view.
- Bug fix, older than the map: links from other pages to home anchors (for example `#richiesta` from the detail CTAs) landed 600 to 1200px too low. Cause: the sea section collapsed with its 0.9s transition after the browser had already jumped. Fix: the initial collapse runs with no transition, and a one-time re-align to the hash runs on rAF and on load, skipped if the visitor has already scrolled. All anchors now land at 64px, under the nav.

### Rev 35: map services trimmed
The owner asked to keep one Reception icon only, the one in the camp (right side), and to remove Presa di corrente, Area TV and Area Wi-Fi from both the map and the legend. Bar and ristorante markers are spread across the freed space. There are now 27 markers and 19 legend services.

### Rev 36: glamping and home units on the map
- Glamping: 117+118 are merged into Glamping 117, and 130+131 into Glamping 130. There are now 2 glamping instead of 4.
- Home: 121+122 are merged into Home 121, and 124+125 into Home 124. New type H, colour slate blue #587486, with its own legend button "Home". Legend order: P, T, G, B, GL, H, L.
- Each merged unit keeps the first number of its pair. All other pitch numbers are unchanged, since they match the signs on the ground. 181 cells.

### Rev 37: hero shortened to 3 steps
The owner found the header too long. The third band ("una famiglia accende le luci per voi, dal 1953.") is removed, and band 2 now ends with a period: "sotto una pineta a 3 minuti dal mare."
- Timings: b1 0 to 0.30 (ramp .06); b2 0.36 to 0.68 (ramp .07); b4 0.86 to 1 (ramp .06).
- `.hero` height goes from 560vh to 420vh.
- `.b3` rules are removed.
- The static phone copy is updated to match.
- The settle scrim `--sa` goes from .83 to .86, because 1280x800 measured 3.49.
Worst-frame audit (`t4b.mjs`), headline contrast by band:
| Viewport | b1 | b2 | b4 |
|---|---|---|---|
| 1440x900 | 7.12 | 4.30 | 3.83 |
| 1366x680 | 8.10 | 3.71 | 4.52 |
| 1920x1000 | 9.02 | 3.63 | 4.26 |
| 1280x800 | 7.43 | 4.32 | 3.69 |
The arrow now stops at 0.44, then 0.93, then goes to #camping.

### Rev 38: second hero step aligned right
On owner request, `.b2` now sits at the bottom right: `right:var(--gut)`, `text-align:right`, and the headline pushed right with `margin-left:auto`.
Worst headline contrast at full opacity:
| Viewport | Contrast |
|---|---|
| 1440x900 | 5.17 |
| 1366x680 | 5.32 |
| 1920x1000 | 5.73 |
| 1280x800 | 5.03 |
All four are better than the left position.

### Rev 39: new glamping detail hero
- The owner supplied `foto-selezione/Camping/Glamping/copertina glamping.JPG`, a portrait photo at 1200x1600.
- It got the ext grade at full size and is saved as `assets/foto/glam-cover.jpg`, logged in `manifest.py`.
- The glamping hero is now `glam-cover.jpg` at `50% 56%`. `glam-notte` stays in the gallery.
- On desktop the title partly covers the tent. A split layout (photo on the right, text on the night background) was offered, and the owner chose to keep full width, consistent with the other pages.

### Rev 40: reception reel
The owner added `foto-selezione/Camping/Verde/Verde reception.MP4`, a 17.9s clip at 464x832.
- Encoded as `assets/video/reel-reception.mp4`: 464x832 native size, 24 fps, H.264 main, crf 31, no audio, faststart, 2.36 MB.
- Poster: `reel-reception.jpg`.
- Placed in the home reels as the second card, after La pineta. Caption "La reception", with "tra fiori e piante" below it. There are now 8 reels.

### Rev 41: usability test round (two testers, about 60 years old); all six fixes approved by the owner

1. **Price calculator (`assets/calc.js`, listino 2026).**
   - Placement: at the top of #tariffe on home (`#calcola`, all 7 types) and in #prezzi on every detail page (only that page's types).
   - Steps:
     - Step 1: large radio cards.
     - Step 2, weeks: arrival-week select with the price in each option, plus a weeks stepper (Sat to Sat for bungalows, Sun to Sun for glamping and home).
     - Step 2, piazzole: arrival and departure dates, adult and child steppers, second car.
     - Result: a dark panel with the total, one line per week or per season, notes, and "Richiedi disponibilità per queste date".
   - Rules applied: minimum 2 people billed per pitch; high-season warning under 7 nights; €50 kitchenette cleaning note; short-stay note.
   - The CTA fills the form (`window.prefillRequest`, or `?sist&arrivo&partenza&adulti&bambini` from the detail pages).
   - Numbers use a dot for thousands. Dates use Italian elision ("dall'8", "all'11", "1°").
   - **Next season:** update YEAR, the band dates and the prices at the top of calc.js.
2. **Full listino.** On home it sits inside `<details class="listino">` ("Vedi tutte le tariffe"). Table dates are now written in words everywhere ("dal 4 aprile al 23 maggio").
3. **Detail pages** (`tools/gen-pages.mjs`).
   - Header: lower (64vh), and facts are real links (#tipologie, #prezzi) with an arrow.
   - Photo-first type cards right after the header. Each card has:
     - a scroll-snap photo strip with arrows, "1 di N", and a tap to open the lightbox;
     - the price;
     - "Richiedi disponibilità" and "Calcola il prezzo" (→ #calcola, preselects the type);
     - a "Guarda la planimetria" thumbnail.
   - Glamping and Home now have photos in their card. Piazzole shows its gallery first.
   - Fixed action bar "Prezzi / Richiedi disponibilità": appears once the hero, CTA band and footer are out of view.
4. **Home hero cue.** It is now a labelled pill, "Scopri il camping". After 4.5s idle at the top, a "Scorri o tocca qui" bubble and a pulse appear (desktop scrub only).
5. **Story.**
   - "1953" and "Poi" are buttons with a thumbnail and "Guarda le foto di allora / di oggi", opening the archive and today's photos in the lightbox.
   - The Oggi row and the archive album images open the lightbox too.
6. **Services.**
   - Cards have "Guarda le foto (n)" (the whole card opens the photos) and "Vedi sulla mappa".
   - The service list items are links that scroll to the map and highlight that service (the map accepts several keys, e.g. "bagni,docce"). Wi-fi stays plain text.
   - New photos come from the owner's current site: piscina-1/2, piscina-giochi, ristorante-esterno, animazione-prato, beach-volley. Stock photos there (seafood, group on the beach) were not used.
   - The bar still has no photo.
7. **Beaches.** Now cards.
   - Montalto Marina has 6 photos (new: mare-onde, mare-bici, mare-orizzonte).
   - Le Murelle, Burano and Argentario open Google Maps (photos and route) until the owner sends photos.
8. **Shared lightbox.** Adds a caption, "n di N", touch swipe, and any `[data-photos]` trigger.
9. **Scroll fixes.** In-page anchors re-align after scroll ends, because lazy images above the target shift the page. `.detail` got `scroll-margin-top`.

**Maintenance:** the generators and helpers now live in `tools/` (`gen-pages.mjs`, `gen-mappa.mjs`, `manifest.py`, `grade.py`, `cdp.mjs`). The system temp cleaner had deleted some older scratchpad files.

### Rev 42: service cards without buttons
The owner disliked the "Guarda le foto (n)" and "Vedi sulla mappa" buttons on the service cards, so both are removed.
- Cards that have photos now carry `data-photos`, `role=button` and `tabindex`, so the whole card opens the lightbox.
- Small cards show a polaroid-style stack of up to 3 thumbnails in the top-right corner, with a teal camera badge showing the count. The stack fans out on hover.
- The Sport photo card shows a "5 foto" badge on its picture.
- The Bar has no photos and stays a plain card.
- The service list under the cards still links to the map.

### Rev 43: owner feedback on the usability round

- **Story.** The 1953/Poi buttons are removed. Under the logo there is only "dal 1953" (Young Serif, teal).
- **Beaches.** The "Guarda le foto" button on the Montalto card is removed; the photo with its "6 foto" badge still opens the gallery.
- **Services.** "Wi-fi gratuito" is removed from the services list.
- **Map.**
  - The camping entrance is added, as on the 2025 printed map (`review/mappa/mappa-camping-2025.jpg`, re-downloaded because the temp cleaner deleted the source image). It sits on the left fence at about (1006,668), just below the reception: an accent marker with an always-visible "Ingresso" pill and a gap in the fence.
  - It is also listed first in the services legend.
  - Tapping a map icon now selects that service, and tapping it again deselects it.
  - A "Togli la selezione" button appears whenever something is selected, and the intro says "Toccalo di nuovo per tornare alla mappa completa".
  - The camp zoom view is widened to [925,515,1030,414] so the label fits.
- **Calculator, redesigned.**
  - One card with three columns of equal height: 1 Dove vuoi dormire (a native select; a fixed label on single-type pages), 2 Quando arrivi, 3 Il tuo prezzo (light teal column). All three are visible from the start.
  - Before a choice, step 2 shows a disabled select "Prima scegli la sistemazione" and step 3 shows "€ ...".
  - Labels are short enough for phones: "5 → 12 luglio, € 1.150", with "(da domenica a domenica)" in the field label.
  - Stacked on screens under 960px.
- **Excursions.** Each time now shows how to get there: a car icon with "circa 25 min in auto"; the Giglio shows a ferry icon with "in traghetto".
- **Detail pages.** The facts tags are removed from the header. A new page structure has been proposed to the owner and is awaiting approval.

### Rev 44: detail pages rebuilt with structure A (approved by the owner)

Sections in order, each answering one question, with no repeats:
1. **Header.** Title, one sentence, "Richiedi disponibilità" and "Vedi i prezzi". No tags.
2. **Le foto (#foto).** One mosaic grid: the first photo is 2×2 and the reels are 2 rows tall (4 columns on desktop, 2 on phones). Glamping and Home now show their photos here.
3. **Quale scegliere (#tipologie).** Bungalow only. Three equal cards, each with:
   - a cover photo with a "N foto" badge (it opens all photos of that type in the lightbox, starting at the cover);
   - the name, number of people and description;
   - the price, aligned at the bottom;
   - the links "Guarda la planimetria" and "Calcola il prezzo" (→ #calcola, preselects the type).
4. **Cosa trovi (#dentro).** On the left, the description (plus the map link on Piazzole, plus the floor plan on single-type pages). On the right, the equipment and an "Incluso nel prezzo" checklist.
   - Camper stop: on Piazzole only, right after this section.
5. **Quanto costa (#prezzi).** The calculator, then the full listino, then the PDF.
6. **Da sapere.** The rules as a two-column list with info icons.
7. **Closing.** The CTA band, then "Altre sistemazioni", then the footer. The action bar stays.

The old photo-strip type cards and the dark "Da sapere" box are gone. Template: `tools/gen-pages.mjs`. Backup of the previous version: `tools/gen-pages.backup-rev43.mjs`.

### Rev 45: detail page order adjusted by the owner

- **Section order.**
  - Bungalow, Glamping and Home: header, Quale scegliere / La sistemazione (#tipologie), Cosa è incluso (#dentro), Quanto costa (#prezzi), Le foto (#foto), Da sapere, CTA band, Altre sistemazioni.
  - Glamping and Home get one wide card (photo on the left, details on the right; stacked on phones). It carries "N foto", the price, "Guarda la planimetria" and "Calcola il prezzo".
  - Piazzole: header, foto, Cosa trovi, prezzi, Da sapere, CTA "Ti teniamo la piazzola giusta", **camper stop**, Altre sistemazioni.
- **Included items.** The "Incluso nel prezzo" checklist card is removed on every page.
  - Units: the four useful items are merged into the equipment grid as "Dotazioni e servizi": Pulizia iniziale e finale, Biancheria da letto, Parcheggio di 1 auto, Wi-fi (new icons: clean, linen).
  - Piazzole: the equipment list already said "Incluso nel prezzo", so the card was a duplicate.
- **Spacing.**
  - Every section boundary is 96px.
  - Sections after the coloured price band get their own 96px top.
  - The first photo section gets a 96px top.
  - The camper stop has a 96px top under the dark band.
  - The single-type card photo no longer sets the card height (it is absolutely positioned, minimum 400px).

### Rev 46: calendar calculator, and deselecting the map by tapping outside

- **Map.** A click anywhere outside the icons, the legend, the highlighted pitches, the view toggle and the "Vedi sulla mappa" links clears the selection. The intro now says "toccalo di nuovo o tocca un punto qualsiasi fuori".
- **Calculator.** Rebuilt again: the weeks dropdown is gone. One card, three columns:
  1. **Column 1.** Step 1 "Dove vuoi dormire?" (select), then step 2 "Quanti siete?".
     - Adults and children steppers start at 0.
     - The maximum per type is enforced, and the plus buttons switch off at the limit: Monolocale 2 (+ lettino), Trilocale 4, Superior 5 or 6, Glamping 4, Home 4, Piazzola 8.
     - Pitches get "Bambini (3-7 anni)", the second-car checkbox and the minimum-2-people note.
  2. **Column 2.** Step 3 "Quando arrivi?": a month calendar with Monday as the first day, plus month navigation.
     - Weekly stays (Sat to Sat bungalows, Sun to Sun glamping and home): hovering highlights the whole week. A tap selects the arrival week; a tap on a later week extends the stay to the end of that week; a tap on an earlier week restarts.
     - Pitches: tap the arrival day, then the departure day.
     - A summary line ("Dal sabato 4 luglio al sabato 18 luglio (2 settimane)") with a "Cambia date" link.
     - Days before today are disabled, except when the listed season is already over (as now), so it can still be tested.
  3. **Column 3.** Step 4 "Il tuo prezzo": no price until type, at least one adult and full dates are set. Until then it shows a checklist of what is still missing.
- The request now carries the adults and children for every type.
- **Verified:** Trilocale 2 weeks from 4 July = € 2.000; pitch 3 to 10 August with 4 adults = € 588.

### Rev 47: calendar days can be deselected

- Tapping the **first day** again clears all the dates.
- Tapping the **last day** again:
  - pitches: removes the departure, so you choose it again;
  - weekly stays: removes the last week, or clears everything if there was only one week.
- The chosen first and last days are always tappable, even when outside a bookable week (for example the final checkout day).
- The summary line explains it: "Per togliere un giorno toccalo di nuovo, oppure cancella le date".

### Rev 48: new display typography, "Editoriale" (owner choice: version C, terracotta)

- **Display face.** Young Serif is replaced by **Playfair Display**, loaded as a variable font (`ital,wght@0,400..900;1,400..900`). The token `--f-display` now points to it.
- **Weights.**
  - 900: hero captions, `.h2`, page-hero h1, "dal 1953" (italic), the "Sei arrivato" line, the calculator title. Letter-spacing -.015 to -.02em.
  - 700: every other display use (card titles, prices, calendar month, contacts, marquee (italic), footer name).
- **Editorial accent.** One key word per heading is wrapped in `<em>` and set in italic terracotta.
  - New tokens: `--terra:#A65A33` on light backgrounds (4.4:1 on canvas) and `--terra-light:#E8A27A` on dark ones (hero, page heroes, mare, reels, CTA band, richiesta).
  - The hero split script keeps `<em>` words as accent words (`.w.k`).
  - Hero accents: mare, Maremma / pineta, mare / Pionier Etrusco.
- **Figures.** `font-variant-numeric:lining-nums` is set on html, because Playfair defaults to old-style numbers; the price table uses lining-nums with tabular-nums.
- **Hero sizes.** `.hero-h` is clamp(46px,6.6vw,104px). The settle headline divisor is now 8.4 with a 96px max, so "Etrusco." stays clear of the lit A-frame on wide screens.
- **Legibility audit** (`tools/audit-hero.mjs`, now kept in the project), worst plain / accent contrast:

| Screen | Band 1 | Band 2 | Band 4 |
|---|---|---|---|
| 1440x900 | 8.4 / 4.9 | 5.7 / 3.5 | 8.0 / 6.7 |
| 1280x800 | 8.4 / 4.8 | 5.8 / 3.4 | 7.0 / 6.7 |
| 1366x680 | 9.5 / 5.2 | 6.0 / 4.0 | 7.8 / 5.9 |
| 1920x1000 | 9.2 / 4.9 | 4.8 / 3.7 | 6.2 / 4.0 |

- **Backups:** `review/site.backup-rev47.css` and `review/index.backup-rev47.html`.

### Rev 49: bigger settle headline
On request ("questa scritta deve essere più grande"), the last hero phrase now sets on three lines: Benvenuti al / *Pionier* / *Etrusco.*
- `max-width:6.2em` forces the breaks.
- Font size: `clamp(40px, (50vw - 19.6vh - gut - 40px)/5.8, 132px)` with line-height 1. That is about 45% larger: 116px at 2000x1100, 74px at 1440x900.
- The widest line sits highest, where the A-frame leaves the most room, and the shorter lines follow the tent's slope.
- `.b4` moved from top 38vh to 34vh.
- Scrim: `--sa` .93, and the inset is widened to -40% -30% -58% -40% to cover the lit trunk at the lower left.

Worst-frame audit, plain / accent: 2000x1100 5.0/7.9 · 1920x1000 5.4/8.2 · 1440x900 5.8/5.7 · 1280x800 5.7/6.7 · 1366x680 5.5/8.0.

### Rev 50: Etruscan running-dog waves
The owner sent the classic angular "running dog" frieze (the teal wave on the printed map and old site), and all waves now follow it.

The shape is a polyline per unit (fractions of unit width and height): crest (.42,.12), crest end (.84,.38), hook back (.58,.53), down (.50,.81), foot (.82,.90). The long diagonal then runs up to the next crest. Joins are miter, caps butt.

Where it is used:
- **Divider under the hero.** Generated in `site.js` (`drawWaves`) at the real rendered width, with unit 40 and height 26px, stroke 5. It is redrawn on resize, so the units no longer shrink on phones. The scroll-draw animation is unchanged.
- **Walk to the sea.** Two rows (4 and 3 units, unit 22), stroke 3, drawn on arrival.
- **Excursions map.** Two runs off Giglio (unit 18), stroke 2.4.
- **Camping map lake.** Two small runs (unit 11), stroke 1.8, generated in `tools/gen-mappa.mjs`.

### Rev 51: Piazzole wording
- The Piazzole page h1 is now just "Piazzole"; "camper stop" is removed from the title. The camper stop stays in the lede, in its own section, and in the nav label "Piazzole e camper stop".
- The calculator option now reads "Piazzola per camper, roulotte o tenda", adding roulotte. The listino rows already said "roulotte, camper, tendauto o tenda".

### Rev 52: pitches selectable on the map like services
Tapping any cell (pitch, bungalow, glamping, home, technical room) works like a service icon:
- it selects that type, so every cell of the type lights up, the others dim and the legend button shows pressed;
- the tapped cell gets a dark outline (`.cell.cur`) and its label;
- in the full view, it zooms in first;
- tapping the same cell again clears everything. A tap on another cell moves the selection, and a tap outside clears it.

### Rev 53: one pitch at a time
Tapping a cell now highlights only that cell (`curCell`). Every other cell, including those of the same type, and every service icon fade out. The legend type stays unpressed, and the tapped cell keeps its dark outline and label. A second tap on it, "Togli la selezione", or a tap outside clears it. The legend "Sistemazioni" buttons still highlight a whole type.

### Rev 54: a stronger "switched off" state on the map
At 16% opacity the dimmed cells still showed their colour and number, so the owner still saw "all of them". When anything is selected (one cell, a type or a service), every other cell now becomes flat light grey (#E9E4DC) with no number, and the teal halo layer fades out. Only the selected place keeps its colour, its number and its outline.

### Rev 55: tapping a pitch only outlines it
Owner correction: the other pitches must stay enabled. Tapping a cell now only adds the dark outline (`.cur`, 2.6px) and its label, and nothing is dimmed. A second tap on the same cell, "Togli la selezione", or a tap outside removes the outline. The switched-off grey state (rev 54) now applies only when a type is chosen from the legend or a service is selected.

### Rev 56: request form, every field required
- **Required.** Nome, email, telefono (no longer "facoltativo"), arrivo, partenza, sistemazione, adulti and bambini. Only the message stays optional, and its label says so.
- **Starting values.** The accommodation select starts on a disabled "Scegli la sistemazione" option; "Non so ancora" is still a valid choice. Adults start empty (placeholder "Quanti?"). Children start at 0.
- **On submit,** each field with a problem:
  - turns red (label, 2px red border, light red fill);
  - shows a plain message underneath, e.g. "Scrivi il tuo nome.", "Controlla l'email: deve essere come nome@esempio.it", "Controlla il numero di telefono." (fewer than 6 digits), "La partenza deve essere dopo l'arrivo.", "Scegli la sistemazione.", "Scrivi quanti adulti siete (almeno 1).".
- **Summary.** A red line under the button says "Ti mancano ancora N campi: li trovi in rosso" and updates live as fields get fixed.
- **Focus.** The page scrolls to the first field to fix and focuses it.
- **Other.** Fixed fields clear their own error as you type. The email body now always includes the phone. A note "Tutti i campi sono obbligatori, tranne il messaggio." sits above the fields.

### Rev 57: map toolbar
The "Togli la selezione" button is replaced by a permanent "Vedi le tariffe" link (`.cmap-prices`, teal outline pill with an arrow) that goes to #tariffe. Selections are still cleared by tapping the same item again or tapping anywhere outside the map; following the link also clears them.

### Rev 58: menu label
The nav item "Il camping" is renamed "Chi siamo" in the desktop nav and the mobile menu on all five pages. It still links to #camping.

### Rev 59: phone version, option A ("same page, laid out the mobile way")
Desktop is unchanged (checked). On screens up to 720px:
- **Shortcut chips.** A sticky row under the header: Sistemazioni, Prezzi, Mappa, Servizi, Spiagge, Escursioni, Domande, Contatti. A scrollspy highlights the current section and the row scrolls to keep it in view. Section `scroll-margin` accounts for the chips.
- **Bottom bar on the home page** (`.home-bar`): "Chiama" (tel) and "Prenota" (#richiesta). It shows after the hero and hides over the request form, the footer and the calculator (`data-hide`). The detail-page bar also hides over #calcola.
- **Sideways swipe.** Accommodation cards (home and "Altre sistemazioni"), service cards, beaches, archive album, the bungalow "Quale scegliere" cards and the excursion places are scroll-snap rows. Each card is 80% wide, so the next one peeks in. The services list is one swipeable line of chips.
- **Story.** Only the first paragraph shows, then "Leggi tutta la storia". The logo is smaller.
- **Map.** A full-width preview plus an "Apri la mappa" button; any tap opens it full screen. Full screen has a sticky "Chiudi" bar, the zoom view at 1100px in a horizontal scroller, and the legend underneath. It locks page scroll and closes on Esc. "Vedi sulla mappa" links also open it full screen.
- **Calculator.** One step at a time with a progress bar (Chi e quanti, Date, Prezzo). Buttons: "Avanti" (enabled once a type and at least one adult are chosen), "Indietro", "Vedi il prezzo" (enabled once dates are set), "Cambia le date" and "Cambia sistemazione o persone". The step circles are hidden.
- **Detail pages.** The full price list folds into "Vedi il listino completo" (`details[data-open-wide]`, forced open and summary hidden on desktop). The equipment list uses two columns.
- **Spacing.** Section padding is 52px top and bottom on phones. The footer is lighter (two columns, small logo).

Result at 390x844:

| Page | Before | After |
|---|---|---|
| Home | 19,099px (~23 screens) | 12,117px (~14 screens) |
| Bungalow | 13,079px | 7,003px |

Backups: `review/index.backup-rev58.html` and `review/site.backup-rev58.css`.

### Rev 60: phone refinements and beaches without photos
- **Phones.**
  - The sticky anchor chips are removed (markup, CSS and the scrollspy now never run).
  - "Tutte le sistemazioni" is hidden in the detail-page tab bar; only the four tabs remain.
  - The hero "Scopri il camping" pill is hidden and the static copy sits lower.
- **Services on phones.** They no longer swipe, because uneven card heights left short cards mostly empty next to the long Sport card. They now form one list:
  - Sport is a full-width photo card;
  - the others are compact rows, with the icon on the left and the title and text on the right, each as tall as its own content;
  - the photo stack is scaled to 68% in the corner.
- **Beaches, all screens.** All photos are removed (the Montalto gallery button and the three Google Maps placeholders). The cards are text only, and every card's link reads "Apri su Google Maps".
