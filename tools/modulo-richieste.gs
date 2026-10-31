// Google Apps Script for the site's request form: keeps each request in this Google Sheet and sends it by email.
// It lives in the Sheet (Extensions > Apps Script) and is deployed as a web app: execute as me, access for anyone.
// The web app address goes in FORM_URL in pionier-etrusco/assets/site.js.
const TO = 'info@pionieretrusco.com';
const HEAD = ['Ricevuta', 'Nome', 'Email', 'Telefono', 'Arrivo', 'Partenza', 'Sistemazione', 'Adulti', 'Bambini', 'Lettino', 'Messaggio'];
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const reply = ok => ContentService.createTextOutput(JSON.stringify({ ok })).setMimeType(ContentService.MimeType.JSON);
const text = (v, max = 200) => String(v ?? '').trim().slice(0, max);
// Sheets would run a cell starting with = + - @ as a formula
const cell = v => (/^[=+\-@]/.test(v) ? "'" + v : v);
const fmt = d => d.split('-').reverse().join('/');

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    // a bot: it filled in the hidden field, or it was faster than a person. It gets no error, and nothing is sent.
    if (d.sito || !(d.ms >= 2500)) return reply(true);
    const r = {
      nome: text(d.nome), email: text(d.email), telefono: text(d.telefono, 40),
      arrivo: text(d.arrivo, 10), partenza: text(d.partenza, 10), sistemazione: text(d.sistemazione),
      adulti: text(d.adulti, 3), bambini: text(d.bambini, 3), lettino: d.lettino ? 'sì' : '', messaggio: text(d.messaggio, 3000),
    };
    if (!r.nome || !MAIL.test(r.email) || !r.telefono || !DAY.test(r.arrivo) || !DAY.test(r.partenza)) return reply(false);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (!sheet.getLastRow()) sheet.appendRow(HEAD);
    sheet.appendRow([new Date(), ...Object.values(r).map(cell)]);

    MailApp.sendEmail({
      to: TO, replyTo: r.email, name: 'Sito Camping Pionier Etrusco',
      subject: `Richiesta disponibilità ${fmt(r.arrivo)} - ${fmt(r.partenza)}`,
      body: [
        'Nuova richiesta dal sito. Per rispondere basta premere Rispondi.', '',
        'Nome: ' + r.nome,
        'Email: ' + r.email,
        'Telefono: ' + r.telefono,
        'Arrivo: ' + fmt(r.arrivo),
        'Partenza: ' + fmt(r.partenza),
        'Sistemazione: ' + r.sistemazione,
        `Adulti: ${r.adulti}, bambini: ${r.bambini}`,
        r.lettino ? 'Lettino da campeggio: sì' : null,
        r.messaggio ? '' : null,
        r.messaggio || null,
      ].filter(x => x !== null).join('\n'),
    });
    return reply(true);
  } catch (err) {
    console.error(err);
    return reply(false);
  }
}
