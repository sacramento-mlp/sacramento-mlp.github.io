import { readFileSync } from 'node:fs';

const stylesheet = readFileSync('src/styles/homepage.css', 'utf8');
const selectors = {
  dark: /:root\s*\{([^}]*)\}/,
  light: /html\[data-theme=light\]\s*\{([^}]*)\}/
};
const parseTokens = (body) => Object.fromEntries(
  [...body.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?)(?![0-9a-fA-F])/g)].map((m) => [m[1], m[2]])
);
function luminance(hex) {
  const normalized = hex.length === 4
    ? '#' + [...hex.slice(1)].map((digit) => digit + digit).join('')
    : hex;
  const rgb = [1, 3, 5].map((offset) => {
    const channel = parseInt(normalized.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
const failures = [];
for (const [theme, selector] of Object.entries(selectors)) {
  const match = stylesheet.match(selector);
  if (!match) {
    failures.push(`Missing color tokens for ${theme}`);
    continue;
  }
  const tokens = parseTokens(match[1]);
  for (const foreground of ['text', 'muted', 'accent']) {
    for (const background of ['bg', 'panel']) {
      if (!tokens[foreground] || !tokens[background]) {
        failures.push(`Missing ${theme} tokens: ${foreground}/${background}`);
        continue;
      }
      const ratio = contrast(tokens[foreground], tokens[background]);
      console.log(`${theme} ${foreground} on ${background}: ${ratio.toFixed(2)}:1`);
      if (ratio < 4.5) {
        failures.push(`${theme} ${foreground} on ${background}: ${ratio.toFixed(2)}:1 (needs at least 4.5:1)`);
      }
    }
  }
}
if (failures.length) {
  console.error('Color contrast check failed:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Core theme tokens meet 4.5:1 text contrast on background and panel.');
}
