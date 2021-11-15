import { svg } from "lit";
import { Categories as CategoryComponent, Chart as ChartComponent } from "../../chartComponents.js";
import { getChartSizes } from "../../layoutHelpers.js";
import { LIFE_CYCLES, Query, System } from "../../system.js";

function renderXAxisCategories({Categories, Chart}) {
  const { width, height } = Chart;
  const { labels } = Categories;

  const {axisSpacing, widthOfChart, heightOfChart} = getChartSizes(width, height);

  const tickSpacing = widthOfChart / (labels.length);

  Chart.canvas.push(svg`
    <svg width="${widthOfChart}" height="${axisSpacing}" x="${axisSpacing}" y="${heightOfChart}">
      ${
        labels.map((l, i) => svg`<text text-anchor="middle" x="${(i * tickSpacing) + (tickSpacing / 2)}" y="16" width="${tickSpacing}" >${l}</text>`)
      }
    </svg>
  `);
}
export const xAxisCategoryRenderSystem = new System(
  new Query().all([ChartComponent, CategoryComponent]),
  renderXAxisCategories,
  LIFE_CYCLES.RENDER
)
