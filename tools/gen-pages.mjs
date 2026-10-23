// Generates the four accommodation detail pages from one template.
import { writeFileSync } from 'fs';
const OUT = process.argv[2];

const ICONS = {
  kitchen: '<path d="M4 11h16v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zM2 11h20M9 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',
  stove: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="2.5"/><circle cx="15.5" cy="9" r="2.5"/><circle cx="8.5" cy="16" r="2"/><circle cx="15.5" cy="16" r="2"/>',
  fridge: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 9h12M9 5v2M9 12v4"/>',
  shower: '<path d="M5 21V9a5 5 0 0 1 10 0v1M11 10h8M13 13v1M16 13v1M19 13v1M14 16v1M17 16v1"/>',
  dryer: '<path d="M3 8a5 5 0 0 1 5-5h7l4 2v6l-4 2H8a5 5 0 0 1-5-5zM9 13l-2 8h4l2-8"/><circle cx="8" cy="8" r="2"/>',
  ac: '<path d="M12 2v20M4.9 6l14.2 12M4.9 18L19.1 6M9 3l3 3 3-3M9 21l3-3 3 3"/>',
  heat: '<path d="M6 20c0-3 3-3 3-6s-3-3-3-6M12 20c0-3 3-3 3-6s-3-3-3-6M18 20c0-3 3-3 3-6s-3-3-3-6"/>',
  rack: '<path d="M4 20L9 5M20 20L15 5M6 14h12M7 10h10"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  bed: '<path d="M3 18V7M3 14h18v4M21 18v-5a3 3 0 0 0-3-3h-7v4"/><circle cx="7" cy="11" r="2"/>',
  bunk: '<path d="M5 3v18M19 3v18M5 9h14M5 16h14M8 6h8M8 13h8"/>',
  veranda: '<path d="M2 9l10-5 10 5M4 9v11M20 9v11M4 14h16M2 20h20"/>',
  umbrella: '<path d="M12 3C7 3 3 7 3 11h18c0-4-4-8-9-8zM12 11v10M8 21h8"/>',
  parking: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/>',
  pool: '<path d="M8 4v12M16 4v12M8 8h8M8 12h8M2 19c2 0 2 1.5 4 1.5S8 19 10 19s2 1.5 4 1.5S16 19 18 19s2 1.5 4 1.5"/>',
  dish: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 5.5h2"/><circle cx="12" cy="14.5" r="3"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  camper: '<path d="M3 17V8a2 2 0 0 1 2-2h10l4 5v6M3 17h16M7 10h4"/><circle cx="7" cy="19" r="2"/><circle cx="16" cy="19" r="2"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.3 6L12 16.3 6.6 19.4l1.3-6L3.4 9.3l6-.7z"/>',
  paw: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="9" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 2-2 1-4 0-4-2z"/>',
  floors: '<path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8"/>',
  clean: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5.5 15l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6L3.3 17.2l1.6-.6z"/>',
  linen: '<path d="M4 7h16v4H4zM4 11h16v6H4zM7 7V5h10v2M4 14h16"/>',
  sofa: '<path d="M4 11V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2"/>',
};
const ic = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;

