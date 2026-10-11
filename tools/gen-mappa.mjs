// Generates the camping map section (SVG + legend) in the site style.
// Coordinates are in the source map's pixel space (2000x1381), so the plan stays faithful.
import fs from 'fs';
const OUT = process.argv[2];

const TYPES = {
  P:  { name: 'Piazzole', long: 'Piazzola' },
  T:  { name: 'Piazzole tenda', long: 'Piazzola tenda' },
  G:  { name: 'Tenda grande, roulotte e camper', long: 'Piazzola per tenda grande, roulotte e camper' },
  GL: { name: 'Glamping', long: 'Glamping' },
  H:  { name: 'Home', long: 'Home' },
  B:  { name: 'Bungalow', long: 'Bungalow' },
  L:  { name: 'Locali tecnici', long: 'Locale tecnico' },
};

// [type, number, x, y, w, h]  or  [type, number, [x,y, x,y, ...]]
const cells = [];
const add = (t, n, x, y, w, h) => cells.push({ t, n, x, y, w, h });
const poly = (t, n, pts) => cells.push({ t, n, pts });
const row = (t, nums, x0, x1, y, h) => { const w = (x1 - x0) / nums.length; nums.forEach((n, i) => add(t, n, x0 + i * w, y, w, h)); };
const seq = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Top row
add('P', 1, 1046, 569, 22, 23);
row('P', seq(2, 4), 1070, 1144, 569, 23);
row('P', seq(5, 9), 1145, 1270, 569, 23);
[[22,1292,22],[23,1317,23],[24,1342,23],[25,1367,23],[26,1392,23]].forEach(([n,x,w]) => add('G', n, x, 569, w, 22));
row('P', seq(37, 43), 1416, 1592, 569, 22);
row('T', seq(57, 60), 1595, 1643, 569, 11);
row('P', [61, 62], 1658, 1708, 569, 22);
add('G', 63, 1709, 569, 23, 22); add('G', 64, 1734, 569, 17, 22);
row('T', seq(155, 167), 1755, 1917, 569, 11);
poly('T', 168, [1918,569, 1934,569, 1934,591, 1925,591, 1918,584]);

// Second band
row('P', seq(10, 15), 1109, 1246, 611, 23);
row('P', seq(16, 21), 1109, 1246, 634, 23);
add('P', '', 1096, 645, 12, 12);
[[27,1265,24],[28,1291,24],[29,1317,23],[30,1342,23],[31,1367,25]].forEach(([n,x,w]) => add('G', n, x, 612, w, 23));
[[32,1265,24],[33,1291,24],[34,1317,23],[35,1342,23],[36,1368,24]].forEach(([n,x,w]) => add('G', n, x, 637, w, 23));
row('P', seq(44, 46), 1410, 1486, 611, 25);
row('P', seq(47, 49), 1410, 1486, 636, 25);
add('P', 50, 1518, 611, 26, 25); add('P', 51, 1518, 636, 26, 25);
add('G', 65, 1586, 595, 23, 22); add('G', 66, 1618, 595, 22, 22);
add('T', 67, 1686, 606, 21, 10);
add('G', 193, 1854, 595, 21, 11); add('G', 192, 1877, 595, 20, 11);
[[185,1757,17],[186,1776,17],[187,1795,14],[188,1811,19],[189,1832,20],[190,1853,22],[191,1877,20]].forEach(([n,x,w]) => add('G', n, x, 609, w, 21));
add('G', 68, 1572, 634, 22, 23); add('G', 69, 1597, 634, 23, 23); add('T', 70, 1622, 634, 24, 23);
add('G', 71, 1584, 660, 23, 21); add('P', 72, 1608, 658, 25, 24); add('P', 73, 1633, 658, 25, 24);
add('G', 74, 1570, 684, 17, 24); add('G', 75, 1589, 684, 23, 24);
add('T', 76, 1627, 684, 23, 12); add('T', 77, 1627, 697, 23, 13);
[[194,1760,16],[195,1778,16],[196,1812,18],[197,1832,21],[198,1855,20],[199,1877,20]].forEach(([n,x,w]) => add('T', n, x, 656, w, 22));
poly('G', 52, [1408,682, 1439,682, 1439,709, 1415,709]);
[[53,1442,23],[54,1467,29],[55,1498,24],[56,1524,23]].forEach(([n,x,w]) => add('G', n, x, 682, w, 27));

