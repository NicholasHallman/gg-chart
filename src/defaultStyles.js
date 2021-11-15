import { css } from "lit";
import '@brightspace-ui/core/components/colors/colors.js';

export const defaultChartStyles = css`
  text {
    font-family: 'Lato', sans-serif;
  }

  rect.point {
    fill: var(--d2l-color-celestine);
    stroke: var(--d2l-color-celestine);
    stroke-width: 1;
    transition: height .4s;
  }

`;
