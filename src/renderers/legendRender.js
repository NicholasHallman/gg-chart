import { html } from 'lit';

const COLORS = Array(11)
  .fill(0)
  .map((_, i) => `var(--gg-color-${i + 1})`);

const renderColor = num =>
  html`<div
    class="legend-color"
    style="background-color: ${COLORS[num % COLORS.length]};"
  ></div>`;

export const legendRender = ({ aes, scale, legendCanvas, data }) => {
  // create a legend for each extra aes
  if (aes.specialEntries().length === 0) return;
  legendCanvas.push(
    html`
      ${aes.specialEntries().map(([, axis]) => {
        const name = scale[aes.indexOf(axis)]?.name ?? axis;
        const values = Array.from(new Set(data.map(r => r[axis]))).sort(
          (a, b) => a - b
        );
        const breaks = scale[aes.indexOf(axis)]?.breaks;
        return html`<div class="legend-container">
          <p class="legend-title">${name}</p>
          ${values.map(
            (v, i) =>
              html`<p class="legend-item">
                ${renderColor(values.indexOf(v))}${breaks ? breaks[i] : v}
              </p>`
          )}
        </div>`;
      })}
    `
  );
};