// Cluster 78-107
poly('T', 78, [1407,730, 1426,730, 1426,752, 1411,752]);
add('T', 79, 1428, 730, 24, 22); add('T', 80, 1454, 730, 10, 22); add('T', 81, 1466, 730, 20, 22);
add('P', 82, 1492, 729, 22, 24);
poly('T', 83, [1411,754, 1440,754, 1440,778, 1415,778]);
add('T', 84, 1441, 754, 23, 24);
add('T', 85, 1466, 754, 20, 12); add('T', 86, 1466, 767, 20, 12); add('T', 93, 1466, 780, 20, 11);
add('T', 87, 1492, 755, 11, 11); add('T', 88, 1504, 755, 12, 11); add('T', 89, 1492, 767, 12, 12); add('T', 90, 1505, 767, 11, 12);
poly('T', 91, [1415,780, 1440,780, 1440,804, 1420,804]);
poly('T', 92, [1442,780, 1465,780, 1469,804, 1442,804]);
add('T', 94, 1492, 780, 24, 11); add('T', 95, 1518, 780, 16, 11);
add('T', 96, 1538, 731, 12, 12);
add('T', 98, 1580, 723, 24, 20); add('G', 100, 1606, 723, 22, 20);
add('P', 97, 1536, 744, 28, 26); add('P', 99, 1565, 744, 29, 26);
add('T', 103, 1535, 770, 29, 27); add('T', 104, 1566, 770, 28, 27);
add('P', 101, 1602, 744, 31, 26); add('P', 105, 1602, 771, 31, 27);
add('P', 102, 1636, 744, 46, 23);
add('T', 106, 1634, 768, 17, 14); add('T', 107, 1653, 768, 29, 14);

// Left cluster 120-126 and the services corner
add('T', 120, 1186, 691, 13, 12);
add('H', 121, 1186, 704, 33, 24); add('H', 124, 1186, 730, 33, 22);
add('G', 123, 1221, 704, 21, 24); add('G', 126, 1221, 730, 21, 22);
add('G', 108, 1254, 776, 16, 17); add('G', 109, 1273, 776, 16, 17);
add('T', 110, 1323, 769, 12, 11);
add('P', 111, 1344, 763, 16, 18); add('P', 114, 1344, 782, 16, 18);
add('G', 112, 1373, 765, 23, 16); add('G', 113, 1314, 784, 20, 15);
add('T', 115, 1367, 783, 17, 17); add('G', 116, 1386, 783, 17, 17);
add('GL', 117, 1311, 810, 50, 27);
add('P', 119, 1362, 811, 26, 24);

// Bottom row
add('T', 127, 1195, 845, 10, 11);
poly('T', 128, [1195,857, 1205,857, 1205,860, 1210,860, 1210,870, 1195,870]);
add('T', 129, 1211, 858, 11, 12);
add('GL', 130, 1265, 845, 49, 26);
row('P', seq(132, 138), 1315, 1485, 845, 24);
add('T', 142, 1470, 831, 14, 13);
add('T', 139, 1485, 817, 12, 12); add('T', 140, 1485, 829, 12, 13); add('T', '', 1498, 817, 11, 26);
add('T', 141, 1485, 843, 24, 26);
add('P', 143, 1510, 818, 25, 27); add('T', 144, 1511, 845, 24, 12); add('T', 145, 1511, 857, 24, 12);
add('P', 146, 1541, 818, 25, 27); add('T', 147, 1541, 845, 25, 12); add('T', 148, 1541, 857, 25, 12);
add('T', 149, 1573, 817, 31, 25); add('P', 150, 1573, 842, 31, 27);
add('T', 151, 1605, 817, 34, 32); add('T', 152, 1606, 850, 23, 19);
poly('T', 153, [1640,817, 1657,817, 1657,869, 1630,869, 1630,850, 1640,850]);
add('G', 154, 1659, 822, 36, 29);

