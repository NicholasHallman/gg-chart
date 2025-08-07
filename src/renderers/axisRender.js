import { nothing, svg } from 'lit';

const renderPolarAxis = ({ scale, canvas, coord, sizing }) => {
  const {
    chartWidth,
    chartHeight,
    yAxisSpacing,
    innerWidth,
    innerHeight,
    padding,
  } = sizing;

  const axisRadius = Math.min(innerWidth / 2, innerHeight / 2);
  const center = {
    x: chartWidth / 2,
    y: chartHeight / 2,
  };

  const thetaBreaks =
    coord.polar === true || coord.polar === 'x'
      ? scale[0].breaks
      : scale[1].breaks;
  const radiusBreaks =
    coord.polar === true || coord.polar === 'x'
      ? scale[1].breaks
      : scale[0].breaks;
  const xname = coord.polar === 'y' ? scale[0].name : scale[1].name;
  const yname = coord.polar === 'y' ? scale[1].name : scale[0].name;
  canvas.push(svg`
    <svg style="overflow: visible" width="${chartWidth}" height="${chartHeight}" x="${yAxisSpacing}">
      <!-- Break Lines -->
      <!-- radius -->
      ${radiusBreaks.map(
        (b, i) =>
          svg`<circle class="guide guide-x" cx="${center.x}" cy="${
            center.y
          }" r="${(axisRadius / (radiusBreaks.length - 1)) * i}"></circle>`
      )}
      ${radiusBreaks.map(
        (b, i) => svg`<line
                                          class="guide guide-x"
                                          x1="${center.x}"
                                          y1="${
                                            center.y -
                                            (axisRadius /
                                              (radiusBreaks.length - 1)) *
                                              i
                                          }"
                                          x2="${
                                            center.x - (axisRadius + padding)
                                          }"
                                          y2="${
                                            center.y -
                                            (axisRadius /
                                              (radiusBreaks.length - 1)) *
                                              i
                                          }">
                                        </line>
                                        <text class="axis-label axis-x" font-size="8" x="${
                                          center.x - (axisRadius + padding)
                                        }" y="${
          center.y - (axisRadius / (radiusBreaks.length - 1)) * i
        }">${b}</text>`
      )}
      <!-- theta -->
      ${thetaBreaks.map((b, i) => {
        const angle = (i / (thetaBreaks.length - 1)) * (Math.PI * 2);
        const labelRadius = Math.min(
          (chartWidth - padding / 2) / 2,
          (chartHeight - padding / 2) / 2
        );
        const p = {
          x: axisRadius * Math.cos(angle) + center.x,
          y: center.y - axisRadius * Math.sin(angle),
        };
        const textp = {
          x: labelRadius * Math.cos(angle) + center.x,
          y: center.y - labelRadius * Math.sin(angle),
        };
        let firstLastMod = 0;
        if (i === 0) firstLastMod = b.toString().length * -8;
        else if (i === thetaBreaks.length - 1)
          firstLastMod = (b.toString().length / 2) * 8 + 4;
        const firstLastModX = firstLastMod * Math.sin(angle);
        const firstLastModY = firstLastMod * Math.cos(angle);
        return svg`
          <line class="guide guide-y axis-y" x1="${center.x}" y1="${
          center.y
        }" x2="${p.x}" y2="${p.y}"></line>
          <text class="axis-y" text-anchor="middle" dominant-baseline="middle" x="${
            textp.x + firstLastModX
          }" y="${textp.y + firstLastModY}">${b}</text>
        `;
      })}

      <circle class="axis" cx="${center.x}" cy="${
    center.y
  }" r="${axisRadius}"></circle>
      <line class="axis" x1="${center.x + axisRadius + 15}" y1="${
    center.y
  }" x2="${center.x}" y2="${center.y}"></line>
      <text class="axis-y" text-anchor="middle" class="axis-name" style="transform: translate(${
        center.x - (axisRadius + padding + 10)
      }px, ${chartHeight / 4 + 8}px) rotate(-90deg)">${xname}</text>
      <text class="axis-x" text-anchor="middle" class="axis-name" style="transform: translate(${
        center.x
      }px, ${chartHeight + 16}px)">${yname}</text>
    </svg>
  `);
};

const renderCartesianAxis = ({ width, scale, canvas, sizing }) => {
  const {
    chartWidth,
    chartHeight,
    yAxisSpacing,
    padding,
    innerWidth,
    innerHeight,
  } = sizing;
  const [{ breaks: xbreaks, name: xname }, { breaks: ybreaks, name: yname }] =
    scale;
  // render lines
  canvas.push(svg`
    <svg width="${chartWidth}" height="${chartHeight}" x="${yAxisSpacing}">
      <line x1="${padding / 2}" y1="${chartHeight - padding / 2}" x2="${
    innerWidth + padding / 2
  }" y2="${chartHeight - padding / 2}" class="axis"></line>

      <line x1="${padding / 2}" y1="${padding / 2}" x2="${padding / 2}" y2="${
    chartHeight - padding / 2
  }" class="axis"></line>
    </svg>

    <svg width=${width} height=${chartHeight}>
      <text aria-hidden="true" class="axis-name" text-anchor="middle" style="transform: translate(30px, 50%) rotate(-90deg)">${yname}</text>
    </svg>
    <svg width=${chartWidth} height=50px x="${yAxisSpacing}" y="${chartHeight}">
      <text aria-hidden="true" class="axis-name" text-anchor="middle" x="50%" y="30">${xname}</text>
    </svg>
    <!-- render breaks -->
    <svg width="${chartWidth}" height="50px" x=${
    yAxisSpacing + padding / 2
  } y="${chartHeight - padding / 2}" style="overflow: visible">
      ${xbreaks.map(
        (b, i) =>
          svg`<text aria-hidden="true" class="break break-x" text-anchor="middle" y="16" x="${
            (innerWidth / (xbreaks.length - 1)) * i
          }" >${b}</text>`
      )}
    </svg>

    <svg width="${innerWidth}" height="${innerHeight}" x=${
    yAxisSpacing + padding / 2
  } y="${padding / 2}" style="overflow: visible">
      ${xbreaks.map((b, i) =>
        i !== 0
          ? svg`<line class="guide guide-x" x1="${
              (innerWidth / (xbreaks.length - 1)) * i
            }" y1="0%" x2="${
              (innerWidth / (xbreaks.length - 1)) * i
            }" y2="100%"></line>`
          : nothing
      )}
    </svg>

    <svg width="100" height="${chartHeight + padding}" x=${
    yAxisSpacing + padding / 4
  } y="${padding / 2}" style="overflow: visible">
      ${ybreaks.map(
        (b, i) =>
          svg`<text aria-hidden="true" class="break break-y" text-anchor="end" y="${
            innerHeight - (innerHeight / (ybreaks.length - 1)) * i + 4
          }" x="0" >${b}</text>`
      )}
    </svg>

    <svg width="${innerWidth}" height="${innerHeight}" x=${
    yAxisSpacing + padding / 2
  } y="${padding / 2}" style="overflow: visible">
      ${ybreaks.map((b, i) =>
        i !== 0
          ? svg`<line class="guide guide-y" y1="${
              innerHeight - (innerHeight / (ybreaks.length - 1)) * i
            }" x1="0%" y2="${
              innerHeight - (innerHeight / (ybreaks.length - 1)) * i
            }" x2="100%"></line>`
          : nothing
      )}
    </svg>
  `);
};

export const renderAxis = host => {
  if (host.coord.polar) {
    renderPolarAxis(host);
  } else {
    renderCartesianAxis(host);
  }
};
