# Hollowbloom – Visual & UX Research

Stand: 2026-11-01 · Ziel: React + TypeScript + SVG/CSS, PWA, Portrait 390×844, 0 € Betriebskosten.

> **Hinweis zur Quellenlage:** In dieser Session war direktes Abrufen vieler Seiten (opengameart.org, siliconera.com u. a.) per Netzwerk-Policy blockiert. Alle Fakten unten stammen aus Websuche-Ergebnissen (Snippets der verlinkten Seiten). **Lizenzen vor Verwendung immer auf der Originalseite gegenprüfen.** Zahlen ohne Quelle sind als „Faustregel / Praxiswert“ markiert.

Kontext aus dem Repo: 10 Kreaturen (je 5 pro Realm: `mossling, emberpup, puddlefin, teacup, honeybear` / `gloomwisp, bonecrow, hexcat, drownedknight, eclipsewyrm`), 5 Archetypen (bruiser, striker, guardian, support, swift), aktuell **6 Bottom-Tabs** (battle, team, summon, upgrades, rebloom, more), Art in `Sprite.tsx` als SVG, keine Grafik-Lib.

---

## 1. Kreatur-Design-Prinzipien

### Was die Profis öffentlich sagen

- **Ken Sugimori (Pokémon):** Erfolgsgeheimnis seien Designs, die „leicht zu verstehen“ sind und Vielfalt zeigen; „das Merkmal, die Fähigkeit oder die Form ist der Schlüssel“. Er balanciert bewusst: zu coolen Designs fügt er etwas „Uncooles“ hinzu, zu ernsten etwas Fröhliches („Addition durch Subtraktion“). Bewusste kleine „Makel“ machen Designs liebenswerter. ([Siliconera](https://siliconera.com/?p=723070), [SoraNews24](https://soranews24.com/2018/08/03/is-the-beauty-of-imperfection-the-secret-behind-the-popularity-of-pokemon-character-designs/amp/), [Bulbagarden: Sugimori's Works](https://dogasu.bulbagarden.net/features/sugimori_kens_works.html), [TechRaptor](https://techraptor.net/gaming/news/rare-sugimori-interviews-translated-detail-beta-pokemon-from-gen-5))
- **James Turner (Game Freak, seit 08/2026 Creative Director Art & Design bei TPCi):** Das Konzept ist das Wichtigste; Ziel ist ein „nicht zu kompliziertes Design mit eindeutiger Silhouette“. ([GoNintendo/Game Informer](https://gonintendo.com/stories/346779-game-freak-goes-over-the-challenge-of-creating-and-the-design-pr), [Nintendo Wire](https://nintendowire.com/news/2026/08/25/former-pokemon-artist-james-turner-returns-to-franchise-as-new-creative-director-of-art-and-design/))
- **Game-Boy-Erbe:** Frühe Sprites konnten nur wenige Graustufen zeigen, daher wenige Farben pro Pokémon – ein Constraint, der die Lesbarkeit bis heute prägt. ([Game Developer: Evolution of Pokémon Designs](https://www.gamedeveloper.com/design/evolution-of-pokemon-designs-gen-1))
- **Temtem (Crema):** Pipeline = Briefing (welche Rolle braucht das Roster?) → Skizzen → Detail/Farbe → **Outline, damit die Kreatur sich vom Hintergrund abhebt** → Iteration bis Art _und_ Game-Design zufrieden sind (Galios: „mächtig und allwissend“ muss lesbar sein, ohne Meta-Dominanz). ([Crema Devblog Galios](https://crema.gg/temtem/devblog-creating-galios/), [Pupoise/Loatle Devblog](https://devtrackers.gg/temtem/p/8a412032-the-process-behind-pupoise-loatle-and-the-gardens-of-azatlan))
- **Cassette Beasts (Bytten):** ~120 Monster, als Einheit animiert, dann in **Teile zerlegt** (Kopf, Arme, Rumpf …) und in der Engine zusammengesetzt – modulare Bauweise, die Fusionen ermöglicht. ([Wireframe](https://wireframe.raspberrypi.com/articles/creature-collecting-gets-an-analogue-upgrade-in-cassette-beasts), [Pocket Tactics](https://www.pockettactics.com/cassette-beasts/interview)) → Für uns: SVG-Kreaturen ebenfalls aus benannten `<g>`-Teilen bauen (body, head, ears, tail, eyes) – erleichtert Animation, Evolution und Varianten.
- **Monster Sanctuary (Moi Rai):** Größte Schwierigkeit: so viel Detail wie möglich in kleine Sprites, „ohne zu verwirren“. ([Limited Run Blog](https://limitedrungames.com/blogs/news/a-big-ol-world-of-critters-in-monster-sanctuary))
- **Coromon (TRAGsoft):** Modernisierter GBA-Pixelstil mit ausdrucksstärkeren Posen; Reviews loben, dass Designs _nicht_ wie Pokémon-Klone wirken. ([Siliconera Preview](https://www.siliconera.com/preview-attention-to-detail-makes-coromon-a-standout-monster-battler/), [Twinfinite Interview](https://twinfinite.net/2021/06/coromon-interview-tragsoft/))

### Regeln für Hollowbloom

**Formel:** `1 reales Tier/Objekt + 1 Element-Motiv + 1 Realm-Twist (+1 „uncooler“ Makel)`.
Beispiele: _Teacup_ = Teetasse + Tide-Dampfwellen + Hearth-Blümchenmuster + angeschlagener Henkel. _Drownedknight_ = Ritterhelm + Seetang/Tide + Umbra-leuchtende Augen im Visier + Seepocken.

**Shape Language** (Konsens der Designliteratur, kulturell nicht absolut): Kreis = freundlich/harmlos, Quadrat = stabil/verlässlich, Dreieck = gefährlich/schnell. ([Dreamfarm Studios](https://dreamfarmstudios.com/shape-language-in-character-design/), [BINUS DKV](https://binus.ac.id/bandung/dkv/2025/11/04/character-design-101-turning-simple-shapes-into-personality/)) Direkt auf Archetypen mappen:

| Archetyp | Primärform                    | Sekundär      | Beispiel                   |
| -------- | ----------------------------- | ------------- | -------------------------- |
| guardian | Quadrat/Trapez, breite Basis  | Kreis         | mossling, drownedknight    |
| bruiser  | großer Kreis + Quadrat        | –             | honeybear                  |
| striker  | Dreieck, nach vorn geneigt    | Kreis (Kopf)  | emberpup, hexcat, bonecrow |
| support  | Kreis/Tropfen                 | kleine Kreise | puddlefin, teacup          |
| swift    | langgezogenes Dreieck/S-Kurve | –             | gloomwisp, eclipsewyrm     |

Realm-Modifier: **Hearth** = gerundete Ecken (Radius ≥ 15 % der Kantenlänge), Kopf ≈ 40–50 % der Körperhöhe (Kindchenschema). **Umbra** = gleiche Grundform, aber 1–2 spitze Akzente (Hörner, gezackter Schwanz, Risse), Kopf ≈ 30–35 %, leuchtende Augen statt Glanzpunkt. Nie Blut/Gore – Gruselfaktor über Silhouette, Leuchten, Nebel.

**Farb-Limits (Faustregel):** 1 Grundfarbe (60–70 % der Fläche) + 1 Sekundärfarbe (20–30 %) + 1 Akzent (≤ 10 %, oft = Elementfarbe) + Augen/Outline. isaiah658s CC0-Pack nutzt z. B. konsequent „Schwarz + 4 Farben“ pro Sprite ([OGA](https://opengameart.org/content/50-monsters-pack-2d)). Jede Farbe darf 2–3 Shading-Stufen haben (Licht, Basis, Schatten).

**Augen & Ausdruck:** Augen sind der wichtigste Lesepunkt bei 64 px. Mindestens 6–8 px Augenhöhe bei 64 px Sprite, 1 weißer Glanzpunkt (Hearth) bzw. Glow ohne Pupille/Schlitzpupille (Umbra). 4 Ausdrücke als austauschbare `<g>`: idle, attack (verengt), hurt (zugekniffen/„><“), faint (Spiral/X).

**Unterscheidbarkeit bei 64 px – Checkliste:**

1. **Silhouetten-Test:** Alle 10 als schwarze Flächen nebeneinander – jede muss eindeutig sein. Variieren: Höhe/Breite-Verhältnis (hoch, breit, rund, lang), Position des „Schwerpunkts“, Anzahl Fortsätze.
2. **Squint-Test / 48 px-Test:** Auf 48 px skaliert müssen Element & Archetyp erkennbar bleiben.
3. Kein Detail < 3 px (bei 64 px Zielgröße) – feinere Details verschwinden.
4. Graustufen-Test: Werte (hell/dunkel) müssen auch ohne Farbe trennen.
5. Maximal 2 Kreaturen mit gleicher Primärform pro Realm.
6. Je ein **Signature-Feature** pro Kreatur (Teetassen-Henkel, Laternen-Schwanz, Krähenschädel) – das, was ein Kind nachzeichnen würde.

**Evolutionslinien (für später):** Silhouette wächst, Kern-Signature bleibt; Palette bleibt (Akzent darf wachsen); Stufe 1 rund/klein (Kreis), Stufe 3 kantiger/größer. Max. 1–2 neue Features pro Stufe.

**Cute vs. Cool:** Sugimoris Regel umsetzen – jedem „coolen“ Umbra-Design ein Element von Weichheit (zu große Pfoten, Wackel-Ohr), jedem Hearth-Design ein Hauch Kante (kleine Fangzähne bei emberpup).

---

## 2. Freie / Open-Source Kreatur-Art

| Asset                                                                 | URL                                                                                                                                         | Lizenz                                                         | Stil                                   | Front/Back          | Basis für proprietäre Art?                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| **50+ Monsters Pack 2D** (isaiah658) – 56 Monster, 64×64, Alt-Palette | [OGA](https://opengameart.org/content/50-monsters-pack-2d)                                                                                  | **CC0** (Credit optional)                                      | Pixel                                  | **Ja, beide**       | **Ja** – CC0 erlaubt alles, auch Closed-Source                   |
| **Openmon Monster Sprites / Shibu** (screensmith) – 19 × 64×64        | [itch](https://screensmith.itch.io/openmon-monster-sprites-set-1), [Shibu](https://screensmith.itch.io/shibu-front-sprites-openmon-monster) | CC0 (laut Listing)                                             | Pixel                                  | nur Front bestätigt | Ja                                                               |
| **Kenney Monster Builder Pack**                                       | [itch](https://kenney-assets.itch.io/monster-builder-pack), [OGA](https://opengameart.org/content/monster-builder-pack)                     | **CC0**                                                        | **Vektor-artig/flat** (modulare Teile) | nur Front           | Ja – gut als Referenz für modulare Teile                         |
| **Kenney Animal Pack (Redux)**                                        | [OGA](https://opengameart.org/content/animal-pack-redux)                                                                                    | CC0                                                            | Flat-Vektor                            | Front               | Ja                                                               |
| **Tiny Creatures** (Clint Bellanger) 16×16                            | [OGA](https://opengameart.org/content/tiny-creatures)                                                                                       | CC0                                                            | Pixel                                  | –                   | Ja, aber zu klein                                                |
| **Hexany's Monster Menagerie** 32×32 1-bit                            | [itch](https://hexany-ives.itch.io/hexanys-monster-menagerie)                                                                               | CC0                                                            | 1-bit Pixel                            | Front               | Ja                                                               |
| **Tuxemon Set 1** – 154 Monster, Front+Back+Menü-Animationen          | [OGA](https://opengameart.org/content/tuxemon-set-1-154-monsters-front-and-back-sprites-and-menu-animations)                                | **CC BY-SA 4.0**, Attribution je Monster                       | Pixel                                  | Ja                  | **Nein** (siehe ShareAlike)                                      |
| **Retromon Free Pack** (Willibab) – 10 mit Back-Sprite                | [itch](https://willibab.itch.io/free-retro-pixel-monsters-sample-pack-1)                                                                    | Eigene Lizenz: kommerziell ok, **Credit Pflicht**, kein Resale | Pixel                                  | 10× ja              | Nutzbar, aber Bearbeitungen bleiben abgeleitete Werke des Autors |
| **LPC (Liberated Pixel Cup)** – für Avatare                           | [GitHub Generator](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator)                                      | gemischt: CC0 / CC-BY / OGA-BY / CC-BY-SA / GPL je Asset       | Pixel, Top-Down                        | 4 Richtungen        | Nur Assets mit CC0/OGA-BY, per Credits-Datei prüfen              |
| **game-icons.net** (~4.000 Icons)                                     | [about](https://game-icons.net/about.html)                                                                                                  | **CC BY 3.0** (Credit Pflicht)                                 | Vektor-Glyphen                         | –                   | Ja, mit Credit (kein ShareAlike)                                 |

### CC BY-SA – was ShareAlike konkret bedeutet

- Kommerzielle Nutzung ist erlaubt, aber **jede adaptierte Version** (umgefärbt, umgezeichnet, vektorisiert, in eigene Komposition eingearbeitet) muss wieder unter **CC BY-SA (gleiche oder kompatible Version)** veröffentlicht werden – inkl. Namensnennung. ([CC BY-SA 4.0 Deed](https://creativecommons.org/licenses/by-sa/4.0/))
- **Grauzone:** Ob ein ganzes Spiel „Adapted Material“ oder nur eine Sammlung ist, ist nicht abschließend geklärt; Entwickler meiden BY-SA-Packs deshalb aus Angst, das Spiel öffnen zu müssen. ([itch.io Diskussion](https://itch.io/post/631297), [LPC-Kommentare](https://lpc.opengameart.org/user/244/comments?page=1))
- Unstrittig: Wer eine BY-SA-Kreatur als **Basis** für eine neue Kreatur nimmt, kann diese neue Kreatur **nicht** „All rights reserved“ stellen. Konkurrenten dürften sie legal kopieren. LPC-Bedingungen zusätzlich: kein DRM/Verschlüsselung bei CC-BY(-SA)-Varianten.
- → **Für Hollowbloom (proprietär): BY-SA und GPL-Art komplett meiden.** CC0 ist unproblematisch, CC-BY nur mit Credits-Screen (bereits `Legal.tsx` vorhanden).

### Fazit: selbst zeichnen

1. Fast alle brauchbaren Monster-Sets sind **Pixel-Art** – passt nicht zu einem glatten SVG/2.5D-Look; Mischen von Stilen wirkt billig.
2. Front+Back gibt es frei fast nur bei CC0-isaiah658 (Pixel, 64 px) oder BY-SA-Tuxemon.
3. 10 Kreaturen sind überschaubar; eigene Vektor-Art = **volle Rechte**, Markenschutz, kein Stil-Bruch, und Wiedererkennung („nicht generisch“) ist genau das Ziel.
   **Empfehlung:** Kreaturen original als **handgebaute SVG** zeichnen (Inkscape/Figma, beide gratis). CC0-Packs höchstens als _Studienmaterial_ für Proportionen/Back-View-Perspektive nutzen, nicht abpausen. Für UI-Icons game-icons.net (CC BY) bzw. Lucide (ISC)/Phosphor (MIT). Assets & Herkunft in einer `ASSET_LICENSES.md`/Legal-Screen führen.

---

## 3. 2.5D-Battle-Szene (Monster-Tamer-Komposition)

**Kamera & Layout (390×844 Portrait, Battle-Bühne ≈ 390×420 px oben):**

- Kamera ≈ 20–30° von oben, leicht seitlich hinter dem Spieler-Monster („Over-the-shoulder“). Back-Sprites sind näher an der Kamera und daher **immer größer** als Front-Sprites ([PokéCommunity](https://www.pokecommunity.com/goto/post?id=5032024)); die Perspektive ist weniger frontal, als man denkt – Back-View zeigt ~3/4-Rücken, Kopf leicht zum Gegner gedreht ([Smogon](https://www.smogon.com/forums/goto/post?id=4844172)).
- **Spieler-Kreatur:** unten links, Mittelpunkt ≈ (28 % x, 72 % y der Bühne), Höhe ≈ 150–170 px, Back-View.
- **Gegner:** oben rechts, Mittelpunkt ≈ (70 % x, 38 % y), Höhe ≈ 100–115 px (Skalierung 0,65–0,75 des Spielers), Front-View, ggf. leicht zum Spieler gedreht (3/4).
- Diagonale von unten-links nach oben-rechts = Blicklinie & Angriffsrichtung.

**Plattform-Ellipsen:** Spieler-Ellipse ≈ 220×56 px (Verhältnis 4:1), Gegner ≈ 150×38 px. Füllung radialer Verlauf (Mitte hell, Rand dunkler), oberer Rand 1–2 px Highlight, darunter weicher Schatten. Hearth: Gras/Moos-Teppich mit Blumen; Umbra: Steinplatte mit Rissen, Nebelrand. Die Kreatur-Füße sitzen auf ≈ 40 % der Ellipsenhöhe (nicht auf der Mittellinie), sonst „schwebt“ sie.

**Tiefe:** (1) Skalierung, (2) vertikale Position (höher = weiter weg), (3) **Atmosphärische Perspektive**: Gegner-Plattform/Hintergrund mit 8–15 % Overlay in Himmelsfarbe, niedrigerer Kontrast, leicht entsättigt; (4) Überlappung (Spieler-Kreatur darf UI-Box/Plattform überlappen); (5) Kontaktschatten: dunkle Ellipse, `opacity .35`, 70 % Kreaturbreite.

**Hintergrund-Parallax (3–4 Layer):** Himmel-Gradient (0×), ferne Silhouetten Berge/Bäume (0,1×), mittlere Ebene (0,3×), Boden/Vordergrund-Gras (1×, unscharf, unten am Rand). In der Kampfszene reicht „Ambient-Parallax“: Layer driften langsam (20–60 s Loop) bzw. reagieren minimal auf Angriffs-Kamera-Pushes.

**Animation (Richtwerte):**

- _Idle „Breathing“:_ `scaleY 1→1.03, scaleX 1→0.985`, `transform-origin: bottom center`, 2,2–3 s, ease-in-out, pro Kreatur leicht unterschiedliche Dauer/Phase (sonst „Synchron-Roboter“). Augen-Blinzeln alle 3–6 s zufällig (120 ms).
- _Angriff (Lunge):_ Anticipation zurück 8–12 px (120 ms) → Vorstoß 30–50 px Richtung Gegner (100 ms, ease-out) → zurück (250 ms). Squash beim Aufprall.
- _Treffer:_ **Hit-Flash** weiß 60–100 ms (SVG-Overlay mit `opacity`, _kein_ CSS-Filter), **Hit-Stop** 50–80 ms, **Knockback** 6–12 px weg vom Angreifer + Rückfedern, **Screen-Shake** nur bei Crits/Boss (Trauma-Modell: Stärke = trauma², abklingend). Mehrere kleine Reaktionen binnen ~100 ms ergeben einen „satten“ Treffer. Reduced-Motion-Option für Shake anbieten. ([Juice it or lose it, GDC 2012 – Kursfolien](https://medienwissenschaft.uni-bayreuth.de/wp-content/uploads/GxD-10-Game-Feel.pdf), [Game-Feel-Leitfaden](https://appscale.blog/en/blog/game-feel-juice-hitstop-screenshake-easing-2026), [Hit-Stop-Studie, SciTePress 2024](https://scitepress.org/publishedPapers/2024/124614/pdf/index.html))
- _Faint:_ nach unten sinken + Fade 400 ms, Plattform bleibt.
- **Schadenszahlen:** Rounded-Bold-Font, weißer Fill + 3 px dunkle Kontur (`paint-order: stroke`), starten über dem Ziel, Pop `scale 0.6→1.25→1` (150 ms), dann 30–40 px nach oben + Fade (600 ms). Crit: größer, Gold, „!“, leichte Rotation ±8°. Effektiv/schwach (Element): Farbe + kurzes Wort („Super!“/„Schwach“). Bei Idle-Speed max. ~4 gleichzeitige Zahlen, sonst aggregieren.

**HP-/Info-Boxen (klassisches Muster):**

- Gegner-Box **oben links** (gegenüber vom Gegner-Sprite), Spieler-Box **unten rechts** (gegenüber vom eigenen Sprite) – so kreuzen sich Blick & Info nicht.
- Inhalt: Name, Level, Element-Icon, HP-Balken (8–10 px hoch, Radius voll), Spieler zusätzlich HP-Zahl. Farbwechsel grün → gelb (< 50 %) → rot (< 20 %). **Ghost-Bar**: hellerer Balken, der verzögert (300 ms delay, 400 ms) nachrutscht – macht Schaden lesbar.

**Team (3–6) bei nur 1 aktiver Kreatur:**

- **Bench-Leiste** unter der Bühne: runde Portraits 44–52 px, Rahmen in Elementfarbe, Mini-HP-Ring, aktive Kreatur hervorgehoben.
- Rotation bei Faint: aktive sinkt weg, nächste springt von links mit kleinem Hop auf die Plattform (300 ms). Für ein Idle-Game optional: „Tag-Team“-Wechsel alle X Runden für Abwechslung.
- Alternative bei 3er-Team: Hintergrund-Kreaturen klein und halbtransparent hinter der Spieler-Plattform (z = hinten), aber das kostet Platz/Lesbarkeit – Bench-Portraits sind auf 390 px klarer.

---

## 4. 2.5D im Browser – günstig implementieren

**SVG-Shading-Rezept pro Kreatur (alles statisch, nur `transform`/`opacity` animiert):**

1. Basis-Form mit `radialGradient` (Fokus oben-links = Lichtquelle; Stops: Licht 0 %, Basis 55 %, Schatten 100 %).
2. **Schatten-Shape** (Multiplikation simuliert): dunklere Farbe der Grundfarbe, kein Schwarz; an Unterseite/rechts.
3. **Rim Light:** dünner heller Strich/Shape am Rand gegenüber der Lichtquelle (Umbra: in Elementfarbe – sehr effektvoll).
4. **Ambient Occlusion:** dunkle, weichgezeichnete Ellipse zwischen Körperteilen (Kopf/Rumpf, Füße) – als _vorgerenderte_ Gradient-Ellipse statt `feGaussianBlur`.
5. Outline 2–3 px in dunkler Variante der Grundfarbe (nicht #000) – Temtem nutzt Outline gezielt zur Abhebung vom Hintergrund.
6. Glanzpunkte (Augen, Nase) als weiße Kreise.
   Gradients pro Element/Realm in einem gemeinsamen `<defs>`-Sprite wiederverwenden (IDs eindeutig, z. B. `hb-grad-ember-body`).

**Boden in 3D:** CSS `perspective: 600px` auf Bühne + `transform: rotateX(60deg)` auf einem Boden-Div (z. B. Gras-Pattern) ergibt echten perspektivischen Boden, kostet fast nichts. Plattformen aber besser als fertige SVG-Ellipsen (präziser).

**Performance-Regeln:**

- Nur `transform` und `opacity` animieren – die einzigen Properties, die ohne Layout/Paint auf dem Compositor laufen. ([web.dev](https://web.dev/articles/animations-and-performance))
- **Keine** animierten CSS-Filter, `blur`, Blend-Modes, `backdrop-filter` auf großen Flächen – „sehr teuer“ auf Mobile. ([GSAP-Forum](https://gsap.com/community/forums/topic/39185-gsap-animation-performance-refactor/))
- Animiere ganze `<g>`/`<svg>`-Wrapper (HTML-Element mit `transform`), nicht hunderte Pfade einzeln. Viele animierte SVG-Pfade sind auf Phones der klassische Ruckel-Fall. ([GSAP-Forum](https://gsap.com/community/forums/topic/30206-improve-performance-on-multiple-svg-paths/))
- `will-change: transform` nur auf die 2–6 aktiv animierten Elemente. ([CSS-Tricks](https://css-tricks.com/?p=197380))
- `prefers-reduced-motion` respektieren; Animationen pausieren, wenn `document.hidden` (Akku!). Idle-Simulation läuft ohnehin im Engine-Tick, nicht im Render.
- React: Kampf-Animationen **nicht** über State-Re-Renders pro Frame. Engine-Event → `element.animate()` (Web Animations API) per Ref. Re-Render nur bei HP-Änderung.

**Vergleich:**

| Option                             | Bundle (gz, ca.)                                                                                                                                       | Stärken                                                                                            | Schwächen                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **SVG + CSS + Web Animations API** | **0 KB**                                                                                                                                               | Vektor-scharf auf jedem DPR, React-nativ, DOM-zugänglich (a11y), Kreaturen bleiben editierbare SVG | Viele gleichzeitige Partikel/Filter ruckeln                                       |
| PixiJS v8 (WebGL)                  | ~245 KB voll, ~124 KB händisch getrimmt ([depscope](https://depscope.dev/pkg/npm/pixi.js), [WP PR](https://github.com/WordPress/openstation/pull/505)) | Viele Sprites/Partikel flüssig                                                                     | SVG muss gerastert werden, eigener Render-Loop (Akku), zweite UI-Welt neben React |
| Three.js                           | ~150 KB+ gz (Praxiswert)                                                                                                                               | Echtes 3D                                                                                          | Overkill, 3D-Modelle nötig, höchster Akku-/Aufwand                                |

**Empfehlung:** **Geschichtetes SVG + CSS-Transforms + Web Animations API**, keine neue Dependency. Für 1 vs 1 Kreatur + Bench + ~10 Partikel ist das mehr als genug und auf Mid-Range-Phones flüssig, solange die Regeln oben gelten. Partikel (Funken, Blasen, Blätter) als 6–12 kleine `<div>`/`<svg>` mit Transform-Animationen aus einem Pool. Erst wenn Messungen (Chrome DevTools, 4× CPU-Throttle) < 50 fps zeigen, punktuell einen `<canvas>`-Overlay nur für Partikel ergänzen – nicht PixiJS für alles.

---

## 5. Mobile-Game-UX & Menü-Architektur

**Hub-Muster der Referenzspiele:**

- _Pokémon GO:_ Welt/Map ist der Hub, Buttons bewusst in die **untere Bildschirmhälfte, weg von Ecken** gelegt (einhändig). Ein zentraler Pokéball-Button öffnet das Menü. ([GamesBeat](https://gamesbeat.com/?p=135805)) Kritik: Hierarchie/Auffindbarkeit leiden, wenn zu viel hinter einem Button steckt. ([Pratt IxD Critique](https://ixd.prattsi.org/2026/09/design-critique-pokemon-go/))
- _AFK Arena:_ Stadt „Ranhorn“ als zentraler Hub + feste Bottom-Bar (Kampagne, Helden, Stadt …) – wirkt anfangs überwältigend, ist aber logisch gruppiert. ([ludo.guide](https://www.ludo.guide/guide/afk-arena/understanding-the-user-interface-ui))
- _Cookie Run Kingdom / Genshin / MH Now:_ lebendige Szene als Hub (Kreaturen/Charaktere sichtbar), eine dominante Haupt-CTA (Kampagne/Abenteuer), Währungen oben, Sekundäres in Seiten-Icons.
- **Gemeinsamer Nenner:** Hub = emotionale „Bühne“ mit den eigenen Charakteren + 1 großer Aktions-Button + wenige Ziele.

**Nav-Anzahl:** Material 3: Navigation Bar **3–5 Ziele**; bei 5 inaktive Labels nur wenn Platz ([Compose M3 Docs](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-navigation-bar.html), [SAP Fiori M3](https://www.sap.com/design-system/fiori-design-android/v25-8/components/m3-standard-components/navigation-bar/usage)); 5 ist die praktische Obergrenze, Rest in Bottom-Sheet ([Smart Interface Design Patterns](https://smart-interface-design-patterns.com/articles/accessible-tap-target-sizes/)).
→ **Hollowbloom hat 6 Tabs – auf 4–5 reduzieren.** Vorschlag:
`Home (Hub) · Team · Summon · Upgrades · Mehr`. „Battle“ ist die Hub-CTA bzw. Hub-Szene selbst; „Rebloom“ (Prestige) kommt als großer Button im Hub/Upgrades erst nach Freischaltung; Expeditionen als Hub-Karte.

**Home-Hub-Layout (390×844):**

- Top (0–56 px + Safe-Area): Währungen (2–3 Chips), Avatar-Button links.
- Mitte (≈ 60 %): Szene mit aktiver Kreatur groß auf Plattform, 2 Bench-Kreaturen kleiner dahinter (dieselben SVGs, Idle-Breathing), Realm-Hintergrund (Hearth/Umbra-Toggle).
- Darunter: **eine große Primary-CTA** (≥ 56 px hoch, volle Breite − 32 px, z. B. „Weiterkämpfen · Zone 4“), darunter 2 kleine Karten (Expedition fertig in 12 min, Offline-Ertrag).
- Bottom-Nav 64 px + `env(safe-area-inset-bottom)`.

**Thumb Zone:** ~49 % halten das Phone einhändig, 36 % „cradled“, 15 % beidhändig (Hoober, UXmatters) – aber nicht als starre Karte verstehen. ([Smashing Magazine](https://smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users), [Addy Osmani](https://addyosmani.com/blog/touch-friendly-design/)) Regel: Häufige Aktionen untere 40 %, destruktive/seltene Aktionen oben.

**Touch Targets:** Apple 44×44 pt, Material 48×48 dp mit ≥ 8 dp Abstand; sichtbares Icon darf kleiner sein, Hit-Area nicht. ([Smashing: Accessible Target Sizes](https://smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/)) → CSS: `min-height: 48px; min-width: 48px`.

**Safe Areas:** `<meta name="viewport" content="..., viewport-fit=cover">`, `padding-bottom: calc(8px + env(safe-area-inset-bottom))`, Top analog; `100dvh` statt `100vh`.

**Progressive Disclosure / Unlocks:** Idle-Games haben wenig Mechanik – Nebensysteme **nicht sofort freischalten**, Tutorials nicht alles auf einmal (AdVenture-Capitalist-Entwickler). ([Global Games Forum](https://www.globalgamesforum.com/ctv/idle-game-design-lessons-from-developing-adventure-capitalist)) In der ersten Session zeigen, _wie viel_ es noch gibt, mit klarem Pfad ([Unity FTUE Tips](https://unity.com/how-to/10-first-time-user-experience-tips-games)); pro Unlock ein fokussiertes Mini-Tutorial ([Supersonic](https://supersonic.com/learn/blog/optimizing-ftue/)).
Hollowbloom-Pacing (Vorschlag): Min 0 Kampf + 1 Kreatur → Min 2 Upgrades → Zone 2 Summon → Zone 3 Team-Slots/Expeditionen → erster Boss Rebloom-Teaser (gesperrt, „ab Zone X“) → Avatar-Garderobe. Gesperrte Tabs als Schloss-Icon mit Bedingung, nicht verstecken.

**Onboarding Idle:** In < 30 s erster Kampf ohne Text-Wall; 1 Aktion pro Hinweis; Offline-Ertrag beim Zurückkehren als Belohnungs-Moment („Willkommen zurück – 2 h 13 min, +4.210 Gold“) mit „Einsammeln“-CTA.

**Badges / Red Dots – Ethik:** Studien zeigen Dark Patterns sind selbst in „harmlosen“ Mobile-Games weit verbreitet; „Fake Notification“ ist eine eigene Kategorie. ([Niknejad et al. 2024, arXiv](https://arxiv.org/abs/2412.05039), [Sameen & Rashid 2024](https://ieee-security.org/TC/SPW2024/ConPro/papers/sameen-conpro24.pdf), [Veiga et al. 2025](https://scitepress.org/PublishedPapers/2025/133658))
Regeln: Badge **nur** wenn eine konkrete, sofort ausführbare Aktion mit Nutzen wartet (Upgrade bezahlbar, Expedition fertig); verschwindet nach Besuch/Erledigung; max. 1 Badge-Typ (Punkt), Zahlen nur bei echten Mengen; keine Badges für Shop/Werbung; keine FOMO-Timer; Push-Benachrichtigungen opt-in.

---

## 6. Moderner visueller Stil

**Zwei Moods in einer UI – Token-System:** Gleiche Komponenten, Realm wechselt Tokens via `data-realm="hearth|umbra"` auf `<html>`.

| Token                | Hearth (warm, hell)         | Umbra (dunkel, kühl)                      |
| -------------------- | --------------------------- | ----------------------------------------- |
| `--bg`               | #FFF6E9 (Creme)             | #14121F (Tinte-Violett)                   |
| `--surface`          | #FFFFFF / #FCEBD3           | #221E33                                   |
| `--text`             | #3B2A20 (Kakao)             | #ECE6FF                                   |
| `--primary`          | #FF8A4C (Apricot)           | #9B7BFF (Geisterviolett)                  |
| `--accent`           | #7CC47F (Moos)              | #4DE2C4 (Spektral-Mint)                   |
| Ember / Tide / Grove | #FF6B3D / #3BA7E8 / #5DBB63 | #FF5E7E / #4C8DFF / #7BD88F (leuchtender) |

Faustregeln: Hearth = Pastell-Flächen + gesättigte Akzente, warme Schatten (`rgba(120,60,20,.15)`); Umbra = niedrige Helligkeit, **Glow** statt Schatten, ein Neon-Akzent. Elementfarben in beiden Realms in Farbton gleich halten (Wiedererkennung), nur Helligkeit/Sättigung anpassen. Kontrast WCAG AA (4,5:1 Text) in beiden Themes prüfen. Elemente nie nur über Farbe kodieren → immer Icon (Flamme/Tropfen/Blatt).

**Typografie (alle SIL OFL 1.1, via Fontsource npm selbst hosten):**

- Display/Zahlen: **Fredoka** oder **Baloo 2** (rund, freundlich, starke Ziffern) – `@fontsource-variable/baloo-2` ist OFL. ([Fontsource Baloo 2](https://www.jsdelivr.com/package/npm/@fontsource-variable/baloo-2))
- Body/UI: **Nunito** (rundes Sans, gut lesbar klein).
- Optional Umbra-Überschriften: eine Display-Schrift mit Charakter (z. B. _Cinzel Decorative_ oder _Grenze Gotisch_ – OFL vorher auf Google Fonts prüfen), sparsam.
- Max. 2 Familien geladen, nur benötigte Gewichte (z. B. 600/800), `font-display: swap`, Subset Latin. Lizenztext in Legal-Screen.
- Zahlen: `font-variant-numeric: tabular-nums` für Zähler (kein Zappeln).

**Karten:** Radius 16–20 px, 1 px innere Highlight-Kante oben, Schatten 2-stufig (nah + weich). Kreatur-Karten: Hintergrund im Elementverlauf, Rarität über Rahmen (common grau → mythic irisierender Gradient-Rand), Kreatur bricht aus dem Kartenrahmen (Kopf überlappt oben) = Tiefe.

**Glassmorphism vs. Flat:** Für Mobile-Performance „**soft-flat**“: solide Flächen mit Gradients und Schatten. Glas (`backdrop-filter`) höchstens für 1–2 kleine, statische Overlays (z. B. Info-Box über Battle-Szene) und nie animiert – Filter sind teuer.

**Icons:** UI-Chrome: **Lucide** (ISC) oder **Phosphor** (MIT, 6 Gewichte, „Fill“ passt zu Game-Look). Spielthemen: **game-icons.net** (CC BY 3.0, Credit). ([game-icons about](https://game-icons.net/about.html), [Lucide vs Tabler vs Phosphor](https://dev.to/svgicons/lucide-vs-tabler-vs-phosphor-which-free-icon-set-fits-your-ui-4ocl)) Element-Icons selbst zeichnen (3 Stück, Brand-relevant). Nav-Icons: aktiv = Fill + Label + Pill-Hintergrund, inaktiv = Outline.

**Micro-Interactions & Juice:**

- Button-Press: `scale(0.96)` 80 ms, Release Overshoot 1.02 → 1 (150 ms).
- Währung einsammeln: 5–8 Münz-Partikel fliegen zum Zähler, Zähler „tickt“ hoch (400 ms) und pulst.
- Summon: Antizipation (Ei wackelt 3×, Licht durch Risse) → Flash → Rarity-Farbe → Kreatur „Hop“ + Name. Höhere Rarität = länger/mehr Partikel (aber Skip-Button).
- Level-Up: Ring-Burst + kurzer Text.
- Haptik: `navigator.vibrate(10–20)` bei Crit/Summon (Android; iOS-Safari ignoriert, optional abschaltbar).
- Easing: `cubic-bezier(.34,1.56,.64,1)` (back-out) für Pops, `ease-out` für Bewegungen; nie `linear` außer Loops.
- Over-Juicing vermeiden: Shake/Hit-Stop nur für bedeutende Events, Option „Effekte reduzieren“. ([appscale.blog](https://appscale.blog/en/blog/game-feel-juice-hitstop-screenshake-easing-2026))

---

## 7. Spieler-Avatar (Paper-Doll)

**Slots & Z-Order (feste Tabelle, ein Konstanten-Objekt wie in react-color-avatar):** ([DeepWiki react-color-avatar](https://deepwiki.com/luckfunc/react-color-avatar/3.3-asset-management))

| z   | Slot                                            | Hinweis                                       |
| --- | ----------------------------------------------- | --------------------------------------------- |
| 0   | `back` (Umhang, Flügel, Rucksack)               |                                               |
| 10  | `hairBack`                                      | hinterer Haarteil                             |
| 20  | `body` (Hautfarbe)                              |                                               |
| 30  | `bottom` (Hose/Rock)                            |                                               |
| 40  | `shoes`                                         |                                               |
| 50  | `top` (Shirt/Jacke)                             | über Hose                                     |
| 60  | `head` + Gesicht (Augen, Mund, Brauen getrennt) |                                               |
| 70  | `hairFront`                                     |                                               |
| 80  | `hat`                                           | kann `hairFront`-Variante „hatHair“ erzwingen |
| 90  | `accessory` (Brille, Schal, Pet-Charm)          |                                               |
| 100 | `handItem`                                      |                                               |

- **Haar-Problem lösen:** Jede Frisur besteht aus `hairBack` + `hairFront` – bekannter Schmerzpunkt bei Paper-Dolls ([RahiTuber-Diskussion](https://itch.io/post/15542171/view-in-topic)). Hüte definieren `hidesHair: 'none'|'top'|'all'`.
- **Technik:** Ein `<svg viewBox="0 0 200 300">` mit gleicher Pose/Anker für alle Teile; jedes Item = React-Komponente oder `<symbol>` mit `<use>`. Farben über CSS-Variablen (`fill: var(--hair-1)`), damit eine Frisur × N Farben ohne neue Assets. Items als Daten: `{ id, slot, svg, palette: ['primary','shade'], unlock: {...}, realm?: 'umbra' }`.
- Stil: Chibi-Proportionen (Kopf ≈ 1/2,5 der Körperhöhe) passend zu Kreaturen; gleiche Outline-Stärke und Lichtrichtung wie Kreaturen.
- **Darstellung:** Hub oben links als 40 px Portrait, im Kampf optional als kleiner „Trainer“ hinter der Spieler-Plattform (Rückansicht → eigener Satz Back-Teile verdoppelt den Aufwand; daher MVP: Avatar nur im Hub/Profil, Front-View).
- **Unlock-Pacing (Vorschlag):** Start 3 Frisuren, 6 Haarfarben, 2 Outfits. Danach ~1 Item je Meilenstein (Zone-Boss, Kreatur-Sammlung 5/10, Rebloom 1/3/5), Realm-Sets (Hearth-Strickpulli, Umbra-Kapuzenmantel) als Set-Bonus-Ziel, saisonale Items optional. Alles erspielbar (keine Kosten, kein Shop) – passt zu „0 Betriebskosten“. Gesperrte Items als Silhouette mit Bedingung zeigen (Ziel sichtbar machen).
- Persistenz: nur IDs im Save (`avatar: { hair:'bob', hairColor:2, top:'knit', ... }`), Schema-Migration via vorhandenem `migrations.ts`.

---

## 8. Priorisierter Umsetzungsplan (Impact ÷ Aufwand)

1. **Design-Tokens + Realm-Theming** (`data-realm`, CSS-Variablen für Farben/Radien/Schatten, 2 OFL-Fonts via Fontsource). _Aufwand S, Impact sehr hoch_ – alles danach baut darauf auf.
2. **Battle-Bühne neu komponieren:** Gegner oben rechts (Scale 0,7, Front), Spieler unten links (Back-View), SVG-Plattform-Ellipsen, Kontaktschatten, 3-Layer-Hintergrund pro Realm mit atmosphärischem Overlay. _M, sehr hoch._
3. **Info-Boxen im Klassik-Muster** (Gegner oben links, Spieler unten rechts) mit Ghost-HP-Bar und Farbwechsel. _S, hoch._
4. **Kreatur-Rework nach Shape-Language-Tabelle:** 10 SVGs in Teile (`<g>`) zerlegen, gemeinsame `<defs>`-Gradients, Rim-Light/AO/Outline, Silhouetten- und 48 px-Test; danach **Back-Views** (vereinfachte 3/4-Rückansicht, ~60 % Aufwand der Front). _L, sehr hoch – Kern der Identität._
5. **Battle-Juice via Web Animations API:** Idle-Breathing (versetzte Phasen), Lunge, Hit-Flash-Overlay, Hit-Stop, Knockback, Schadenszahlen mit Kontur, Crit-Shake + Reduced-Motion-Schalter. _M, hoch._
6. **Navigation auf 5 Tabs** (Home · Team · Summon · Upgrades · Mehr), Rebloom/Expeditionen in Hub integrieren, 48 px Targets, Safe-Area-Padding, `100dvh`. _S, hoch._
7. **Home-Hub-Screen:** Kreaturen-Szene + eine große CTA „Weiterkämpfen“ + 2 Status-Karten + Willkommen-zurück-Dialog für Offline-Ertrag. _M, hoch._
8. **Bench-Leiste** (runde Portraits mit HP-Ring) + Wechsel-Animation bei Faint. _S–M, mittel-hoch._
9. **Progressive Unlocks + ethische Badges** (Schloss-Icons mit Bedingung, Badge nur bei ausführbarer Aktion, Mini-Tutorial je Unlock). _M, mittel-hoch (Retention)._
10. **Summon-Inszenierung + Micro-Interactions** (Ei-Antizipation, Rarity-Burst, Münzflug zum Zähler, Button-Press-Feedback); danach **Avatar-Paper-Doll-MVP** (Slots-Tabelle, 3 Frisuren, Farbvariablen, Meilenstein-Unlocks). _M + L, mittel._

**Leitplanken für alle Schritte:** keine neuen Runtime-Dependencies (React + SVG + WAAPI reicht), nur `transform`/`opacity` animieren, Assets nur selbst gezeichnet oder CC0/CC-BY mit Credit (nie BY-SA/GPL), jede Kreatur besteht Silhouetten-, Graustufen- und 48 px-Test, regelmäßig auf echtem Mid-Range-Android mit 4× CPU-Throttle messen.