// Bungalows: roof + veranda
const bung = [
  ['106', 1016, 775, 38, 1022, 789, 26], ['104', 1120, 779, 38, 1128, 793, 22], ['105', 1184, 777, 37, 1191, 791, 22],
  ['103', 1015, 810, 38, 1022, 824, 24], ['102', 1076, 837, 38, 1084, 851, 24],
  ['107 108', 1243, 801, 38, 1250, 815, 26], ['109 110', 1226, 844, 37, 1234, 858, 24],
];
// Technical rooms
const tech = [
  [1035, 612, 15, 20], [1062, 763, 30, 16], [1204, 820, 10, 7], [1139, 826, 18, 10], [1179, 828, 14, 8], [1205, 829, 9, 12], [1140, 843, 29, 16],
];
const techPoly = [[1047,717, 1071,717, 1071,733, 1068,733, 1068,752, 1047,752], [1004,775, 1010,776, 1004,804, 998,803]];

// Services: [icon, x, y]
const SERV = {
  ingresso: 'Ingresso del camping', reception: 'Reception', bar: 'Bar', ristorante: 'Ristorante e pizzeria', animazione: 'Mini club e animazione',
  piscina: 'Piscina', giochi: 'Parco giochi', calcio: 'Campo da calcio', pallavolo: 'Campo da pallavolo',
  bike: 'Bike service', parcheggio: 'Parcheggio', camperstop: 'Camper stop', camperservice: 'Camper service',
  bagni: 'Bagni', docce: 'Docce', privati: 'Bagni privati', disabili: 'Bagni per disabili',
  lavandini: 'Lavandini e lavapiatti', lavanderia: 'Lavanderia e stireria', bbq: 'Area barbecue',
};
const marks = [
  ['ingresso', 1006, 668],
  ['parcheggio', 489, 610], ['pallavolo', 336, 711], ['piscina', 418, 712], ['animazione', 345, 781],
  ['giochi', 302, 767], ['calcio', 112, 848], ['animazione', 487, 707], ['camperstop', 720, 711],
  ['reception', 1066, 640], ['bike', 1091, 615], ['animazione', 1034, 652],
  ['bar', 1060, 698], ['ristorante', 1126, 698],
  ['privati', 1171, 805],
  ['bagni', 1268, 697], ['bagni', 1298, 697], ['lavandini', 1328, 697], ['privati', 1374, 712], ['privati', 1374, 740],
  ['disabili', 1268, 725], ['lavanderia', 1283, 748], ['docce', 1313, 748],
  ['bbq', 1672, 631], ['bagni', 1731, 623], ['lavandini', 1703, 631], ['docce', 1703, 670], ['camperservice', 1731, 671],
];