const SEASONS = {
  bung: ["dal 17 aprile al 22 maggio<br>dall'11 al 25 settembre", "dal 22 maggio al 19 giugno<br>dal 28 agosto all'11 settembre", "dal 19 giugno al 24 luglio<br>dal 21 al 28 agosto", "dal 24 luglio al 21 agosto"],
  home: ["dal 18 aprile al 23 maggio<br>dal 12 al 26 settembre", "dal 23 maggio al 20 giugno<br>dal 29 agosto al 12 settembre", "dal 20 giugno al 25 luglio<br>dal 22 al 29 agosto", "dal 25 luglio al 22 agosto"],
  glam: ["dal 18 aprile al 23 maggio<br>dal 12 al 26 settembre", "dal 23 maggio al 13 giugno<br>dal 29 agosto al 12 settembre", "dal 13 giugno al 1° agosto<br>dal 22 al 29 agosto", "dal 1° al 22 agosto"],
  day: ["dal 15 aprile al 20 maggio<br>dal 14 al 26 settembre", "dal 21 maggio al 17 giugno<br>dal 1° al 13 settembre", "dal 18 giugno al 22 luglio<br>dal 25 al 31 agosto", "dal 23 luglio al 24 agosto"],
};
const SN = ['Bassissima', 'Bassa', 'Media', 'Alta'];
const table = (first, seasons, rows) => `<table class="ptable">
        <thead><tr><th scope="col">${first}</th>${SEASONS[seasons].map((d, i) => `
          <th scope="col"><i class="sw${i + 1}"></i>${SN[i]}<small>${d}</small></th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `
          <tr><th scope="row">${r[0]}${r[1] ? `<small>${r[1]}</small>` : ''}</th>${r[2].map((p, i) => `<td data-s="${SN[i]}">${p}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>`;

const INCL_UNIT = ['Ombrellone e 2 lettini allo stabilimento balneare', 'Pulizia iniziale e finale', 'Biancheria da letto, con cambio settimanale su richiesta', 'Acqua, luce e gas', 'Parcheggio di 1 auto', 'Wi-fi', 'Mini Club nel periodo previsto', "Accesso all'area relax"];
const KNOW_UNIT = (day) => ['Check-in dalle 16 alle 20, check-out entro le 10', `La settimana va ${day}`, "Pulizia dell'angolo cottura € 50 all'arrivo", 'Asciugamani (2 pezzi) € 5 su richiesta', "Documenti di tutti gli ospiti e saldo all'arrivo", 'Braccialetti di riconoscimento obbligatori', 'Gli animali non sono ammessi', 'Su richiesta, periodi brevi dal 15 aprile al 13 giugno e da settembre'];

const UNITS = {
  piazzole: { href: 'piazzole.html', title: 'Piazzole', img: 'assets/foto/piazzole-pineta.jpg', alt: 'Piazzole per camper sotto i pini curvi della pineta', meta: 'Camper · Roulotte · Tende', price: ['€ 9', 'a notte'] },
  bungalow: { href: 'bungalow.html', title: 'Bungalow', img: 'assets/foto/bung-cover-card.jpg', alt: 'Bungalow in legno circondato da siepi e pini', meta: 'Da 20 a 48 mq · fino a 6 posti', price: ['€ 350', 'a settimana'] },
  glamping: { href: 'glamping.html', title: 'Glamping', img: 'assets/foto/glam-fiori.jpg', alt: 'Glamping a forma di A in legno e tela chiara tra i pini', meta: 'Luxury Lodge 45 mq · 4 posti', price: ['€ 450', 'a settimana'] },
  home: { href: 'home.html', title: 'Home', img: 'assets/foto/home-2.jpg', alt: 'La Home con la veranda coperta, nella luce della sera', meta: 'Premium Comfort 34 mq · 4 posti', price: ['€ 600', 'a settimana'] },
};
const card = (u, i) => `<a class="unit rv" style="--i:${i}" href="${u.href}">
        <div class="ph"><img src="${u.img}" alt="${u.alt}" loading="lazy"></div>
        <span class="go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        <div class="body"><h3>${u.title}</h3><span class="meta">${u.meta}</span>
          <div class="price"><small>da</small><b>${u.price[0]}</b><small>${u.price[1]}</small></div></div>
      </a>`;

const PAGES = [
  {
    file: 'piazzole.html', reels: [['reel-piazzole', 'Le piazzole'], ['reel-piazzole-verde', 'Tra i pini']], key: 'piazzole', pick: 'Piazzola camper',
    title: 'Piazzole e area camper stop nella pineta · Camping Pionier Etrusco',
    desc: 'Piazzole ombreggiate per camper, roulotte e tende nella pineta di Montalto Marina, a 100 metri dal mare. Area camper stop pet friendly. Tariffe 2027.',
    heroImg: 'assets/foto/piaz-11.jpg', heroPos: '50% 45%',
    h1: 'Piazzole',
    lede: "Piazzole nel cuore della pineta, all'ombra dei pini, per camper, roulotte, tende e tendauto. E un'area camper stop per le soste brevi, dove anche il tuo cane è il benvenuto.",
    facts: ['Camper · Roulotte · Tende', "All'ombra dei pini", '100 metri dal mare', ['da € 9 a notte', '#prezzi']], calc: 'piaz',
    introH: "All'ombra, a 100 metri dal <em>mare</em>.",
    mapLink: 'Guarda la mappa del camping, con tutte le piazzole numerate.',
    intro: ["Le nostre piazzole sono nel cuore della pineta. L'ombra dei pini ripara dal caldo d'estate e ti lascia uno spazio verde dove stare a contatto con la natura.", 'Ci sono zone dedicate a camper, tende e roulotte. Dicci come viaggi e ti suggeriamo noi la zona giusta.'],
    gearH: 'Incluso nel prezzo',
    gear: [['bolt', 'Corrente 3 A'], ['shower', 'Docce calde'], ['parking', 'Parcheggio di 1 auto'], ['wifi', 'Wi-fi gratuito'], ['camper', 'Camper service'], ['star', 'Animazione'], ['pool', 'Area relax e piscina']],
    extra: `
<section class="detail" id="camper-stop" aria-labelledby="cs-t">
  <div class="wrap" data-reveal>
    <div class="cani-band with-photo rv">
      <img src="assets/foto/cani-spiaggia.jpg" alt="Un cagnolino seduto sulla sabbia della spiaggia, nella luce del tramonto" loading="lazy" width="1169" height="1400">
      <div class="cani-copy">
        <svg viewBox="0 0 24 24" aria-hidden="true">${ICONS.paw}</svg>
        <h2 class="h2" id="cs-t">Area camper stop</h2>
        <p>Un'area pensata per le soste brevi, con tutti i comfort del campeggio. Nella tariffa sono inclusi corrente, docce calde, servizi, carico e scarico al camper service interno.</p>
        <p><b>Siamo pet friendly.</b> Nell'area camper stop sono ben accetti cani di piccola e media taglia, sempre al guinzaglio. Possono venire con te al ristorante, in pizzeria e al bar. Restano esclusi la piscina, il parco giochi e l'area camping.</p>
        <p class="call-info"><a class="tlink" href="tel:+390766802807">Richiedi info</a><span>Le tariffe del camper stop si ricevono per telefono: <a href="tel:+390766802807">0766 802807</a></span></p>
      </div>
    </div>
  </div>
