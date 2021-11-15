/* eslint-disable max-classes-per-file */

export const LIFE_CYCLES = {
  CONNECTED: Symbol('connected'),
  UPDATE: Symbol('update'),
  RENDER: Symbol('render')
}

export class Query {
  constructor() {
    this.mustInclude = [];
    this.neverInclude = [];
    return this;
  }

  all(components){
    this.mustInclude = components;
    return this;
  }

  none(components){
    this.neverInclude = components;
    return this;
  }

  check(entity) {
    if (this.mustInclude.length > 0 && !this.mustInclude.every(Component => entity.hasComponent(Component))) {
      return false;
    }
    if (this.neverInclude.length > 0 && this.neverInclude.every(Component => entity.hasComponent(Component))) {
      return false;
    }
    return true;
  }
}

export class System {
  constructor(query, func, lifecycle) {
    this.query = query;
    this._execute = func;
    this._lifecycle = lifecycle
  }

  run(entity) {
    if(!this.query.check(entity)) return;
    this._execute(entity.getAllComponents());
  }

  get lifecycle() {
    return this._lifecycle;
  }
}