// 24x24 line icons
const ICON = {
  ingresso: '<path d="M3 12h11M10 8l4 4-4 4M14 4h6v16h-6"/>',
  reception: '<path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 12V9.5M10 9.5h4"/>',
  bar: '<path d="M5 5h14l-7 8zM12 13v6M8 19h8"/>',
  ristorante: '<path d="M8 3v18M5 3v5a3 3 0 0 0 6 0V3M17 21V3c-2.5 2-3 7-.5 9"/>',
  animazione: '<path d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/>',
  piscina: '<path d="M3 16c2 0 2.5-1.4 4.5-1.4S10 16 12 16s2.5-1.4 4.5-1.4S19 16 21 16M3 20c2 0 2.5-1.4 4.5-1.4S10 20 12 20s2.5-1.4 4.5-1.4S19 20 21 20M9 12.5V5a2 2 0 0 0-2-2M15 12.5V5a2 2 0 0 0-2-2M9 7h6M9 10.5h6"/>',
  giochi: '<path d="M4 21V4h16v17M9 4v9M15 4v9M7.5 13h9"/>',
  calcio: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l3.8 2.8-1.5 4.4H9.7l-1.5-4.4zM12 3v4.5M15.8 10.3l4.4-1.5M14.3 14.7l2.6 3.8M9.7 14.7l-2.6 3.8M8.2 10.3L3.8 8.8"/>',
  pallavolo: '<circle cx="12" cy="12" r="9"/><path d="M12 3c-2.5 3.5-2.5 6.5 0 9 3.5.2 6.5 1.7 8.2 4.2M12 12c-1.7 3-4.2 5-7.8 5.7M12 12c1.8-3 1.8-6.3.3-9"/>',
  bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l3.5-7h6L18 16M9.5 9l3 7H6M14 6h3"/>',
  parcheggio: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
  camperstop: '<path d="M3 16V8a2 2 0 0 1 2-2h10l5 5v5zM15 6v5h5M6 9h5v3H6z"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>',
  camperservice: '<path d="M12 3.5c3 4 5 6.4 5 9a5 5 0 0 1-10 0c0-2.6 2-5 5-9z"/><path d="M10 14a2 2 0 0 0 2 2"/>',
  bagni: '<circle cx="8" cy="5" r="1.6"/><circle cx="16" cy="5" r="1.6"/><path d="M6.5 21v-6H5.5V9.5h5V15h-1v6M14.5 21v-5h-2l2-6.5h3l2 6.5h-2v5"/>',
  docce: '<path d="M5 21V9a5 5 0 0 1 9-3M11 9h7l-1-3h-5zM12 13v1M15 13v1M18 13v1M13.5 17v1M16.5 17v1"/>',
  privati: '<rect x="6" y="3" width="12" height="18" rx="1.5"/><circle cx="14.5" cy="12" r="1.2"/>',
  disabili: '<circle cx="11" cy="4.5" r="1.6"/><path d="M11 7.5v6h5l2 5.5M11 10.5h4.5M8.5 11a5 5 0 1 0 6.8 6.5"/>',
  lavandini: '<path d="M3 12h18a9 5 0 0 1-18 0zM12 12V6a2 2 0 0 1 4 0M12 19v2"/>',
  lavanderia: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6.5h1.5"/>',
  bbq: '<path d="M4 10h16a8 5.5 0 0 1-16 0zM8.5 15l-2 6M15.5 15l2 6M10 3.5v3M14 3.5v3"/>',
  tv: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 3l3 4 3-4"/>',
  wifi: '<path d="M4.5 10a11 11 0 0 1 15 0M7.8 13.4a6.3 6.3 0 0 1 8.4 0"/><circle cx="12" cy="17" r="1.2"/>',
  presa: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
};

const f = v => +(+v).toFixed(1);
const numText = c => {
  if (c.n === '') return '';
  let cx, cy, w;
  if (c.pts) { const xs = c.pts.filter((_, i) => i % 2 === 0), ys = c.pts.filter((_, i) => i % 2); cx = (Math.min(...xs) + Math.max(...xs)) / 2; cy = (Math.min(...ys) + Math.max(...ys)) / 2; w = Math.max(...xs) - Math.min(...xs); }
  else { cx = c.x + c.w / 2; cy = c.y + c.h / 2; w = c.w; }
  const digits = String(c.n).length;
  const fs = Math.min(8, (w - 1.5) / (digits * 0.6));
  return `<text x="${f(cx)}" y="${f(cy)}" style="font-size:${f(fs)}px">${c.n}</text>`;
};
const shape = c => c.pts ? `<polygon points="${c.pts.map(f).join(' ')}"/>` : `<rect x="${f(c.x)}" y="${f(c.y)}" width="${f(c.w)}" height="${f(c.h)}" rx="1.2"/>`;

const cellsSvg = cells.map(c => {
  const label = c.n === '' ? TYPES[c.t].long : `${TYPES[c.t].long} ${c.n}`;
  return `<g class="cell t-${c.t}" data-type="${c.t}" data-tip="${label}">${shape(c)}${numText(c)}</g>`;
}).join('\n');
const haloSvg = cells.map(shape).join('');

