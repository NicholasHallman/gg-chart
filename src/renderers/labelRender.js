import { nothing, svg } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

export function renderLabels({ canvas, aes, data, sizing }) {
  canvas.push(svg`
  <svg width="${sizing.innerWidth}" height="${sizing.innerHeight}" x="${
    sizing.yAxisSpacing + sizing.padding / 2
  }" y="${sizing.padding / 2}">
    ${repeat(
      data.points,
      (p, i) => `label-${i}`,
      p =>
        p[aes[1]] === 0
          ? nothing
          : svg`<text x="${p.px}" y="${p.py}">${p[aes[1]]}</text>`
    )}
  </svg>`);
}
