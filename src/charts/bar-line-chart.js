import { html, css, nothing } from 'lit';
import { Chart } from '../chart.js';
import { Axis, Column, Chart as Base, Categories, Line } from '../chartComponents.js';
import { yAxisColumnPopulator } from '../systems/connected/yAxisColumnPopulator.js';
import { axisRenderSystem } from '../systems/render/axisRender.js';
import { columnRenderSystem } from '../systems/render/columnRender.js';
import { lineRenderSystem } from '../systems/render/lineRender.js';
import { xAxisCategoryRenderSystem } from '../systems/render/xAxisCategories.js';
import { yAxisValuesRenderSystem } from '../systems/render/yAxisValues.js';
import { updateYAxisColumnValuesSystem } from '../systems/update/updateYAxis.js';

export class BarLineChart extends Chart(
  [Base, Axis, Column, Categories, Line], // Components
  [axisRenderSystem, xAxisCategoryRenderSystem, yAxisValuesRenderSystem, yAxisColumnPopulator, columnRenderSystem, updateYAxisColumnValuesSystem, lineRenderSystem ] // Systems
  ) {

  static get properties() {
    return {
      debug: { type: Boolean },
      ...super.properties
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
      }
    `;
  }

  render() {
    return html`
      ${super.render()}
      ${this.debug ? this.renderDebug() : nothing}
    `;
  }

  renderDebug(){
    const getData = (component) =>
      Object.keys(this.getComponent(component)._data).map(key => html`<br>&nbsp;&nbsp;${key}: ${this.getComponent(component)._data[key]}`);

    return html`
      <div>
        <p>Axis: ${getData(Axis)}</p>
        <p>Column: ${getData(Column)}</p>
      </div>
    `;
  }
}