const bungSvg = bung.map(([n, x, y, w, vx, vy, vw]) => {
  const slats = []; for (let sx = vx + 2.5; sx < vx + vw - 1; sx += 3.2) slats.push(`M${f(sx)} ${vy + 1.5}v8`);
  return `<g class="cell t-B" data-type="B" data-tip="Bungalow ${n.replace(' ', ' e ')}"><rect class="deck" x="${vx}" y="${vy}" width="${vw}" height="11" rx="1"/><path class="slats" d="${slats.join('')}"/><rect x="${x}" y="${y}" width="${w}" height="13" rx="1.5"/><text x="${x + w / 2}" y="${y + 6.8}" style="font-size:6.5px">${n}</text></g>`;
}).join('\n');
const oldUnits = `<g class="cell t-B" data-type="B" data-tip="Bungalow"><polygon points="993,832 1011,836 1007,854 989,850"/><rect x="1026" y="740" width="16" height="10" rx="1"/></g>`;
const techSvg = `<g class="cell t-L" data-type="L" data-tip="Locale tecnico">${tech.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5"/>`).join('')}${techPoly.map(p => `<polygon points="${p.join(' ')}"/>`).join('')}</g>`;

const marksSvg = marks.map(([k, x, y], i) => k === 'ingresso'
  ? `<g class="mk entry" data-serv="${k}" data-x="${x}" data-y="${y}" data-tip="${SERV[k]}" transform="translate(${x} ${y})"><rect class="elbl" x="-72" y="-11" width="60" height="22" rx="11"/><text class="etx" x="-42" y="4">Ingresso</text><circle class="ring" r="11"/><circle class="dot" r="9.5"/><use href="#mi-${k}" x="-6" y="-6" width="12" height="12"/></g>`
  : `<g class="mk" data-serv="${k}" data-x="${x}" data-y="${y}" data-tip="${SERV[k]}" transform="translate(${x} ${y})"><circle class="ring" r="11"/><circle class="dot" r="9"/><use href="#mi-${k}" x="-6" y="-6" width="12" height="12"/></g>`
).join('\n');

const symbols = Object.entries(ICON).map(([k, d]) => `<symbol id="mi-${k}" viewBox="0 0 24 24">${d}</symbol>`).join('');

const svg = `<svg class="cmap" viewBox="10 262 1960 788" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="cmap-t cmap-d">
<title id="cmap-t">Mappa del Camping Pionier Etrusco</title>
<desc id="cmap-d">Pianta del camping con piazzole numerate, bungalow, glamping, home e servizi, più l'area mediterranea con il laghetto, l'area sport, la piscina, il parcheggio e il camper stop.</desc>
<defs>
${symbols}
<pattern id="cm-pines" width="64" height="56" patternUnits="userSpaceOnUse"><g class="pine d"><circle cx="12" cy="12" r="9"/><circle cx="40" cy="30" r="11"/><circle cx="54" cy="8" r="6"/><circle cx="18" cy="42" r="7"/><circle cx="62" cy="50" r="5"/></g></pattern>
<pattern id="cm-pines-s" width="170" height="130" patternUnits="userSpaceOnUse"><g class="pine s"><circle cx="24" cy="26" r="12"/><circle cx="104" cy="84" r="14"/><circle cx="140" cy="22" r="8"/><circle cx="54" cy="104" r="7"/></g></pattern>
</defs>
<rect class="street" x="0" y="250" width="1990" height="820"/>
<path class="edge" d="M952 880Q955 935 985 938L1975 1031M980 978L1975 1080M980 978L958 1070"/>
<path class="land" d="M955 306L1071 306L898 1030L10 1030L10 930Z"/>
<path class="land" d="M1088 308L1975 340L1975 895L990 895Q953 895 956 860Z"/>
<path class="land-pines" d="M1088 308L1975 340L1975 895L1712 895L1712 715L1950 715L1950 552L1040 552Z"/>
<path class="road" d="M1082 250L1102 250L914 1060L892 1060Z"/>
<path class="edge" d="M1082 250L889 1060M1102 250L911 1060"/>
<g class="zone-left">
  <path class="lawn" d="M123 280L955 310L1003 420L960 588L940 672L920 752L525 745L475 957L428 953L420 987L30 935Z"/>
  <path class="macchia" d="M123 280L955 310L1003 420L960 588L87 565Z"/>
  <path class="macchia-pines" d="M123 280L955 310L1003 420L960 588L87 565Z"/>
  <path class="lake" d="M548 438C585 432 640 430 656 452C668 470 652 500 646 520C640 540 628 528 600 536C570 544 540 546 530 520C520 494 520 446 548 438Z"/>
  <path class="wave" d="M560 492.3 L566.6 486.8 L571.2 488.7 L568.4 489.7 L567.5 491.7 L571 492.3 L577.6 486.8 L582.2 488.7 L579.4 489.7 L578.5 491.7 L582 492.3 L588.6 486.8 L593.2 488.7 L590.4 489.7 L589.5 491.7 L593 492.3 M576 512.3 L582.6 506.8 L587.2 508.7 L584.4 509.7 L583.5 511.7 L587 512.3 L593.6 506.8 L598.2 508.7 L595.4 509.7 L594.5 511.7 L598 512.3 L604.6 506.8 L609.2 508.7 L606.4 509.7 L605.5 511.7 L609 512.3"/>
  <path class="strip" d="M87 565L960 588L940 670L75 645Z"/>
  <path class="lane" d="M80 625L932 649"/>
  <path class="strip" d="M523 673L938 678L920 752L525 745Z"/>
  <rect class="bld-o" x="858" y="612" width="37" height="33" rx="2"/>
  <path class="lane" d="M876 645V668"/>
  <path class="path" d="M270 655h12v172h-12zM68 697h202v13H68zM96 707h12v93H96zM55 800L333 832L331 845L53 813ZM462 658l9 2-8 42-9-2Z"/>
  <path class="field" d="M60 812L170 828L162 885L55 870Z"/>
  <path class="field-l" d="M115 820L108 877"/>
  <rect class="field" x="297" y="682" width="60" height="35" rx="1"/>
  <path class="field-l" d="M327 682v35"/>
  <circle class="pool-deck" cx="418" cy="712" r="28"/>
  <circle class="pool" cx="418" cy="712" r="20"/>
  <rect class="bld" x="285" y="735" width="34" height="65" rx="2"/>
  <rect class="bld" x="327" y="750" width="35" height="62" rx="2"/>
  <rect class="bld" x="497" y="690" width="26" height="32" rx="2"/>
