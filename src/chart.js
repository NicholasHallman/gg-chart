/* eslint-disable no-param-reassign */
import { html, css, LitElement } from 'lit';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import Components, {Changed, Chart as Base} from "./chartComponents.js";
import { defaultChartStyles } from './defaultStyles.js';
import { LIFE_CYCLES } from './system.js';

// Converts a camelCase string to kebab-case
export const toKebabCase = (string) => {
	let newString = string;
	for (let i = 0; i < newString.length; i += 1) {
		const code = newString.charCodeAt(i);
		if (code >= 65 && code <= 90) {
			if (i !== 0) {
				newString = `${newString.slice(0, i)}-${String.fromCharCode(code + 32)}${newString.slice(i + 1)}`;
			} else {
				// if the first letter is capitalized don't add a hyphen.
				newString = `${String.fromCharCode(code + 32)}${newString.slice(i + 1)}`;
			}
		}
	}
	return newString;
};

export const Chart = (initialComponents, initialSystems) => class C extends LitElement {

  static get properties() {
    const archetype = {};
    initialComponents.forEach(Component => {
      archetype[Component.name] = { type: Object, attribute: toKebabCase(Component.name)};
    })
    return archetype;
  }

  static get styles() {
    return [ heading1Styles, css`

      @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');

      .column:focus {
        outline: black 3px;
      }
    `]
  }

    constructor() {
      super();
      this.components = [];
      this.systems = initialSystems.reduce((obj, s) => {
        if(obj[s.lifecycle] === undefined) obj[s.lifecycle] = [];
        obj[s.lifecycle].push(s);
        return obj;
      }, {});
      const propNames = Object.keys(this.constructor.properties);
      const components = Object.values(Components).filter(comp => propNames.includes(comp.name));
      this.components = components.map(Comp => new Comp());
    }

    addComponent(Component) {
      this.components.push(new Component)
      return this;
    }

    getComponent(Component) {
      if (typeof Component === 'string') {
        return this.components.find(c => c.constructor.name === Component)
      }
      return this.components.find(c => c.constructor.name === Component.name);
    }

    getAllComponents() {
      return this.components.reduce((acc, cur) => {
        acc[cur.constructor.name] = cur;
        return acc;
      }, {})
    }

    hasComponent(Component) {
      return !!this.getComponent(Component);
    }

    removeComponent(Component) {
      if (!this.hasComponent(Component)) return;
      const index = this.components.indexOf(Component);
      this.components.splice(index, 1);
    }

    // LIFE CYCLES

    connectedCallback() {
      super.connectedCallback();
      this.components.forEach(component => {
        component.set(this[component.constructor.name]) // set from component properties
      });
      this.systems[LIFE_CYCLES.CONNECTED]?.forEach(system => system.run(this));
      this.components.forEach(component => {
        component.default() // set from component properties
      });
      this.getComponent(Base).component = this;
    }

    update(changedProperties) {
      Array.from(changedProperties.entries()).forEach(([potentialComponent, change]) => {
        const comp = this.getComponent(potentialComponent);
        if (!comp || change === undefined) return;
        comp.set(this[potentialComponent]);
      });

      this.addComponent(Changed);
      this.getComponent(Changed).updated = changedProperties;
      this.getComponent(Changed).entity = this;

      this.systems[LIFE_CYCLES.UPDATE]?.forEach(system => system.run(this));
      this.removeComponent(Changed);

      super.update();
    }

    render() {
      const base = this.getComponent(Base);
      let {width, height} = base;
      const { header } = base;
      width = width ?? '100%';
      height = height ?? '100%';
      base.canvas = [];
      this.systems[LIFE_CYCLES.RENDER]?.forEach(system => system.run(this));

      return html`
        <h3 class="d2l-heading-1">${header}</h3>
        <svg tabindex=0 version="1.1" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
          <style>${defaultChartStyles}</style>
          ${base.canvas}
        </svg>
      `
    }
}
