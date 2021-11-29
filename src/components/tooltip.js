import { css, html, LitElement } from "lit";


class Tooltip extends LitElement {
  static get properties() {
    return {
      x: {attribute: true, type: Number},
      y: {attribute: true, type: Number},
      show: {attribute: true, type: Boolean},
      top: {attribute: true, type: Number},
      left: {attribute: true, type: Number},
      message: {attribute: true, type: String}
    }
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        transform: translate(-50%, -100%);
        z-index: 10000;
        pointer-events: none;
      }
      .gg-tooltip-container {
        user-select: none;
        position: relative;
        background-color: var(--gg-color-tooltip-background);
        color: white;
        transition: transform .2s;
        padding: 2px 10px;
        border-radius: 3px;
        max-width: 250px;
      }

      .tail {
        position: absolute;
        display: block;
        width: 10px;
        height: 10px;
        background-color: var(--gg-color-tooltip-background);
        transform: translate(-50%, -50%) rotate(45deg);
        bottom: -10px;
        left: 50%; right: 50%;
        z-index: -1;
      }

      .message {
        font-size: 12px;
        white-space: pre-line;
      }
    `;
  }

  render() {
    return html`
      <div class="gg-tooltip-container" style="transform: translate(${this.x}px, ${this.y}px); display: ${this.show ? 'block' : 'none'}">
        <div class="tail"></div>
        <span class="message">${this.message}</span>
      </div>
    `
  }
}

customElements.define('gg-chart-tooltip', Tooltip);