</g>
<g class="zone-camp">
  <path class="ground" d="M1041 557L1944 557L1944 714L1704 714L1705 860L1666 860L1666 877L975 877Z"/>
  <path class="walk" d="M1020 676h148v76H1020zM1253 679h135l17 40v81h-93v-41h-59zM1680 616h64v67h-64zM1600 681h62v42"/>
  <path class="walk" d="M1030 767c0-4 3-6 7-6h110c5 0 8 3 8 7v26c0 4-3 7-8 7H1040c-6 0-10-3-10-8zM1165 770h45c4 0 6 3 6 6v40M1105 813h60"/>
  <rect class="bld" x="1022" y="678" width="144" height="72" rx="3"/>
  <rect class="bld" x="1048" y="620" width="35" height="38" rx="2"/>
  <rect class="bld" x="1255" y="681" width="130" height="76" rx="3"/>
  <rect class="bld" x="1682" y="614" width="62" height="70" rx="3"/>
  <rect class="bld" x="1162" y="792" width="20" height="26" rx="2"/>
  <g class="halo">${haloSvg}</g>
  <g class="cells">
${cellsSvg}
${bungSvg}
${oldUnits}
${techSvg}
  </g>
  <path class="fence" d="M1041 557L1944 557L1944 714L1704 714L1705 860L1666 860L1666 877L975 877Z"/>
  <path class="gate" d="M1020.2 658L1016.1 678"/>
