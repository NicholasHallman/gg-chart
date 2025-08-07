import { css, html, LitElement } from 'lit';
import {
  bodyStandardStyles,
  heading3Styles,
} from '@brightspace-ui/core/components/typography/styles';
import { chartSizes } from './sizing.js';
import { renderAxis } from './renderers/axisRender.js';
import { renderPoints } from './renderers/pointRender.js';
// import { renderLabels } from './renderers/labelRender.js';
import { renderArea } from './renderers/areaRender.js';
import { legendRender } from './renderers/legendRender.js';
import themes from './themes/index.js';
import '@brightspace-ui/core/components/colors/colors';
import '@brightspace-ui/core/components/typography/typography';
import { statsRender } from './renderers/statsRenderer.js';
import { Pipeline } from './pipeline.js';
import './components/tooltip.js';

class GGChart extends LitElement {
  static get properties() {
    return {
      aes: { attribute: true, type: String },
      scale: { attribute: true, type: Array },
      geom: { attribute: true, type: String },
      coord: { attribute: true, type: String },
      theme: { attribute: true, type: String },
      style: { attribute: true, type: String },
      stat: { attribute: true, type: String },
      pos: { attribute: true, type: String },
      width: { attribute: true, type: Number },
      height: { attribute: true, type: Number },
      data: { attribute: true, type: Array },
      tooltip: { attribute: true, type: String },
      legend: { attribute: true, type: String },
      _tooltipX: { attribute: false },
      _tooltipY: { attribute: false },
      _showTooltip: { attribute: false },
      _tooltipMessage: { attribute: false },
    };
  }

  static get styles() {
    return [
      bodyStandardStyles,
      heading3Styles,
      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        h3 {
          font-family: lato;
          margin-bottom: 5px;
        }

        .sbs {
          position: relative;
          display: flex;
        }
      `,
    ];
  }

  constructor() {
    super();

    this.renderers = [
      renderAxis,
      renderArea,
      statsRender,
      renderPoints,
      legendRender,
      // renderLabels TODO make labels useful.
    ];
    this.pipeline = new Pipeline(this);
    this.width = 300;
    this.height = 150;
    this._showTooltip = false;
  }

  connectedCallback() {
    this.chartStyles = themes[this.theme];
    this.legend = this.legend ?? '';

    this.resizeObserver = new ResizeObserver(entries => {
      if (this.width !== entries[0].contentRect.width) {
        this.width = entries[0].contentRect.width;
      }
      if (Math.floor(entries[0].contentRect.height - this.height) !== 48) {
        console.log(Math.floor(entries[0].contentRect.height - this.height));
        // this.height = entries[0].contentRect.height;
      }
    });
    this.resizeObserver.observe(this);
    super.connectedCallback();
  }

  update() {
    super.update();
  }

  handleMouseLeave() {
    this._showTooltip = false;
  }

  render() {
    this.canvas = [];
    this.legendCanvas = [];
    ({
      width: this.transformedGrammar.width,
      height: this.transformedGrammar.height,
      canvas: this.transformedGrammar.canvas,
      legendCanvas: this.transformedGrammar.legendCanvas,
    } = this);
    const sizing = chartSizes(
      this.width,
      this.height,
      this.transformedGrammar.scale,
      this.transformedGrammar.coord,
      this.transformedGrammar.aes,
      this.legend
    );
    this.transformedGrammar.sizing = sizing;
    this.transformedGrammar.chart = this;
    this.renderers.forEach(renderFunc => renderFunc(this.transformedGrammar));
    const chartWidth =
      this.legendCanvas.length > 0 && !this.legend.includes('hidden')
        ? this.width - Math.min(this.width / 4, 100)
        : this.width;
    return html`
      ${this.title &&
      html`<h3 class="d2l-heading-3 d2l-typography">${this.title}</h3>`}
      <div
        class="sbs"
        style="width: ${this.width}px"
        @mouseleave="${this.handleMouseLeave}"
      >
        <svg width="${chartWidth}" height="${this.height}">
          <style>
            ${this.chartStyles}
            ${this.style}
          </style>
          ${this.canvas}
        </svg>
        <div
          class="legend"
          style="width: ${this.width / 4}px; max-width: 100px; display: ${this
            .legendCanvas.length > 0 && !this.legend.includes('hidden')
            ? 'block'
            : 'none'}"
        >
          ${this.legendCanvas}
        </div>
        <gg-chart-tooltip
          style="top: ${sizing.padding / 2}px; left: ${sizing.yAxisSpacing +
          sizing.padding / 2}px"
          ?show="${this._showTooltip}"
          x="${this._tooltipX}"
          y="${this._tooltipY}"
          message="${this._tooltipMessage}"
        >
        </gg-chart-tooltip>
      </div>
    `;
  }
}

customElements.define('gg-chart', GGChart);
