import { svg } from 'lit';
import { Axis as AxisComponent, Chart as ChartComponent } from "../../chartComponents.js";
import { getChartSizes } from '../../layoutHelpers.js';
import { LIFE_CYCLES, Query, System } from "../../system.js";


function renderAxis({Axis, Chart}) {
  const { xTitle, yTitle} = Axis;
  const { width, height } = Chart;

  const {axisSpacing, widthOfChart, heightOfChart} = getChartSizes(width, height);

  Chart.canvas.push(svg`
    <svg width="${widthOfChart}" height="${heightOfChart}" x="${axisSpacing}" y="0">
      <line x1="0" y1="100%" x2="100%" y2="100%" stroke="black" stroke-width="1"></line>

      <line x1="0" y1="0" x2="0" y2="100%" stroke="black" stroke-width="1"></line>
    </svg>

    <svg width="100%" height="${heightOfChart}">
      <text text-anchor="middle" transform="translate(12, ${heightOfChart / 2}), rotate(-90)">${yTitle}</text>
    </svg>

    <svg width="${widthOfChart}" height="100%" x="${axisSpacing}">
      <text text-anchor="middle" x="50%" y="100%">${xTitle}</text>
    </svg>
  `);
}

export const axisRenderSystem = new System(
  new Query().all([AxisComponent, ChartComponent]),
  renderAxis,
  LIFE_CYCLES.RENDER
)
