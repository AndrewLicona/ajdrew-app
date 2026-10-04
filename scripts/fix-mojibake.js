// Script de limpieza: reemplaza caracteres mojibake y emojis por versiones ASCII
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'docs', 'ROADMAP-FASES.md');
let content = fs.readFileSync(file, 'utf8');
const before = content.length;
console.log('Before:', before, 'chars');

// Mapa de reemplazos (from -> to)
const replacements = [
  // Mojibake de emojis (UTF-8 -> Latin-1 mal interpretado)
  [/ðŸš€/g, '[ROCKET]'],
  [/ðŸ"‹/g, '[LIST]'],
  [/ðŸ"Š/g, '[BAR]'],
  [/ðŸ"¦/g, '[PIN]'],
  [/ðŸ›/g, '[SHIELD]'],
  [/ðŸ›¡/g, '[LOCK]'],
  [/ðŸ"§/g, '[WRENCH]'],
  [/ðŸ› ï¸/g, '[CONFIG]'],
  [/ðŸš¨/g, '[ALERT]'],
  [/ðŸ"š/g, '[INSTALL]'],
  [/ðŸ'¾/g, '[MONEY]'],
  [/ðŸŽ®/g, '[GAME]'],
  [/ðŸ"…/g, '[CALENDAR]'],
  [/ðŸŽ‰/g, '[PARTY]'],
  [/ðŸ"„/g, '[MAGIC]'],
  [/ðŸ"¥/g, '[FIRE]'],
  [/ðŸ‘‘/g, '[CROWN]'],
  [/ðŸŽ¯/g, '[TARGET]'],
  [/ðŸ"‹/g, '[LIST]'],
  [/ðŸš€/g, '[ROCKET]'],
  // Mojibake de simbolos comunes
  [/â€/g, '-'],
  [/â€"/g, '-'],
  [/â€™/g, "'"],
  [/â€œ/g, '"'],
  [/â€¦/g, '...'],
  [/â€¢/g, '*'],
  [/âž¡ï¸/g, '->'],
  [/âž/g, '+'],
  [/â†/g, '->'],
  [/â†©/g, '<-'],
  [/â¬/g, '[X]'],
  [/âœ…/g, '[OK]'],
  [/â­ï¸/g, '[STAR]'],
  [/âš ï¸/g, '[WARN]'],
  [/âš”ï¸/g, '[VS]'],
  [/â³ï¸/g, '[FAIL]'],
  [/â˜/g, '[NOTE]'],
  [/â€"/g, '-'],
  // Mojibake de acentos (UTF-8 -> Latin-1)
  [/Ã³/g, 'o'],
  [/Ã¡/g, 'a'],
  [/Ã©/g, 'e'],
  [/Ã­/g, 'i'],
  [/Ãº/g, 'u'],
  [/Ã±/g, 'n'],
  [/Ã/g, 'A'],
  [/Ã‰/g, 'E'],
  [/Ã"/g, 'O'],
  [/Ã“/g, 'O'],
  // Otros
  [/â€™/g, "'"],
  [/â€˜/g, "'"],
];

for (const [pattern, replacement] of replacements) {
  content = content.replace(pattern, replacement);
}

// Eliminar todos los caracteres en rango Latin-1 (U+0080 - U+00FF) que sean raros
// Mantener solo acentos normales y en-ns por si quedan
content = content.replace(/[-ÿ]/g, '');

fs.writeFileSync(file, content, 'utf8');
const after = content.length;
console.log('After:', after, 'chars');
console.log('Done');