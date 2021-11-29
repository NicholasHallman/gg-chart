

export const chartSizes = (width, height, scale, coord, aes, legend) => {

  const longestBreak = scale[1].breaks.reduce((max, b) => b.toString().length > max ? b.toString().length : max, Number.NEGATIVE_INFINITY);
  const breakSize = (longestBreak * 8) + 15;

  let xAxisSpacing = Math.min(Math.max(width * 0.2, 100), 50);
  let yAxisSpacing = Math.min(Math.max(width * 0.2, 100), 50);

  if (coord.polar) {
    xAxisSpacing = 20;
    yAxisSpacing = 20;
  }

  if (breakSize > yAxisSpacing) {
    yAxisSpacing = breakSize;
  }

  let legendWidth = 0;
  if(aes.specialEntries().length !== 0 && legend !== undefined && !legend.includes('hidden')) {
    legendWidth = width * .25;
  }

  const padding = coord.polar ? 50 : 30;
  const chartWidth = width - yAxisSpacing - legendWidth;
  const chartHeight = height - xAxisSpacing;
  const innerWidth = chartWidth - padding;
  const innerHeight = chartHeight - padding;
  return {
    xAxisSpacing,
    yAxisSpacing,
    padding,
    chartWidth,
    chartHeight,
    innerWidth,
    innerHeight,
    legendWidth
  }
}