</g>
<g class="labels">
  <text class="zl" x="470" y="372" text-anchor="middle">Area mediterranea</text>
  <text class="zl s w" x="590" y="478" text-anchor="middle">Laghetto</text>
  <text class="zl s" x="512" y="615">Parcheggio</text>
  <text class="zl s" x="744" y="716">Camper stop</text>
  <text class="zl s" x="220" y="930" text-anchor="middle">Area sport</text>
  <text class="title" x="1492" y="470">Camping Pionier Etrusco</text>
  <text class="zl s" x="1492" y="504" text-anchor="middle">Il camping, sotto la pineta</text>
</g>
<g class="marks">
${marksSvg}
</g>
</svg>`;

const typeOrder = ['P', 'T', 'G', 'B', 'GL', 'H', 'L'];
const typeLegend = typeOrder.map(t => `<li><button type="button" class="lg-type" data-type="${t}" aria-pressed="false"><span class="sw t-${t}" aria-hidden="true"></span>${TYPES[t].name}</button></li>`).join('');
const servLegend = Object.entries(SERV).map(([k, v]) => `<li><button type="button" class="lg-serv" data-serv="${k}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#mi-${k}"/></svg>${v}</button></li>`).join('');

const section = `<section class="cmap-sec" id="mappa" aria-labelledby="mappa-t">
  <div class="wrap">
    <div class="cmap-head" data-reveal>
      <p class="label rv" style="--i:0">La mappa</p>
      <h2 class="h2 rv" id="mappa-t" style="--i:1">Ogni <em>piazzola</em>, ogni servizio.</h2>
      <p class="cmap-intro rv" style="--i:2">Tocca un tipo di piazzola o un servizio per trovarlo sulla mappa. Per tornare alla mappa completa, toccalo di nuovo o tocca un punto qualsiasi fuori.</p>
    </div>
    <div class="cmap-tools">
      <div class="cmap-view" role="group" aria-label="Vista della mappa">
        <button type="button" data-view="all" aria-pressed="true">Tutto il camping</button>
        <button type="button" data-view="camp" aria-pressed="false">Zoom sulle piazzole</button>
      </div>
      <a class="cmap-prices" href="#tariffe">Vedi le tariffe<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <p class="cmap-hint"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>Scorri la mappa di lato</p>
    </div>
    <div class="cmap-frame" data-view="all">
      <div class="cmap-scroll">${svg}</div>
      <div class="cmap-tip" role="status" aria-live="polite"></div>
    </div>
    <div class="cmap-legend">
      <div><h3>Sistemazioni</h3><ul>${typeLegend}</ul></div>
      <div><h3>Servizi</h3><ul class="cols">${servLegend}</ul></div>
    </div>
  </div>
</section>`;

fs.writeFileSync(OUT + '/mappa-section.html', section);
const SITE = '/Users/ilariaeleuteri/Desktop/Claude1camping/pionier-etrusco';
// Inject into the home page after the Servizi section (idempotent between markers)
let idx = fs.readFileSync(SITE + '/index.html', 'utf8');
const block = `<!-- mappa:start -->\n${section}\n<!-- mappa:end -->`;
if (idx.includes('<!-- mappa:start -->')) idx = idx.replace(/<!-- mappa:start -->[\s\S]*?<!-- mappa:end -->/, () => block);
else {
  const anchor = idx.indexOf('</section>', idx.indexOf('id="servizi"')) + '</section>'.length;
  idx = idx.slice(0, anchor) + '\n\n' + block + idx.slice(anchor);
}
if (!idx.includes('assets/mappa.css')) idx = idx.replace('<link rel="stylesheet" href="assets/site.css">', '<link rel="stylesheet" href="assets/site.css">\n<link rel="stylesheet" href="assets/mappa.css">');
if (!idx.includes('assets/mappa.js')) idx = idx.replace('<script src="assets/site.js"></script>', '<script src="assets/site.js"></script>\n<script src="assets/mappa.js"></script>');
fs.writeFileSync(SITE + '/index.html', idx);
console.log('cells', cells.length, 'marks', marks.length, 'bytes', section.length);
