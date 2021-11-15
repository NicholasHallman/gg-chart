import { nothing, svg } from "lit";
import { repeat } from 'lit/directives/repeat.js';
import { Axis as AxisComponent, Chart as ChartComponent, Line as LineComponent } from "../../chartComponents.js";
import { LIFE_CYCLES, Query, System } from "../../system.js";
import { getChartSizes } from '../../layoutHelpers.js';

function lineRenderer({Line, Chart, Axis}) {
  const {data, styles} = Line;
  const {width, height} = Chart;
  const {yMin, yMax} = Axis;

  const { axisSpacing, widthOfChart, heightOfChart } = getChartSizes(width, height);
  const dataWidth = Math.round(widthOfChart / data.length);

  Chart.canvas.push(svg`
    <svg width="${widthOfChart}" height="${heightOfChart}" x="${axisSpacing}">
      ${repeat(data, (_, i) => i, (d, i) => {
        if(i === data.length - 1) return nothing;

        const point1Height = (d / (yMax - yMin)) * heightOfChart;
        const point2Height = (data[i+1] / (yMax - yMin)) * heightOfChart;
        const p1 = {x: i * dataWidth, y: heightOfChart - point1Height};
        const p2 = {x: (i + 1) * dataWidth, y: heightOfChart - point2Height};
        return svg`<line
          x1="${p1.x}"
          y1="${p1.y}"
          x2="${p2.x}"
          y2="${p2.y}"
          stoke="var(--d2l-color-celestine)"
        ></line>`
      })}
    </svg>
  `);
}

export const lineRenderSystem = new System(
  new Query().all([LineComponent, ChartComponent, AxisComponent]),
  lineRenderer,
  LIFE_CYCLES.RENDER
)
