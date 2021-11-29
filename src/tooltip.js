import { html } from "lit";
import { AreaTypes } from "./renderers/areaRender";

const parse = (tooltip) =>
  tooltip.split(',').map(type => type.trim());

// area: "X: < {xmean} aes[0], > {ymean} aes[1]"
// point: ""

// 00000001 = < x
// 00000010 = > x
// 00000100 = < y
// 00001000 = > y

const phrases = [];
phrases[0] = () => '';
phrases[AreaTypes.left] = (aes, stats) => `< ${Math.round(stats[aes[0]].mean)} ${aes[0]}`;
phrases[AreaTypes.right] = (aes, stats) => `> ${Math.round(stats[aes[0]].mean)} ${aes[0]}`;
phrases[AreaTypes.top] = (aes, stats) => `> ${Math.round(stats[aes[1]].mean)} ${aes[1]}`;
phrases[AreaTypes.bottom] = (aes, stats) => `< ${Math.round(stats[aes[1]].mean)} ${aes[1]}`;

const areaMessageDefault = (b, aes, stats) => {
  const { type } = b;
  const xPhrase = phrases[type & 3](aes, stats);
  const yPhrase = phrases[type & 12](aes, stats);
  if(xPhrase !== '' && yPhrase === '') {
    return `${stats.area[type]} ${xPhrase}`
  }
  if(xPhrase === '' && yPhrase !== '') {
    return `${stats.area[type]} ${yPhrase}`
  }
  return `${stats.area[type]} ${xPhrase} \n ${yPhrase}`

}

const pointMessageDefault = (p, aes) =>
  `${aes[0]} ${p[aes[0]]}, ${aes[1]} ${p[aes[1]]}`;

const handleTooltipArea = (e, b, chart, {aes, stats}) => {
  chart._tooltipX = (b[0] + (b[2] / 2));
  chart._tooltipY = (b[1] + (b[3] / 2)) - 20;
  chart._showTooltip = true;
  const typeName = Object.entries(AreaTypes).find(([key, value]) => value === b.type)[0]
  chart._tooltipMessage = chart.toolTipAreaFormatter ? chart.toolTipAreaFormatter(typeName, stats.area[b.type]) : areaMessageDefault(b, aes, stats);
}

const handleTooltipPoint = (e, p, chart, {aes, coord}) => {
  const xMod = coord === undefined || !coord.includes('flip') ? (p.width / 2) : 0
  const yMod = coord !== undefined && coord.includes('flip') ? p.width : 20
  chart._tooltipX = p.px + xMod;
  chart._tooltipY = p.py - yMod;
  chart._showTooltip = true;

  chart._tooltipMessage = chart.toolTipPointFormatter ? chart.toolTipPointFormatter(p) : pointMessageDefault(p, aes);
}

export function runTooltip(host, chart) {
  const {tooltip} = host;
  if(tooltip === undefined) {
    host.tooltip = {};
    return host;
  }
  const parsed = parse(tooltip)

  if(parsed.includes('area')) {
    parsed.area = (e, b) => handleTooltipArea(e, b, chart, host);
  } else if(parsed.includes('point')) {
    parsed.point = (e, p) => handleTooltipPoint(e, p, chart, host);
  }

  if (chart._showTooltip) {

  }

  host.tooltip = parsed;
  return host;
}
