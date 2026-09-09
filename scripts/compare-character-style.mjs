import sharp from 'sharp';
import {mkdir, writeFile} from 'node:fs/promises';
import {FIGHTERS} from '../game/data.ts';

// Read-only visual audit. All cutouts stay at native pixels, with a shared baseline.
const out = '../work/character-style';
await mkdir(out, {recursive: true});
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
async function board(items, filename, columns = 4) {
  const width = columns * 384, height = Math.ceil(items.length / columns) * 424;
  const layers = [], labels = [];
  for (const [i, item] of items.entries()) {
    const {id, name} = item, cell = id === 'janhulk' ? 384 : 256;
    const left = i % columns * 384, top = Math.floor(i / columns) * 424;
    const image = await sharp(`public/assets/animations/${id}/idle.webp`)
      .extract({left: 0, top: 0, width: cell, height: cell}).png().toBuffer();
    layers.push({input: image, left: left + (384 - cell) / 2, top: top + 384 - cell});
    labels.push(`<text x="${left + 12}" y="${top + 410}" fill="#f5e6ba" font-size="18">${escape(name)}</text>`);
  }
  layers.push({input: Buffer.from(`<svg width="${width}" height="${height}">${labels.join('')}</svg>`), left: 0, top: 0});
  await sharp({create: {width, height, channels: 4, background: '#172333'}}).composite(layers).png().toFile(`${out}/${filename}`);
}
await board(['roland', 'jan', 'michael'].map(id => FIGHTERS.find(f => f.id === id)), 'jan-vergleich.png', 3);
await board([{id: 'jan', name: 'Jan'}, {id: 'janhulk', name: 'Jan · Zusatzform'}], 'jan-spoiler-vergleich.png', 2);
for (let page = 0; page < Math.ceil(FIGHTERS.length / 12); page++)
  await board(FIGHTERS.slice(page * 12, page * 12 + 12), `roster-${page + 1}.png`);
await writeFile(`${out}/README.md`, '# Stil-Vergleich\n\nAlle Ausschnitte sind unvergrößerte Spielbilder aus dem Standclip. Normale Figuren: 256er Zellen; grüne Form: 384er Zelle. Gleiche Bodenlinie und native Pixeldichte. Die PNGs bei 100 % ansehen. Ein gemeinsames technisches Raster ist kein Beleg für einen einheitlichen Zeichenstil.\n');
console.log(`Native Vergleichstafeln für ${FIGHTERS.length} Figuren und Jans grüne Form: ${out}`);
