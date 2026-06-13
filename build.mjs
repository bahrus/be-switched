import { writeFileSync } from 'fs';

const emc = await import('./emc.mjs');
writeFileSync('emc.json', emc.render(), 'utf8');

const emoji = await import('./🎚️.mjs');
writeFileSync('🎚️.json', emoji.render(), 'utf8');

console.log('Built emc.json and 🎚️.json');
