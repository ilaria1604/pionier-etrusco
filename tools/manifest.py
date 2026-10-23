# name -> (source path relative to project, kind)   kind: ext = exterior daylight, int = wood interior, night, web = already professional, keep = do not grade
import csv
P='/Users/ilariaeleuteri/Desktop/Claude1camping/'
idx={r[0]:r[1] for r in csv.reader(open(P+'review/sel/index.tsv'),delimiter='\t')}
SEL=lambda i: 'foto-selezione/Camping/'+idx[i]
MAT=lambda n: 'materiali/'+n
M={
 # accommodation types
 'bung-hero':(SEL('BG75'),'ext'),'bung-pino':('review/bung-pino-pulita.png','keep'),  # pavers retouched, already graded
 'bung-matrimoniale':(SEL('BG35'),'int'),'bung-castello':(SEL('BG46'),'int'),'bung-singolo':(SEL('BG51'),'int'),'bung-cucina-bianca':(SEL('BG53'),'int'),
 'glam-notte':(SEL('GL1'),'night'),'glam-fiori':(SEL('GL3'),'ext'),
 'glam-cover':('foto-selezione/Camping/Glamping/copertina glamping.JPG','ext'),  # detail hero, kept at full 1200x1600 (see grade call in design-package rev 39)
 'home-2':(SEL('HO2'),'ext'),'home-3':(SEL('HO3'),'ext'),
 'piaz-11':(SEL('PI11'),'ext'),'piaz-9':(SEL('PI9'),'ext'),'piaz-1':(SEL('PI1'),'ext'),'piaz-tetto':(SEL('PI12'),'ext'),'piaz-tenda':(SEL('PI13'),'ext'),
 'bagni-1':(SEL('BA3'),'ext'),'bagni-docce':(SEL('BA4'),'ext'),'bagni-fiori':(SEL('BA5'),'ext'),
 'sport-vulci':(SEL('SP1'),'ext'),'verde-fiori':(SEL('VE3'),'ext'),'verde-veranda':(SEL('VE5'),'ext'),'verde-rosso':(SEL('VE9'),'ext'),
 'piazzole-pineta':(MAT('IMG_1290.HEIC'),'ext'),'piazzola-camper':(MAT('IMG_6364.heic'),'ext'),'camper-stop':(MAT('IMG_9313.HEIC'),'ext'),
 'tramonto-spiaggia':(MAT('IMG_8888.HEIC'),'sunset'),'tramonto-molo':(MAT('IMG_1009.HEIC'),'sunset'),'kayak-sup':(MAT('IMG_1013.HEIC'),'ext'),
 'home-veranda':(MAT('IMG_4828.HEIC'),'int'),
 # already professional (old site): light touch only
 'home-soggiorno':('pionier-etrusco/assets/foto/home-soggiorno.jpg','web'),'home-cucina':('pionier-etrusco/assets/foto/home-cucina.jpg','web'),
 'home-matrimoniale':('pionier-etrusco/assets/foto/home-matrimoniale.jpg','web'),'home-letti-singoli':('pionier-etrusco/assets/foto/home-letti-singoli.jpg','web'),'home-bagno':('pionier-etrusco/assets/foto/home-bagno.jpg','web'),
 'glamping-interno-1':('pionier-etrusco/assets/foto/glamping-interno-1.jpg','web'),'glamping-interno-3':('pionier-etrusco/assets/foto/glamping-interno-3.jpg','web'),'glamping-interno-4':('pionier-etrusco/assets/foto/glamping-interno-4.jpg','web'),
}

