/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */

class Type {
    static default(type) {
        switch (type) {
            case Number: return 0;
            case String: return '';
            case Array: return [];
            case Object: return {};
            default: {
              const customType = Type.customTypes.find(custom => custom === type);
              if (customType) {
                  return customType.default;
              }
              return undefined;
            }
        }
    }

    static _registerType(typeDefinition) {
        Type.customTypes.push(typeDefinition);
    }

    static createType(typeDefinition) {
        const requiredProps = ['default'];
        if (requiredProps.every(prop => Object.keys(typeDefinition).includes(prop) )){
            Type._registerType(typeDefinition);
        }
    }
}

Type.customTypes = [];

const Style = {
  default: {
    fill: [],
    stroke: [],
    minHeight: 0,
    spacing: 0,
  }
}

Type.createType(Style);

class Component {

    constructor() {
        this._schema = this.constructor._schema;
    }

    static set schema(schema) {
        this._schema = schema;
    }

    set(values) {
        Object.keys(this._schema).forEach(
          key => {
            if(values[key] !== undefined) this[key] = values[key];
          }
        );
    }

    get _data() {
        return Object.keys(this._schema).reduce((acc, key) => {
            acc[key] = this[key];
            return acc;
        }, {});
    }

    connectedCallback(entity) {
      if(super.connectedCallback) {
        super.connectedCallback(entity);
      }
    }

    default() {
      Object.keys(this._schema).forEach(
        key => {
          if (Type.customTypes.includes(this._schema[key]) && this[key] !== undefined) {
            // fill in missing type data
            const type = Type.customTypes[Type.customTypes.indexOf(this._schema[key])];
            Object.keys(type.default).forEach(subKey => {if(this[key][subKey] === undefined) this[key][subKey] = type.default[subKey];} )
          }
          if (this[key] === undefined){
            this[key] = Type.default(this._schema[key])
          }
        });
    }
}

export class Axis extends Component {}
Axis.schema = {
  xTitle: String,
  yTitle: String,
  xMin: Number,
  yMin: Number,
  xMax: Number,
  yMax: Number,
  xTicks: Number,
  yTicks: Number,
}

export class Column extends Component {}
Column.schema = {
    data: Array,
    style: Style
}

export class Line extends Component {}
Line.schema = {
    data: Array,
    style: Style
}

export class Bar extends Component {}
Bar.schema = {
    data: Array,
}

export class Categories extends Component {}
Categories.schema = {
  labels: Array,
  selected: Array
}

export class Chart extends Component {}
Chart.schema = {
    header: String,
    width: Number,
    height: Number,
    canvas: Array,
    component: Object
}

export class Changed extends Component {}
Changed.schema = {
  updated: Object
}

export default {
  Axis,
  Column,
  Bar,
  Chart,
  Categories,
  Line
}