</section>`,
    types: null,
    photosH: 'Le piazzole, sotto i <em>pini</em>.',
    gallery: [['piaz-9.jpg', 'Un viale del campeggio con le roulotte e i teli ombreggianti'], ['piazzole-pineta.jpg', 'Piazzole per camper sotto i pini curvi'], ['piaz-tenda.jpg', 'Una tenda su una piazzola tra i pini, accanto a un bungalow'], ['piaz-tetto.jpg', 'Un\'auto con la tenda sul tetto sotto un telo ombreggiante'], ['piazzola-camper.jpg', 'Camper con veranda e tenda su una piazzola ombreggiata'], ['piaz-1.jpg', 'Piazzole tra i pini e le piante mediterranee'], ['bagni-1.jpg', 'Il blocco bagni e docce tra i pini'], ['bagni-docce.jpg', 'Le cabine doccia sotto la tettoia'], ['bagni-fiori.jpg', 'Fiori davanti ai servizi']],
    pricesH: 'Piazzole, al <em>giorno</em>',
    prices: table('Voce', 'day', [['Piazzola', 'roulotte, camper, tendauto o tenda', ['€ 9', '€ 11', '€ 14', '€ 20']], ['Persona', '', ['€ 10', '€ 11', '€ 14', '€ 16']], ['Bambini', 'da 3 a 8 anni non compiuti', ['gratis', '€ 4', '€ 6', '€ 8']], ['Seconda auto', '', ['€ 4', '€ 5', '€ 5', '€ 6']], ['Ospite', 'a persona, al giorno', ['€ 10', '€ 12', '€ 15', '€ 16']]]),
    incl: ['Corrente 3 A', 'Parcheggio di 1 auto', 'Docce calde', 'Animazione nel periodo previsto', 'Wi-fi', 'Camper service', "Accesso all'area relax"],
    know: ['In alta stagione il minimo è di 7 notti', 'Partenza entro le 12', 'Per ogni piazzola si conteggia un minimo di 2 persone', "All'arrivo servono i documenti di tutto l'equipaggio", 'Braccialetti di riconoscimento obbligatori', 'Una sola attrezzatura per il pernottamento per piazzola', "Nell'area camping i cani non sono ammessi", 'Abbonamenti mensili e stagionali: vedi le tariffe'],
    ctaH: 'Ti teniamo la piazzola <em>giusta</em>.',
  },
  {
    file: 'bungalow.html', reels: [['reel-pineta', 'Bungalow e glamping nella pineta']], key: 'bungalow', pick: 'Bungalow trilocale 28 mq',
    title: 'Bungalow in legno nella pineta · Camping Pionier Etrusco',
    desc: 'Bungalow in legno nella pineta di Montalto Marina: monolocale 20 mq, trilocale 28 mq e trilocale superior 48 mq, fino a 6 persone. Planimetrie e tariffe 2027.',
    heroImg: 'assets/foto/bung-cover.jpg', heroPos: '50% 50%',
    h1: 'Bungalow',
    lede: 'Bungalow in legno immersi nella pineta secolare, fino a 6 persone, con tutti i comfort: cucina, bagno con doccia, veranda e aria condizionata.',
    facts: [['Da 20 a 48 mq', '#tipologie'], ['Fino a 6 posti', '#tipologie'], ['Da sabato a sabato', '#prezzi'], ['da € 350 a settimana', '#prezzi']], calc: 'mono,tri,sup5,sup6',
    typesLabel: 'Quale scegliere', typesH: 'Tre misure, da 2 a 6 <em>persone</em>.',
    introH: 'Camping sotto i pini, in un bungalow di <em>legno</em>.',
    intro: ['Ogni bungalow ha la sua veranda, dove fare colazione all\'ombra e cenare al fresco.', 'È composto da: camera matrimoniale, cucina attrezzata, bagno con doccia e aria condizionata per le giornate più calde. I trilocali hanno anche una seconda camera: con letto a castello nel Trilocale 28 mq, con letti singoli nel Superior 48 mq.'],
    gearH: 'Dotazioni e servizi',
    gear: [['bed', 'Camera matrimoniale'], ['bunk', 'Letto a castello (Trilocale 28 mq)'], ['bed', 'Letti singoli (Superior 48 mq)'], ['kitchen', 'Cucina attrezzata'], ['fridge', 'Frigorifero con freezer'], ['shower', 'Bagno con doccia'], ['dryer', 'Asciugacapelli'], ['ac', 'Aria condizionata'], ['heat', 'Riscaldamento'], ['tv', 'TV'], ['rack', 'Stendibiancheria'], ['veranda', 'Veranda attrezzata'], ['umbrella', 'Ombrellone e 2 lettini in spiaggia'], ['clean', 'Pulizia iniziale e finale'], ['linen', 'Biancheria da letto'], ['parking', 'Parcheggio di 1 auto'], ['wifi', 'Wi-fi']],
    types: [
      { id: 'monolocale', cover: 'mono-veranda.jpg', photos: [['mono-passerella.jpg', 'Monolocale: il vialetto nel verde che porta ai bungalow piccoli'], ['mono-camera.jpg', 'Monolocale: la camera matrimoniale'], ['mono-cucina.jpg', 'Monolocale: angolo cottura e tavolo'], ['mono-veranda.jpg', 'Monolocale: la veranda con i fiori'], ['mono-bagno.jpg', 'Monolocale: il bagno'], ['mono-doccia.jpg', 'Monolocale: lavabo e cabina doccia']], h: 'Monolocale 20 mq', cap: 'Fino a 2 persone + lettino da campeggio su prenotazione', p: 'Un\'ampia camera matrimoniale con guardaroba, tavolo, aria condizionata e TV. Bagno con cabina doccia e asciugacapelli, angolo cottura con piano a gas e veranda.', plans: [['monolocale.jpg', 'Planimetria (due monolocali affiancati)']], from: ['€ 350', 'a settimana, in bassissima stagione'], pick: 'Bungalow monolocale 20 mq', calc: 'mono' },
      { id: 'trilocale', cover: 'tri-esterno.jpg', photos: [['tri-esterno.jpg', 'Trilocale 28 mq: il bungalow tra le siepi'], ['tri-ingresso.jpg', 'Trilocale 28 mq: l\'ingresso con i gradini'], ['tri-104.jpg', 'Trilocale 28 mq: il bungalow con la tenda da sole'], ['tri-cucina.jpg', 'Trilocale 28 mq: la cucina'], ['tri-camera.jpg', 'Trilocale 28 mq: la camera matrimoniale'], ['tri-castello.jpg', 'Trilocale 28 mq: la camera con letto a castello'], ['tri-bagno.jpg', 'Trilocale 28 mq: il bagno con doccia'], ['tri-veranda.jpg', 'Trilocale 28 mq: la veranda'], ['tri-veranda-2.jpg', 'Trilocale 28 mq: la veranda da un\'altra prospettiva']], h: 'Trilocale 28 mq', cap: 'Fino a 3 o 4 persone', p: 'Camera matrimoniale, camera con letto a castello, soggiorno con TV, bagno con cabina doccia, angolo cottura con piano a gas e veranda.', plans: [['trilocale-a.jpg', 'Planimetria tipo A'], ['trilocale-b.jpg', 'Planimetria tipo B']], from: ['€ 450', 'a settimana, in bassissima stagione'], pick: 'Bungalow trilocale 28 mq', calc: 'tri' },
      { id: 'superior', cover: 'sup-esterno.jpg', photos: [['sup-pineta.jpg', 'Trilocale Superior: il bungalow sul prato, sotto i pini'], ['sup-esterno.jpg', 'Trilocale Superior: il bungalow con la veranda'], ['sup-soggiorno.jpg', 'Trilocale Superior: il soggiorno'], ['sup-soggiorno-2.jpg', 'Trilocale Superior: il soggiorno con il tavolo'], ['sup-cucina.jpg', 'Trilocale Superior: la cucina con piano a induzione'], ['sup-camera.jpg', 'Trilocale Superior: la camera matrimoniale'], ['sup-cameretta.jpg', 'Trilocale Superior: la seconda camera, con due letti'], ['sup-bagno.jpg', 'Trilocale Superior: il bagno'], ['sup-veranda.jpg', 'Trilocale Superior: la veranda']], h: 'Trilocale Superior 48 mq', cap: 'Fino a 6 persone', p: 'Un\'ampia camera matrimoniale con guardaroba, una camera con letti singoli e un soggiorno grande con divano letto da 2 posti, TV e tavolo. Bagno con cabina doccia e asciugacapelli, cucina con piano a induzione e veranda.', plans: [['trilocale-superior.jpg', 'Planimetria']], from: ['€ 500', 'a settimana per 4 posti, € 560 per 5 o 6 posti'], pick: 'Bungalow trilocale superior 48 mq', calc: 'sup5' },
    ],
    photosH: 'I bungalow, dentro e <em>fuori</em>.',
    gallery: [['sup-pineta.jpg', 'Un bungalow sul prato, sotto i pini'], ['bung-pino.jpg', 'La veranda di un bungalow accanto al tronco di un pino'], ['tri-esterno.jpg', 'Un bungalow tra le siepi'], ['mono-veranda.jpg', 'La veranda con i fiori'], ['bung-matrimoniale.jpg', 'Camera matrimoniale con armadio'], ['bung-castello.jpg', 'Camera con letto a castello'], ['sup-soggiorno.jpg', 'Il soggiorno del Superior'], ['bung-cucina-bianca.jpg', 'Angolo cottura con piano a gas'], ['tri-veranda.jpg', 'Una veranda attrezzata']],
    pricesH: 'Bungalow, a <em>settimana</em>',
    prices: table('Tipologia', 'bung', [['Monolocale 20 mq', '2 posti', ['€ 350', '€ 500', '€ 750', '€ 900']], ['Trilocale 28 mq', '3 o 4 posti', ['€ 450', '€ 650', '€ 1.000', '€ 1.250']], ['Trilocale Superior 48 mq', '4 posti', ['€ 500', '€ 700', '€ 1.150', '€ 1.400']], ['Trilocale Superior 48 mq', '5 o 6 posti', ['€ 560', '€ 750', '€ 1.200', '€ 1.500']], ['Ospite', 'a persona, al giorno', ['€ 10', '€ 12', '€ 15', '€ 16']]]),
    incl: INCL_UNIT, know: KNOW_UNIT('da sabato a sabato'),
    ctaH: 'Ti piace? Chiedici se è <em>libero</em>.',
  },
  {
    file: 'glamping.html', reels: [['reel-glamping', 'Il glamping'], ['reel-glamping-verde', 'Il verde intorno']], key: 'glamping', pick: 'Glamping Luxury Lodge',
    title: 'Glamping Luxury Lodge nella pineta · Camping Pionier Etrusco',
    desc: 'Glamping Luxury Lodge 45 mq a forma di A, su due piani, per 4 persone, con bagno privato e cucina, nella pineta di Montalto Marina. Tariffe 2027.',
    heroImg: 'assets/foto/glam-cover.jpg', heroPos: '50% 56%',
    h1: 'Glamping',
    lede: 'La Glamping Luxury Lodge è una tenda a forma di A su due piani, con tutti i comfort: cucina, bagno privato e due camere. Il camping in tenda, ma comodo.',
    facts: [['Luxury Lodge 45 mq', '#tipologie'], '4 posti', 'Su due piani', ['Da domenica a domenica', '#prezzi'], ['da € 450 a settimana', '#prezzi']], calc: 'glam',
    photosH: 'Il glamping, dentro e <em>fuori</em>.',
    typesLabel: 'La sistemazione', typesH: 'Una tenda su <em>due piani</em>, per 4 persone.',
    introH: 'Dormire in <em>tenda</em>, con il bagno in camera.',
    intro: ['Un incontro tra glamour e camping: vicino alla natura, senza rinunciare ai comfort. Dentro trovi due camere da letto, il bagno privato con doccia, la cucina attrezzata e una grande area lounge che continua all\'aperto.', 'La sera, tra i pini, si accendono le lucine.'],
    gearH: 'Dotazioni e servizi',
    gear: [['floors', 'Su due piani'], ['bed', '2 camere da letto'], ['shower', 'Bagno privato con doccia'], ['kitchen', 'Cucina attrezzata'], ['stove', 'Piano cottura a induzione'], ['fridge', 'Frigorifero con freezer'], ['ac', 'Aria condizionata'], ['heat', 'Riscaldamento'], ['tv', 'TV'], ['dryer', 'Asciugacapelli'], ['veranda', 'Veranda attrezzata'], ['umbrella', 'Ombrellone e 2 lettini in spiaggia'], ['clean', 'Pulizia iniziale e finale'], ['linen', 'Biancheria da letto'], ['parking', 'Parcheggio di 1 auto'], ['wifi', 'Wi-fi']],
    types: [
      { id: 'lodge', calc: 'glam', cover: 'glam-fiori.jpg', photos: [['glam-cover.jpg', 'Il glamping tra i pini, in fondo al prato'], ['glam-fiori.jpg', 'Il glamping di giorno, con una bici e i fiori nel cestino'], ['glamping-interno-1.jpg', "L'interno, con la cucina e la scala per il piano di sopra"], ['glamping-interno-3.jpg', 'Il divano della zona lounge'], ['glam-notte.jpg', 'Il glamping di sera, con le lucine accese tra i pini']], h: 'Glamping Luxury Lodge 45 mq', cap: 'Fino a 4 persone', p: 'Alloggio in tenda su due piani, con due camere, bagno privato, cucina e un\'ampia area lounge che si estende all\'esterno.', plans: [['glamping.jpg', 'Planimetria e sezione']], from: ['€ 450', 'a settimana, in bassissima stagione'], pick: 'Glamping Luxury Lodge' },
    ],
    gallery: [['glam-fiori.jpg', 'Il glamping di giorno, con una bici e i fiori nel cestino'], ['glamping-interno-1.jpg', "L'interno, con la cucina e la scala per il piano di sopra"], ['glamping-interno-3.jpg', 'Il divano della zona lounge'], ['glam-notte.jpg', 'Il glamping di sera, con le lucine accese tra i pini']],
    pricesH: 'Glamping, a <em>settimana</em>',
    prices: table('Tipologia', 'glam', [['Glamping Luxury Lodge 45 mq', '4 posti', ['€ 450', '€ 650', '€ 1.000', '€ 1.250']], ['Ospite', 'a persona, al giorno', ['€ 10', '€ 12', '€ 15', '€ 16']]]),
    incl: INCL_UNIT, know: KNOW_UNIT('da domenica a domenica'),
    ctaH: 'Ti piace? Chiedici se è <em>libera</em>.',
  },
  {
    file: 'home.html', key: 'home', pick: 'Home Premium Comfort',
    title: 'Home Premium Comfort nella pineta · Camping Pionier Etrusco',
    desc: 'Home Premium Comfort 34 mq per 4 persone, con due camere, due bagni, lavastoviglie e veranda sulla pineta di Montalto Marina. Tariffe 2027.',
    heroImg: 'assets/foto/home-2.jpg', heroPos: '50% 55%',
    h1: 'Home',
    lede: 'Le nuovissime Home Premium Comfort: 34 mq con due camere, due bagni e una veranda arredata affacciata sulla pineta.',
    facts: [['Premium Comfort 34 mq', '#tipologie'], '4 posti', '2 bagni', ['Da domenica a domenica', '#prezzi'], ['da € 600 a settimana', '#prezzi']], calc: 'home',
    photosH: 'La Home, dentro e <em>fuori</em>.',
    typesLabel: 'La sistemazione', typesH: 'Due camere e <em>due bagni</em>, per 4 persone.',
    introH: 'Due camere, due bagni, tutto <em>nuovo</em>.',
    intro: ['Le Home sono la scelta giusta per chi cerca relax e comodità. La cucina ha lavastoviglie e piano a induzione, i bagni sono due, con cabina doccia e asciugacapelli, e uno ha anche il bidet.', 'Una camera matrimoniale, una con due letti singoli, il soggiorno con TV e una grande veranda arredata per godersi il fresco della pineta.'],
    gearH: 'Dotazioni e servizi',
    gear: [['bed', '2 camere da letto'], ['shower', '2 bagni con doccia'], ['kitchen', 'Cucina attrezzata'], ['dish', 'Lavastoviglie'], ['stove', 'Piano cottura a induzione'], ['fridge', 'Frigorifero con freezer'], ['ac', 'Aria condizionata'], ['heat', 'Riscaldamento'], ['tv', 'TV'], ['dryer', 'Asciugacapelli'], ['veranda', 'Veranda arredata'], ['umbrella', 'Ombrellone e 2 lettini in spiaggia'], ['clean', 'Pulizia iniziale e finale'], ['linen', 'Biancheria da letto'], ['parking', 'Parcheggio di 1 auto'], ['wifi', 'Wi-fi']],
    types: [
      { id: 'premium', calc: 'home', cover: 'home-3.jpg', photos: [['home-2.jpg', 'La Home con la veranda coperta, nella luce della sera'], ['home-3.jpg', 'La Home tra le siepi e gli alberi'], ['home-soggiorno.jpg', 'Il soggiorno con divano giallo e tavolo'], ['home-cucina.jpg', 'La cucina attrezzata'], ['home-matrimoniale.jpg', 'La camera matrimoniale'], ['home-letti-singoli.jpg', 'La camera con due letti singoli'], ['home-bagno.jpg', 'Uno dei due bagni'], ['home-veranda.jpg', 'La veranda arredata con tavolo in legno']], h: 'Home Premium Comfort 34 mq', cap: 'Fino a 4 persone', p: 'Cucina attrezzata con lavastoviglie e piano a induzione, 2 bagni, 1 camera matrimoniale e 1 con due letti singoli, soggiorno con TV e ampia veranda arredata.', plans: [['home.jpg', 'Planimetria con veranda']], from: ['€ 600', 'a settimana, in bassissima stagione'], pick: 'Home Premium Comfort' },
    ],
    gallery: [['home-3.jpg', 'La Home tra le siepi e gli alberi'], ['home-soggiorno.jpg', 'Il soggiorno con divano giallo e tavolo'], ['home-cucina.jpg', 'La cucina attrezzata'], ['home-matrimoniale.jpg', 'La camera matrimoniale'], ['home-letti-singoli.jpg', 'La camera con due letti singoli'], ['home-bagno.jpg', 'Uno dei due bagni'], ['home-veranda.jpg', 'La veranda arredata con tavolo in legno']],
    pricesH: 'Home, a <em>settimana</em>',
    prices: table('Tipologia', 'home', [['Home Premium Comfort 34 mq', '4 posti', ['€ 600', '€ 800', '€ 1.150', '€ 1.450']], ['Ospite', 'a persona, al giorno', ['€ 10', '€ 12', '€ 15', '€ 16']]]),
    incl: INCL_UNIT, know: KNOW_UNIT('da domenica a domenica'),
    ctaH: 'Ti piace? Chiedici se è <em>libera</em>.',
  },
];

const NAV = cur => `<header class="nav" id="nav">
  <a class="brand" href="index.html" aria-label="Camping Pionier Etrusco, pagina principale"><span class="mark" aria-hidden="true"></span><span class="name">Pionier Etrusco</span></a>
  <nav aria-label="Principale">
    <ul class="links">
      <li><a href="index.html#camping">Chi siamo</a></li>
      <li class="has-sub">
        <button class="sub-btn" type="button" aria-expanded="false" aria-controls="sub-sist">Sistemazioni <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <ul class="submenu" id="sub-sist">
          <li><a href="piazzole.html"${cur === 'piazzole' ? ' aria-current="page"' : ''}>Piazzole e camper stop<small>camper, roulotte, tende</small></a></li>
          <li><a href="bungalow.html"${cur === 'bungalow' ? ' aria-current="page"' : ''}>Bungalow<small>da 20 a 48 mq</small></a></li>
          <li><a href="glamping.html"${cur === 'glamping' ? ' aria-current="page"' : ''}>Glamping<small>Luxury Lodge 45 mq</small></a></li>
          <li><a href="home.html"${cur === 'home' ? ' aria-current="page"' : ''}>Home<small>Premium Comfort 34 mq</small></a></li>
        </ul>
      </li>
      <li><a href="index.html#servizi">Servizi</a></li>
      <li><a href="index.html#mare">Spiagge</a></li>
      <li><a href="index.html#tariffe">Tariffe</a></li>
      <li><a href="index.html#dintorni">Escursioni</a></li>
      <li><a href="index.html#richiesta">Contatti</a></li>
    </ul>
  </nav>
  <a class="btn btn-sm" href="index.html#richiesta">Prenota</a>
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
</header>
<div class="menu" id="menu">
  <ul>
    <li><a href="index.html">Home page</a></li>
    <li><a href="index.html#camping">Chi siamo</a></li>
    <li><a href="index.html#sistemazioni">Sistemazioni</a>
      <ul class="nested">
        <li><a href="piazzole.html">Piazzole e camper stop</a></li>
        <li><a href="bungalow.html">Bungalow</a></li>
        <li><a href="glamping.html">Glamping</a></li>
        <li><a href="home.html">Home</a></li>
      </ul>
    </li>
    <li><a href="index.html#servizi">Servizi</a></li>
    <li><a href="index.html#tariffe">Tariffe</a></li>
    <li><a href="index.html#richiesta">Contatti</a></li>
  </ul>
