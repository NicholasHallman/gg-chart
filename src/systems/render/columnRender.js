/* eslint-disable no-param-reassign */
import { svg } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { Axis as AxisComponent, Chart as ChartComponent, Column as ColumnComponent } from '../../chartComponents.js';
import { getChartSizes } from '../../layoutHelpers.js';
import { LIFE_CYCLES, Query, System } from '../../system.js'

function renderColumns({Column, Axis, Chart}) {

  const {width, height, component} = Chart;
  const {data, style} = Column;
  const {yMin, yMax} = Axis;

  const { axisSpacing, widthOfChart } = getChartSizes(width, height);
  const heightOfChart = getChartSizes(width, height).heightOfChart - 9;
  const handleClick = (e) =>
    component.dispatchEvent(new CustomEvent('composite-chart-point-click', {
      detail: {
        x: e.target.getAttribute('data-x'),
        y: e.target.getAttribute('data-y')
      }
    }));

  Chart.canvas.push(
    svg`
      <svg width="${widthOfChart}" height="${heightOfChart}" x="${axisSpacing}" y="9">
        ${ repeat(data, (d, i) => i, (d, i) => {
          const barWidth = Math.round(widthOfChart / data.length);

          let color;
          let stroke;

          if (style.fill.constructor.name === 'Array') {
            color = style.fill[i % style.fill.length];
          } else if (typeof style.fill === 'string') {
            color = style.fill;
          }

          if (style.stroke.length === 0) {
            stroke = color;
          } else if (style.stroke.constructor.name === 'Array') {
            stroke = style.stroke[i % style.stroke.length];
          } else if (typeof style.stroke === 'string') {
            stroke = style.stroke;
          }


          let barHeight = (d / (yMax - yMin)) * heightOfChart
          if (barHeight === 0) barHeight = style.minHeight;
          return svg`
            <rect
              @click="${handleClick}"
              @keypress="${handleClick}"
              tabindex="0"
              class="point"
              style="transform: translateY(${heightOfChart}px) rotate(180deg) translateX(-${barWidth * (i + 1)}px); fill: ${color}; stroke: ${stroke}"
              data-x="${i}"
              data-y="${d}"
              height="${barHeight}px"
              color="${color}"
              width="${barWidth - (style.spacing / 2)}"
            >
            </rect>`
        })}
      </svg>
    `
  );
}

export const columnRenderSystem = new System(
  new Query().all([AxisComponent, ChartComponent, ColumnComponent]),
  renderColumns,
  LIFE_CYCLES.RENDER
)
