import { svg } from "lit";
import { Axis as AxisComponent, Chart as ChartComponent } from "../../chartComponents.js";
import { getChartSizes } from "../../layoutHelpers.js";
import { LIFE_CYCLES, Query, System } from "../../system.js";


function renderYAxisValues({Axis, Chart}) {
  const { yMin, yMax, yTicks } = Axis;
  const { width, height } = Chart;

  const {axisSpacing, heightOfChart} = getChartSizes(width, height);

  const tickSpacing = (heightOfChart / yTicks) + 1;

  const values = Array(yTicks).fill(0).map((_, i) => {
    const range = yMax - yMin;
    const tick = range / (yTicks - 1);
    return Math.floor(tick * i);
  });

  Chart.canvas.push(svg`
    <svg width="${axisSpacing}" height="${heightOfChart}" x="0" y="0">
      ${
        values.map((v, i) => svg`<text text-anchor="end" x="${axisSpacing - 5}" y="${heightOfChart - (tickSpacing * i)}" width="${tickSpacing}" >${v}</text>`)
      }
    </svg>
  `);
}

export const yAxisValuesRenderSystem = new System(
  new Query().all([AxisComponent, ChartComponent]),
  renderYAxisValues,
  LIFE_CYCLES.RENDER
)