</div>`;

const FOOT = `<footer class="foot">
  <div class="wrap foot-grid">
    <div class="logo" role="img" aria-label="Camping Pionier Etrusco"></div>
    <address>
      <strong style="color:var(--canvas);font-family:var(--f-display);font-weight:700;font-size:20px">Camping Pionier Etrusco</strong><br>
      <a href="https://www.google.com/maps/search/?api=1&amp;query=Camping%20Pionier%20Etrusco%2C%20Via%20Vulsinia%202%2C%20Montalto%20Marina" target="_blank" rel="noopener">Via Vulsinia 2, 01014 Marina di Montalto di Castro (VT)</a><br>
      <a href="tel:+390766802807">0766 802807</a> · <a href="tel:+393293671083">329 3671083</a><br>
      <a href="mailto:info@pionieretrusco.com">info@pionieretrusco.com</a><br>
      Aperto dal 15 aprile al 26 settembre 2027
    </address>
    <div><h4>Sistemazioni</h4><ul><li><a href="piazzole.html">Piazzole e camper stop</a></li><li><a href="bungalow.html">Bungalow</a></li><li><a href="glamping.html">Glamping</a></li><li><a href="home.html">Home</a></li></ul></div>
    <div><h4>Info</h4><ul><li><a href="index.html#tariffe">Tariffe 2027</a></li><li><a href="assets/tariffe-2027.pdf" download>Listino 2027 in PDF</a></li><li><a href="index.html#servizi">Servizi</a></li><li><a href="index.html#richiesta">Contatti</a></li></ul></div>
    <div class="fine">
      <span>© Camping Pionier Etrusco · P. IVA 01513620565</span>
    </div>
  </div>
