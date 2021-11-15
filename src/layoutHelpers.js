
export const getChartSizes = (width, height) => {
  let axisSpacing = Number(width) * 0.1;
  if(axisSpacing < 40) {
    axisSpacing = 40;
  } else if(axisSpacing > 50) {
    axisSpacing = 50;
  }
  return {
    axisSpacing,
    widthOfChart: Number(width) - axisSpacing,
    heightOfChart: Number(height) - axisSpacing,
  }
}
