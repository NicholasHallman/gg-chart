import { svg } from "lit";
import { chartSizes } from "../sizing";


export const statsRender = ({width, height, stats, scale, canvas, aes, coord}) => {
  const {chartWidth, chartHeight, innerWidth, innerHeight, padding, yAxisSpacing } = chartSizes(width, height, scale, coord, aes);
  const [{lim: xlim}, {lim: ylim}] = scale;

  if (stats[aes[0]].mean) {
    const xmean = stats[aes[0]].mean;
    const cx = ((xmean - xlim[0]) * innerWidth / (xlim[1] - xlim[0]));

    canvas.push(svg`
    <svg width="${innerWidth}" height="${innerHeight}" x="${yAxisSpacing + (padding / 2)}" y="${padding / 2}">
      <line class="axis" style="transform: translateX(${cx}px)" x1="0" y1="0" x2="0" y2="${chartHeight}"></line>
    </svg>
    `)
  }

  if (aes[1] && stats[aes[1]].mean) {
    const ymean = stats[aes[1]].mean;
    const cy = innerHeight - ((ymean - ylim[0]) * innerHeight / (ylim[1] - ylim[0]));

    canvas.push(svg`
    <svg width="${innerWidth}" height="${innerHeight}" x="${yAxisSpacing + (padding / 2)}" y="${padding / 2}">
      <line class="axis" style="transform: translateY(${cy}px)" x1="${0}" y1="0" x2="100%" y2="0"></line>
    </svg>
    `)
  }
}