</footer>`;

const att = v => JSON.stringify(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const SVG = {
  cam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  plan: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18v16H3zM3 12h8M11 4v16M15 12h6M15 12v8"/></svg>',
  calc: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h0M14 11h2M8 15h2M14 15h2M8 18h2M14 18h2"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
};
const reelTile = r => `
      <figure class="reel g-reel m-reel" tabindex="0" role="button" aria-label="Video: ${r[1]}. Tocca per mettere in pausa o riprendere">
        <video muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true" data-src="assets/video/${r[0]}.mp4" data-poster="assets/video/${r[0]}.jpg"></video>
        <div class="reel-bar" aria-hidden="true"><i></i></div>
        <div class="who" aria-hidden="true"><span></span>Pionier Etrusco</div>
        <div class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg></div>
        <figcaption class="cap"><b>${r[1]}</b></figcaption>
      </figure>`;

for (const P of PAGES) {
  const ask = (pick) => `index.html?sist=${encodeURIComponent(pick)}#richiesta`;
  const single = P.types && P.types.length === 1 ? P.types[0] : null;
  const plansOf = t => t.plans.map(pl => [`assets/planimetrie/${pl[0]}`, `${pl[1]} del ${t.h}`]);

  // 1. the photos: one mosaic, the first picture large, videos in between
  const mosaic = (() => {
    const tiles = P.gallery.map(g => `
      <button type="button" class="m-ph" aria-label="Ingrandisci: ${g[1]}"><img src="assets/foto/${g[0]}" alt="${g[1]}" loading="lazy"></button>`);
    const slots = [2, 6];
    (P.reels || []).forEach((r, i) => tiles.splice(Math.min(slots[i] ?? tiles.length, tiles.length), 0, reelTile(r)));
    return tiles.join('');
  })();
  const photos = `
<section class="detail d-photos" id="foto" aria-labelledby="foto-t">
  <div class="wrap">
    <div data-reveal><p class="label rv" style="--i:0">Le foto</p><h2 class="h2 rv" id="foto-t" style="--i:1">${P.photosH}</h2></div>
    <div class="gallery mosaic">${mosaic}
    </div>
  </div>
</section>`;

  // 2. which one (only when there is a real choice)
  const choose = P.types ? `
<section class="detail d-choose" id="tipologie" aria-labelledby="tip-t">
  <div class="wrap">
    <div data-reveal><p class="label rv" style="--i:0">${P.typesLabel}</p><h2 class="h2 rv" id="tip-t" style="--i:1">${P.typesH}</h2></div>
    <div class="choose${single ? ' single' : ''}">${P.types.map(t => {
      const ph = t.photos.map(x => [`assets/foto/${x[0]}`, x[1]]);
      const start = Math.max(0, t.photos.findIndex(x => x[0] === t.cover));
      return `
      <article class="ch-card" id="${t.id}">
        <button type="button" class="ch-ph" data-photos="${att(ph)}" data-start="${start}" aria-label="Guarda le ${ph.length} foto del ${t.h}"><img src="assets/foto/${t.cover}" alt="" loading="lazy"><span class="b-count">${SVG.cam}${ph.length} foto</span></button>
        <div class="ch-body">
          <h3>${t.h}</h3>
          <p class="cap">${t.cap}</p>
          <p class="ch-desc">${t.p}</p>
          <p class="ch-price"><small>da</small><b>${t.from[0]}</b><span>${t.from[1]}</span></p>
          <div class="ch-links">
            <button type="button" class="ch-link" data-photos="${att(plansOf(t))}">${SVG.plan}Guarda la planimetria</button>
            <a class="ch-link" href="#calcola" data-calc-pick="${t.calc}">${SVG.calc}Calcola il prezzo</a>
          </div>
        </div>
      </article>`;
    }).join('')}
    </div>
  </div>
</section>` : '';

  // 3. what you find inside: the description, the equipment and what the price includes
  const inside = `
<section class="detail d-inside" id="dentro" aria-labelledby="intro-t">
  <div class="wrap two">
    <div data-reveal>
      <p class="label rv" style="--i:0">${P.types ? 'Cosa è incluso' : 'Cosa trovi'}</p>
      <h2 class="h2 rv" id="intro-t" style="--i:1">${P.introH}</h2>
      ${P.intro.map((t, i) => `<p class="lede rv" style="--i:${i + 2}">${t}</p>`).join('\n      ')}
      ${P.mapLink ? `<p class="lede rv"><a class="tlink" href="index.html?vista=piazzole#mappa">${P.mapLink}</a></p>` : ''}
    </div>
    <div data-reveal>
      <p class="label rv" style="--i:0">${P.gearH}</p>
      <ul class="gear">${P.gear.map((g, i) => `<li class="rv" style="--i:${Math.min(i, 8)}">${ic(g[0])}${g[1]}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;

  const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${P.title}</title>
