import {
  rgbExecRgx,
  rgbaExecRgx,
  hslExecRgx,
  hslaExecRgx,
  hexValuePrefix,
} from './consts.js';

import {
  round,
  is
} from './utils.js';

// RGB / RGBA Color value string -> RGBA values array

function rgbToRgba(rgbValue) {
  const rgba = rgbExecRgx.exec(rgbValue) || rgbaExecRgx.exec(rgbValue);
  const r = +rgba[1];
  const g = +rgba[2];
  const b = +rgba[3];
  const a = +(rgba[4] || 1);
  return [r, g, b, a];
}

// HEX3 / HEX3A / HEX6 / HEX6A Color value string -> RGBA values array

function hexToRgba(hexValue) {
  const hexLength = hexValue.length;
  const isShort = hexLength === 4 || hexLength === 5;
  const isAlpha = hexLength === 5 || hexLength === 9;
  const r = +(hexValuePrefix + hexValue[1] + hexValue[isShort ? 1 : 2]);
  const g = +(hexValuePrefix + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]);
  const b = +(hexValuePrefix + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]);
  const a = isAlpha ? +((hexValuePrefix + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1;
  return [r, g, b, a];
}

// HSL / HSLA Color value string -> RGBA values array

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgba(hslValue) {
  const hsla = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
  const h = hsla[1] / 360;
  const s = hsla[2] / 100;
  const l = hsla[3] / 100;
  const a = +(hsla[4] || 1);
  let r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = round(hue2rgb(p, q, h + 1 / 3) * 255, 1);
    g = round(hue2rgb(p, q, h) * 255, 1);
    b = round(hue2rgb(p, q, h - 1 / 3) * 255, 1);
  }
  return [r, g, b, a];
}

// All in one color converter to convert color strings to RGBA array values

export function convertColorStringValuesToRgbaArray(colorValue) {
  if (is.rgb(colorValue)) return rgbToRgba(colorValue);
  if (is.hex(colorValue)) return hexToRgba(colorValue);
  if (is.hsl(colorValue)) return hslToRgba(colorValue);
}
