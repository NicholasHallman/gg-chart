import { css } from 'lit';

export default css`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');

  :host {
    --gg-color-1: #46a661;
    --gg-color-2: #e87511;
    --gg-color-3: #cd2026;
    --gg-color-4: #e87511;
    --gg-color-5: #9d1fd4;
    --gg-color-6: #168fe6;
    --gg-color-7: #0057a3;
    --gg-color-8: #8982ff;
    --gg-color-9: #ffef48;
    --gg-color-10: #ff70b0;
    --gg-color-11: #ffc102;
    --gg-color-12: #e6abff;
    --gg-color-13: #86509e;
    --gg-color-14: #ee7030;
    --gg-color-15: #d3e24a;
    --gg-color-16: #2de2c0;
    --gg-color-17: #00b4d9;
    --gg-color-18: #5d5bc0;
    --gg-color-19: #f59036;
    --gg-color-20: #99cb5f;
    --gg-color-21: #5211fa;
    --gg-color-22: #004489;
    --gg-color-23: #00d2ed;
    --gg-color-24: #00a490;
    --gg-color-25: #8ad934;
    --gg-color-26: #8cde8a;
    --gg-color-27: #70fae0;
    --gg-color-28: #8fd1ff;
    --gg-color-29: #2cba9a;
    --gg-color-30: #ff9ea0;
    --gg-color-31: #ffdb8a;
    --gg-color-32: #f5318f;
    --gg-color-33: #e1ffb5;
    --gg-color-34: #a7fae7;
    --gg-color-35: #c7fdff;
    --gg-color-36: #e9e6ff;
    --gg-color-37: #6900a0;
    --gg-color-38: #e9428d;
    --gg-color-39: #ffe2db;
    --gg-color-40: #ffab61;

    --gg-color-tooltip-background: #494c4e;
    --gg-color-tooltip-color: #f9fbff;
  }

  .axis {
    stroke: var(--d2l-color-galena);
    fill: transparent;
    transition: transform 0.5s;
  }
  .guide {
    stroke: var(--d2l-color-mica);
    fill: transparent;
  }

  .point {
    transition: cx 0.5s, cy 0.5s;
  }
  .point.line {
    stroke-width: 2;
  }
  .bar {
    transition: height 0.5s, width 0.5s, x 0.5s, y 0.5s;
  }
  .polar-bar {
    transition: stroke-dasharray 0.5s;
    fill: transparent;
  }
  .axis-name {
    fill: black;
    color: black;
  }

  text {
    font-family: 'Lato', sans-serif;
  }

  .break {
    font-size: 12px;
  }

  p {
    font-family: 'Lato', sans-serif;
  }
  .legend-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .legend-item {
    font-size: 12px;
    display: flex;
    align-items: center;
    margin: 2px 0px;
    margin-right: 2px;
  }
  .legend-title {
    width: 100%;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .legend-color {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin-right: 5px;
  }
  .notransition {
    transition: none !important;
  }
`;
