import { runCoord } from './coord.js';
import { runAes } from './aes.js';
import { runStats } from './stats.js';
import { runTooltip } from './tooltip.js';
import { runScale } from './scale.js';
import { runProjection } from './project.js';

const clone = obj => JSON.parse(JSON.stringify(obj));

export class Pipeline {
  constructor(host) {
    (this.host = host).addController(this);
    this.functions = [
      runAes,
      runStats,
      runTooltip,
      runCoord,
      runScale,
      runProjection,
    ];
  }

  runPipeline(grammar) {
    return this.functions.reduce(
      (g, func) => func({ ...g }, this.host),
      grammar
    );
  }

  initialize() {
    const {
      aes,
      scale,
      geom,
      pos,
      coord,
      stat,
      data,
      width,
      height,
      title,
      tooltip,
      sizing,
      legend,
      altAxePointFunction,
    } = this.host;
    const grammar = {
      aes,
      scale: scale ? [...scale] : [],
      geom,
      coord,
      pos,
      stat,
      data: [...data],
      width,
      height,
      title,
      tooltip,
      sizing,
      legend,
      altAxePointFunction,
    };
    if (this.host.data.length === 0) {
      throw new Error('No Data');
    }
    this.host.transformedGrammar = this.runPipeline(clone(grammar));
  }

  hostConnected() {
    return this.initialize();
  }

  hostUpdate() {
    return this.initialize();
  }
}
