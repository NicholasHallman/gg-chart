import { css } from "lit";

export default css`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');

  :host {
    --gg-color-1: #168FE6;
    --gg-color-2: #8AD934;
    --gg-color-3: #008EAB;
    --gg-color-4: #E87511;
    --gg-color-5: #9D1FD4;
    --gg-color-6: #D40067;
    --gg-color-7: #0057A3;
    --gg-color-8: #8982FF;
    --gg-color-9: #FFEF48;
    --gg-color-10: #FF70B0;
    --gg-color-11: #FFC102;
    --gg-color-12: #E6ABFF;
    --gg-color-13: #86509E;
    --gg-color-14: #EE7030;
    --gg-color-15: #D3E24A;
    --gg-color-16: #2DE2C0;
    --gg-color-17: #00B4D9;
    --gg-color-18: #5D5BC0;
    --gg-color-19: #F59036;
    --gg-color-20: #99CB5F;
    --gg-color-21: #5211FA;
    --gg-color-22: #004489;
    --gg-color-23: #00D2ED;
    --gg-color-24: #00A490;
    --gg-color-25: #2B8F44;
    --gg-color-26: #8CDE8A;
    --gg-color-27: #70FAE0;
    --gg-color-28: #8FD1FF;
    --gg-color-29: #2CBA9A;
    --gg-color-30: #FF9EA0;
    --gg-color-31: #FFDB8A;
    --gg-color-32: #F5318F;
    --gg-color-33: #E1FFB5;
    --gg-color-34: #A7FAE7;
    --gg-color-35: #C7FDFF;
    --gg-color-36: #E9E6FF;
    --gg-color-37: #6900A0;
    --gg-color-38: #E9428D;
    --gg-color-39: #FFE2DB;
    --gg-color-40: #FFAB61;

    --gg-color-tooltip-background: #494C4E;
    --gg-color-tooltip-color: #F9FBFF;
  }

  .axis {
    stroke: var(--d2l-color-galena);
    fill: transparent;
    transition: transform .5s;
  }
  .guide {
    stroke: var(--d2l-color-mica);
    fill: transparent;
  }

  .point {
    transition: cx .5s, cy .5s;
  }
  .point.line {
    stroke-width: 2;
  }
  .bar {
    transition: height .5s,  width .5s, x .5s, y .5s;
  }
  .polar-bar {
    transition: stroke-dasharray .5s;
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
  .legend-container{
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
`;
