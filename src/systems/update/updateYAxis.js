/* eslint-disable no-param-reassign */
import { Axis as AxisComponent, Changed as ChangedComponent, Column as ColumnComponent } from "../../chartComponents.js";
import { LIFE_CYCLES, Query, System } from "../../system.js";

function updateYAxisColumnValues({Axis, Changed}) {
  const newColumn = Changed.entity.Column;
  const {yMax} = Axis;
  if (!newColumn) return;
  const maxData = newColumn.data.reduce((max, cur) => cur > max ? cur : max, Number.NEGATIVE_INFINITY);
  if(maxData > yMax) {
    Axis.yMax = (maxData + 10);
  }
  if(maxData < yMax - 15) {
    Axis.yMax = (yMax - 15);
  }
}


export const updateYAxisColumnValuesSystem = new System(
  new Query().all([AxisComponent, ColumnComponent, ChangedComponent]),
  updateYAxisColumnValues,
  LIFE_CYCLES.UPDATE
)
