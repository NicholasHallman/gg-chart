/* eslint-disable no-param-reassign */
import {Axis as AxisComponent, Column as ColumnComponent} from '../../chartComponents.js';
import {System, Query, LIFE_CYCLES} from '../../system.js';

function populateYAxisColumn({Column, Axis}) {
  const minData = Column.data.reduce((min, cur) => cur < min ? cur : min, Number.POSITIVE_INFINITY);
  const maxData = Column.data.reduce((max, cur) => cur > max ? cur : max, Number.NEGATIVE_INFINITY);
  if (Axis.yMin === undefined) Axis.yMin = minData;
  if (Axis.yMax === undefined) Axis.yMax = maxData;
}


export const yAxisColumnPopulator = new System(
  new Query().all([AxisComponent, ColumnComponent]),
  populateYAxisColumn,
  LIFE_CYCLES.CONNECTED
)
