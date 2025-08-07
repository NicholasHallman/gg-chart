/* eslint-disable no-param-reassign */
import { nothing, svg } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

const parse = geom => {
  if (geom === undefined || geom === null) return {};
  const geoms = geom.split(' ').map(term => term.split(':'));
  return geoms.reduce((obj, cur) => {
    obj[cur[0]] = cur[1] ?? true;
    return obj;
  }, {});
};

const renderLines = (points, tooltip) =>
  svg`${repeat(
    points,
    (_, i) => `line-${i}`,
    (p, i) => {
      if (i === points.length - 1) return nothing;
      const x1 = p.px;
      const y1 = p.py;
      const x2 = points[i + 1].px;
      const y2 = points[i + 1].py;
      return svg`
        <line
          @mouseenter="${tooltip.point ? tooltip.point : () => {}}"
          stroke="${p.color ? p.color : 'var(--gg-color-1)'}"
          class="point line"
          x1="${x1}"
          y1="${y1}"
          x2="${x2}"
          y2="${y2}"></line>
      `;
    }
  )}`;

const renderArea = (points, { innerHeight, innerWidth }, tooltip, coord) => {
  const polyPoints = (() => {
    // initialize the array with the first point in the axis intersection
    const poly = [];
    if (coord.polar !== undefined) {
      poly[0] = `${innerWidth / 2},${innerHeight / 2}`;
    } else {
      poly[0] = `0,${innerHeight}`;
    }
    return poly;
  })();

  points.forEach(p => {
    polyPoints.push(`${p.px},${p.py}`);
  });

  polyPoints.push(
    (() => {
      if (coord.flip !== undefined) {
        return `0,${points[points.length - 1].py}`;
      }
      if (coord.polar !== undefined) {
        return `${innerWidth / 2},${innerHeight / 2}`;
      }
      return `${points[points.length - 1].px},${innerHeight}`;
    })()
  );
  return svg`<polyline
    @mouseenter="${tooltip.point ? tooltip.point : () => {}}"
    fill="${points[0].color ? points[0].color : 'var(--gg-color-1)'}"
    class="point line"
    opacity="0.5"
    points="${polyPoints.join(' ')}"></polyline>
  `;
};

const renderPolarBar = (p, { innerWidth, innerHeight }, tooltip) => {
  const { theta, r, width, geom, color = 'var(--gg-color-1)', offset } = p;
  const x = innerWidth / 2;
  const y = innerHeight / 2;
  const percentFull = Math.round((theta * 100) / (Math.PI * 2));
  const parsedGeom = parse(geom);
  let barWidth;
  if (parsedGeom.bar === true) {
    barWidth = width - 2;
  } else {
    barWidth = parsedGeom.bar;
  }
  return svg`
    <circle
      @mouseenter="${e => (tooltip.point ? tooltip.point(e, p) : () => {})}"
      stroke="${color}"
      pathlength="100"
      class="polar-bar"
      stroke-dasharray="0 ${
        100 - percentFull - offset
      } ${percentFull} ${offset}"
      r="${r + width / 2}"
      cx="${x}"
      cy="${y}"
      style="stroke-width: ${barWidth};">
    </circle>
  `;
};

const renderBar = (p, tooltip) => {
  const {
    px,
    py,
    click,
    geom,
    width: pWidth,
    height: pHeight,
    host: { coord, scale, aes },
    color = 'var(--gg-color-1)',
  } = p;
  const parsedGeom = parse(geom);
  let barWidth;
  if (parsedGeom.bar === true) {
    barWidth = pWidth;
  } else {
    barWidth = parsedGeom.bar;
  }
  const rect = {
    x: !coord.flip ? px : 0,
    y: !coord.flip ? py : py - barWidth,
    width: !coord.flip ? barWidth : px,
    height: !coord.flip ? pHeight : barWidth,
  };
  const specialEntries =
    aes.specialEntries().length > 0
      ? `${p[aes.specialEntries()[0][1]]} ${p[aes[1]]}`
      : `${scale[1].name} ${p[aes[1]]}`;
  const label = `${scale[0].name} ${p[aes[0]]}, ${specialEntries}`;

  return svg`
    <rect
      @mouseenter="${e => (tooltip.point ? tooltip.point(e, p) : () => {})}"
      tabindex=0
      @click="${click}"
      @keypress="${click}"
      class="bar"
      x="${rect.x}"
      y="${rect.y}"
      width="${rect.width}"
      height="${rect.height}"
      fill="${color}"
      aria-label="${label}"
      ></rect>
  `;
};

const renderPoint = (p, sizing, tooltip) => {
  const r = 4;
  const { px, py, x, y, click, color = 'var(--gg-color-1)' } = p;
  return svg`
    <circle
      @mouseenter="${e => (tooltip.point ? tooltip.point(e, p) : () => {})}"
      tabindex=0
      fill="${color}"
      @click="${click}"
      @keypress="${click}"
      class="point"
      cx="${px}"
      cy="${py}"
      r="${r}"
      data-x="${x}"
      data-y="${y}">
    </circle>
  `;
};

const iteratePoints = (func, points, sizing, tooltip) =>
  svg`${repeat(
    points,
    (_, i) => `point-${i}`,
    p => func(p, sizing, tooltip)
  )}`;

const render = (points, sizing, coord, geom, tooltip) => {
  if (coord.polar) {
    if (geom.includes('bar'))
      return iteratePoints(renderPolarBar, points, sizing, tooltip);
  }
  if (geom.includes('point'))
    return iteratePoints(renderPoint, points, sizing, tooltip);
  if (geom.includes('bar'))
    return iteratePoints(renderBar, points, sizing, tooltip);
  if (geom.includes('line')) return renderLines(points, sizing, tooltip);
  if (geom.includes('area')) {
    return [
      renderArea(points, sizing, tooltip, coord),
      renderLines(points, sizing, tooltip),
    ];
  }
  return iteratePoints(renderPolarBar, points, sizing, tooltip);
};

export const renderPoints = ({
  canvas,
  data: { points },
  coord,
  geom,
  sizing,
  tooltip,
}) => {
  const { padding, innerHeight, innerWidth, yAxisSpacing } = sizing;
  canvas.push(svg`
    <svg width="${innerWidth}" height="${innerHeight}" x="${
    yAxisSpacing + padding / 2
  }" y="${padding / 2}" style="overflow: visible">
      ${render(points, sizing, coord, geom, tooltip)}
    </svg>
  `);
};
