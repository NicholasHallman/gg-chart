import { svg } from "lit";
import { repeat } from 'lit/directives/repeat.js';

export const AreaTypes = {
  left: 1,
  right: 2,
  top: 4,
  bottom: 8,
  topLeft: 4 + 1,
  topRight: 4 + 2,
  bottomLeft: 8 + 1,
  bottomRight: 8 + 2,
}

export const renderArea = ({sizing, stats, aes, scale, canvas, tooltip, chart}) => {

  if(tooltip.area === undefined) return;

  const {innerWidth, innerHeight, yAxisSpacing, padding} = sizing;
  const [{lim: xlim}, {lim: ylim}] = scale;

  const xmean = stats[aes[0]].mean;
  const ymean = stats[aes[1]].mean;
  const cx = ((xmean - xlim[0]) * innerWidth / (xlim[1] - xlim[0]));
  const cy = innerHeight - ((ymean - ylim[0]) * innerHeight / (ylim[1] - ylim[0]));

  const blockTypes = {
    left: [0, 0, cx, innerHeight],
    right: [cx, 0, innerWidth, innerHeight],
    top: [0, 0, innerWidth, cy],
    bottom: [0, cy, innerWidth, innerHeight],
    topLeft: [0, 0, cx, cy],
    topRight: [cx, 0, innerWidth - cx, cy],
    bottomLeft: [0, cy, cx, innerHeight - cy],
    bottomRight: [cx, cy, innerWidth - cx, innerHeight - cy]
  }

  blockTypes.left.type = AreaTypes.left;
  blockTypes.right.type = AreaTypes.right;
  blockTypes.top.type = AreaTypes.top;
  blockTypes.bottom.type = AreaTypes.bottom;
  blockTypes.topLeft.type = AreaTypes.topLeft;
  blockTypes.topRight.type = AreaTypes.topRight;
  blockTypes.bottomLeft.type = AreaTypes.bottomLeft;
  blockTypes.bottomRight.type = AreaTypes.bottomRight;

  const blocks = [[0, 0, innerWidth, innerHeight]];

  if (stats[aes[0]].mean && stats[aes[1]].mean === undefined) {
    blocks[0] = blockTypes.left;
    blocks[1] = blockTypes.right;
  }
  if (stats[aes[0]].mean === undefined && stats[aes[1]].mean) {
    blocks[0] = blockTypes.top;
    blocks[1] = blockTypes.bottom;
  }
  if (stats[aes[0]].mean && stats[aes[1]].mean) {
    blocks[0] = blockTypes.topLeft;
    blocks[1] = blockTypes.topRight;
    blocks[2] = blockTypes.bottomLeft;
    blocks[3] = blockTypes.bottomRight;
  }

  const handleClick = (b) => {
    chart.dispatchEvent(new CustomEvent('gg-chart-area-click', {detail: {
      areaType: b.type,
      aggr: stats.area[b.type]
    }}))
  }

  canvas.push(svg`
    <svg width="${innerWidth}" height="${innerHeight}" x="${yAxisSpacing + (padding / 2)}" y="${padding / 2}">
      ${repeat(blocks, (b, i) => `block-${i}`, (b) => svg`
        <rect
          style="fill: transparent;" @mouseenter="${ (e) => tooltip.area(e, b) }"
          x="${b[0]}"
          y="${b[1]}"
          width="${b[2]}"
          height="${b[3]}"
          @click="${() => handleClick(b)}"
          >
        </rect>
      `)}
    </svg>
  `);
}
