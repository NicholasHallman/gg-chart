/* eslint-disable no-param-reassign */
import { chartSizes } from './sizing.js';

const COLORS = Array(11)
  .fill(0)
  .map((_, i) => `var(--gg-color-${i + 1})`);

export const runProjection = (host, chart) => {
  const { aes, scale, data, geom, width, height, coord, pos, stats, legend } =
    host;
  const { innerHeight, innerWidth } = chartSizes(
    width,
    height,
    scale,
    coord,
    aes,
    legend
  );

  const xlim = scale[0].lim;
  const ylim = scale[1].lim;

  const stack = {};

  const points = data.map(r => {
    const point = {
      host,
      px: 0,
      py: 0,
      geom,
      keys: [...aes],
      width: 0,
      makeDetail() {
        return this.keys.reduce((obj, key) => {
          obj[key] = this[key];
          return obj;
        }, {});
      },
      click: () => {
        chart.dispatchEvent(
          new CustomEvent('gg-chart-point-click', { detail: { point } })
        );
      },
    };
    aes.forEach(a => {
      point[a] = r[a];
    });

    if (coord.flip) {
      // Flip projection
      point.px = ((point[aes[0]] - xlim[0]) * innerWidth) / (xlim[1] - xlim[0]);
      point.py =
        innerHeight -
        ((point[aes[1]] - ylim[0]) * innerHeight) / (ylim[1] - ylim[0]);
      point.width = innerHeight / data.length;

      const limDiff = scale[1].lim[1] - scale[1].lim[0];
      const breakSize = limDiff / (scale[1].breaks.length - 1);

      point.width = geom.includes('bar')
        ? innerHeight / (limDiff / breakSize) - 2
        : 0;
    } else if (coord.polar) {
      // Polar projections
      if (coord.polar === 'x' || coord.polar === true) {
        const xValue = r[aes[0]] - xlim[0];
        const yValue = r[aes[1]] - ylim[0];
        const maxRadius = Math.min(innerWidth / 2, innerHeight / 2);
        point.theta = (xValue * (Math.PI * 2)) / (xlim[1] - xlim[0]);
        point.r = (yValue * maxRadius) / (ylim[1] - ylim[0]);
        point.offset = 0;

        point.px = point.r * Math.cos(point.theta) + innerWidth / 2;
        point.py = innerHeight / 2 - point.r * Math.sin(point.theta);

        point.width = maxRadius / data.length;
      } else if (coord.polar === 'y') {
        const xValue = r[aes[0]] - xlim[0];
        const yValue = r[aes[1]] - ylim[0];

        const maxRadius = Math.min(innerWidth / 2, innerHeight / 2);
        point.theta = (yValue * (Math.PI * 2)) / (ylim[1] - ylim[0]);
        point.r = (xValue * maxRadius) / (xlim[1] - xlim[0]);
        if (aes[1] === 'aggr') {
          point.r = 0;
        }
        point.offset = 0;

        point.px = point.r * Math.cos(point.theta) + innerWidth / 2;
        point.py = innerHeight / 2 - point.r * Math.sin(point.theta);

        point.width = aes[1] === 'aggr' ? maxRadius : maxRadius / data.length;
      }
    } else {
      // Cartesian Projection
      point.px = ((point[aes[0]] - xlim[0]) * innerWidth) / (xlim[1] - xlim[0]);
      point.py =
        innerHeight -
        ((point[aes[1]] - ylim[0]) * innerHeight) / (ylim[1] - ylim[0]);
      const limDiff = scale[0].lim[1] - scale[0].lim[0];
      const breakSize = limDiff / (scale[0].breaks.length - 1);

      point.width = geom.includes('bar')
        ? innerWidth / (limDiff / breakSize) - 2
        : 0;
      point.height = innerHeight - point.py;
    }

    if (aes.specialEntries().length !== 0) {
      if (aes.color) {
        const colorValues = Array.from(
          new Set(data.map(re => re[aes.color]))
        ).sort((a, b) => a - b);
        point.color = COLORS[colorValues.indexOf(r[aes.color])];
      } else {
        [point.color] = COLORS;
      }
      if (aes.color && geom.includes('bar')) {
        if (pos.dodge) {
          const key = point.px;
          if (stack[key] === undefined) {
            stack[key] = 0;
          }
          // adjacent bar chart
          point.px += stack[key];
          point.width /= stats[aes[1]].parts;
          stack[key] += point.width;
        } else if (
          (pos.stacked || (!pos.stacked && !pos.dodge)) &&
          !coord.polar
        ) {
          // stacked bar chart
          if (stack[point.px] === undefined) {
            stack[point.px] = point.height;
          } else {
            point.py -= stack[point.px];
            stack[point.px] += point.height;
          }
        } else if (
          (pos.stacked || (!pos.stacked && !pos.dodge)) &&
          coord.polar
        ) {
          if (stack[point.r] === undefined) {
            stack[point.r] = 0;
          }
          point.offset += stack[point.r];
          stack[point.r] += (point.theta / (Math.PI * 2)) * 100;

          point.width *=
            stats[aes[1]]?.parts ?? Math.min(innerWidth / 2, innerHeight / 2);
        }
      }
    }

    return point;
  });

  host.data.points = points;
  return host;
};