# bungalow types, from the owner's 2/4/6 posti folders (28 Sep 2026)
M.update({
 'mono-passerella':('foto-selezione/Camping/Bungalow/Bungalow 2 posti/Passerella per andare ai bungalow piccoli.heic','ext'),
 'mono-camera':('review/mono-camera-ritoccata.png','keep'),  # retouched: bed made, hat removed, window balanced
 'mono-cucina':('foto-selezione/Camping/Bungalow/Bungalow 2 posti/Veranda bunaglow 2 posti.HEIC','int'),
 'mono-veranda':('foto-selezione/Camping/Bungalow/Bungalow 2 posti/Veranda con fiori bungalow 2 posti.HEIC','int'),
 'mono-bagno':('foto-selezione/Camping/Bungalow/Bungalow 2 posti/Bagno bungalow 2 posti 1.HEIC','int'),
 'mono-doccia':('foto-selezione/Camping/Bungalow/Bungalow 2 posti/bagno bungalow 2 posto.HEIC','int'),
 'tri-esterno':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/EXT bungalow 4 posti.HEIC','ext'),
 'tri-ingresso':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/Ingresso bungalow alto.HEIC','ext'),
 'tri-104':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/Bungalow 104 esterno.HEIC','ext'),
 'tri-cucina':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/Angolo cottura bungalow.heic','int'),
 'tri-camera':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/Camera da letto bungalow.heic','int'),
 'tri-bagno':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/Bgano bungalow.HEIC','int'),
 'tri-veranda':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/Veranda bungalow.heic','int'),
 'tri-veranda-2':('foto-selezione/Camping/Bungalow/Bungalow 4 posti/Veranda bungalow altra prospettiva.HEIC','int'),
 'sup-esterno':('foto-selezione/Camping/Bungalow/Bungalow 6 posti/Ext bungaloe grande 2026.HEIC','ext'),
 'sup-soggiorno':('foto-selezione/Camping/Bungalow/Bungalow 6 posti/sala bungalow grande 1.HEIC','int'),
 'sup-soggiorno-2':('foto-selezione/Camping/Bungalow/Bungalow 6 posti/Sala bungalow grande 2.HEIC','int'),
 'sup-camera':('foto-selezione/Camping/Bungalow/Bungalow 6 posti/Camera bungaloe grande 2026.HEIC','int'),
 'sup-bagno':('foto-selezione/Camping/Bungalow/Bungalow 6 posti/Bagno bungalow grande buona.HEIC','int'),
 'sup-veranda':('foto-selezione/Camping/Bungalow/Bungalow 6 posti/Veranda Bungalow 107.HEIC','int'),
})
# from the current site (review/oldsite-bung), rooms missing in the owner's folders
M.update({'tri-castello':('review/oldsite-bung/img/T-06.jpg','web'),'sup-castello':('review/oldsite-bung/img/S-02-2.jpg','web'),'sup-cameretta':('review/oldsite-bung/img/S-Trilocale-cameretta.png','web'),'sup-cucina':('review/oldsite-bung/img/S-Trilocale-cucina.png','web')})
# from the current site (review/oldsite-servizi), owner photos of services and sea (usability round, rev 41)
OS='review/oldsite-servizi/'
M.update({'piscina-1':(OS+'2021_04_01-7.jpg','web'),'piscina-2':(OS+'2021_04_03-5.jpg','web'),'piscina-giochi':(OS+'2021_04_02-6.jpg','web'),
 'ristorante-esterno':(OS+'2021_04_02-5.jpg','web'),'animazione-prato':(OS+'2021_04_05-5.jpg','web'),'beach-volley':(OS+'2021_04_04-5.jpg','web'),
 'mare-onde':(OS+'2021_04_01-4.jpg','web'),'mare-bici':(OS+'2021_04_06-2.jpg','web'),'mare-orizzonte':(OS+'2021_05_Header-10.jpg','web')})
# camper stop banner (rev 69): a dog on the beach at sunset, sent by the owner
M.update({'cani-spiaggia':(MAT('IMG_9563.heic'),'ext')})
# covers are cropped by hand from the originals (see design-package rev 17-18): bung-cover, bung-cover-card = 'EXT bungalow 4 posti'; sup-pineta = 'Immagine copertina bungalow'
if __name__=='__main__':
    import os,sys
    bad=[k for k,(s,_) in M.items() if not os.path.exists(P+s)]
    print(len(M),'entries; missing sources:',bad or 'none')