<meta name="description" content="${P.desc}">
<meta name="theme-color" content="#17211D">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="apple-touch-icon" href="assets/favicon.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${P.title}">
<meta property="og:description" content="${P.desc}">
<!-- DEPLOY STEP: sostituire https://example.com con l'indirizzo reale del sito prima di pubblicare -->
<meta property="og:url" content="https://example.com/${P.file}">
<meta property="og:image" content="https://example.com/${P.heroImg}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Figtree:wght@400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
</head>
<body class="detail-page">
<a class="skip" href="#main">Vai al contenuto</a>
<div class="env" aria-hidden="true"></div>

${NAV(P.key)}

<main id="main" tabindex="-1">

<section class="page-hero" data-nav-over aria-labelledby="page-t">
  <img src="${P.heroImg}" alt="" style="object-position:${P.heroPos}">
  <nav class="unit-switch" aria-label="Sistemazioni">
    <div class="wrap">
      <a class="back" href="index.html#sistemazioni"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>Tutte le sistemazioni</a>
      <ul>${[['piazzole', 'Piazzole'], ['bungalow', 'Bungalow'], ['glamping', 'Glamping'], ['home', 'Home']].map(([k, t]) => `<li><a href="${k}.html"${k === P.key ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>
    </div>
  </nav>
  <div class="wrap">
    <h1 id="page-t">${P.h1}</h1>
    <p class="lede">${P.lede}</p>
    <div class="cta-row"><a class="btn" href="${ask(P.pick)}">Richiedi disponibilità</a><a class="btn ghost" href="#prezzi">Vedi i prezzi</a></div>
  </div>
</section>
${P.types ? choose + inside : photos + inside}

<section class="detail tariffe" id="prezzi" aria-labelledby="prezzi-t">
  <div class="wrap">
    <div data-reveal><p class="label rv" style="--i:0">Quanto costa</p><h2 class="h2 rv" id="prezzi-t" style="--i:1">${P.pricesH}.</h2><p class="lede rv" style="--i:2">Tariffe 2027, con tasse e IVA al 10% incluse.</p></div>
    <div class="calc-wrap" id="calcola">
      <h3 class="calc-title">Calcola il tuo prezzo</h3>
      <p class="calc-sub">${P.calc === 'piaz' ? 'Scegli le date e quanti siete: il totale compare subito.' : 'Scegli il giorno di arrivo e quello di partenza: il totale compare subito.'}</p>
      <div class="calc" data-types="${P.calc}"></div>
    </div>
    <h3 class="listino-h">Il listino completo</h3>
    <details class="listino d-list" data-open-wide>
      <summary><span class="t">Vedi il listino completo<small>Tutte le tariffe 2027, stagione per stagione</small></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
      <div class="listino-in">
    ${P.prices}
    <p style="margin-top:20px"><a class="tlink" href="assets/tariffe-2027.pdf" download>Scarica il listino 2027 in PDF</a></p>
      </div>
    </details>
  </div>
</section>

${P.types ? photos : ''}
<section class="detail d-know" aria-labelledby="know-t">
  <div class="wrap">
    <div data-reveal><p class="label rv" style="--i:0">Da sapere</p><h2 class="h2 rv" id="know-t" style="--i:1">Prima di <em>arrivare</em>.</h2></div>
    <ul class="know">${P.know.map(x => `<li>${SVG.info}${x}</li>`).join('')}</ul>
  </div>
</section>

<section class="cta-band" aria-labelledby="cta-t">
  <div class="wrap">
    <h2 class="h2" id="cta-t">${P.ctaH}</h2>
    <div class="actions"><a class="btn" href="${ask(P.pick)}">Richiedi disponibilità</a><a class="btn line" href="tel:+390766802807">Chiama lo 0766 802807</a></div>
  </div>
</section>

${P.extra || ''}
<section class="others" aria-labelledby="oth-t">
  <div class="wrap">
    <div data-reveal><p class="label rv" style="--i:0">Altre sistemazioni</p><h2 class="h2 rv" id="oth-t" style="--i:1">Oppure guarda <em>anche</em>...</h2></div>
    <div class="units" data-reveal>
      ${Object.entries(UNITS).filter(([k]) => k !== P.key).map(([, u], i) => card(u, i)).join('\n      ')}
    </div>
  </div>
</section>

</main>

${FOOT}

<div class="actbar" role="navigation" aria-label="Azioni rapide" data-hide=".page-hero, .cta-band, .foot, #calcola">
  <a class="btn line" href="#prezzi">Prezzi</a>
  <a class="btn" href="${ask(P.pick)}">Richiedi disponibilità</a>
</div>

<dialog class="lightbox" id="lightbox" aria-label="Foto ingrandita">
  <button class="close" type="button">Chiudi</button>
  <img src="" alt="">
  <p class="lb-foot"><span class="lb-cap"></span><span class="lb-count"></span></p>
  <button class="nav-b prev" type="button" aria-label="Foto precedente"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
  <button class="nav-b next" type="button" aria-label="Foto successiva"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
</dialog>

<script src="assets/site.js"></script>
<script src="assets/calc.js"></script>
</body>
</html>
`;
  writeFileSync(`${OUT}/${P.file}`, html);
  console.log('wrote', P.file, html.length);
}
