import { AreaTypes } from "./renderers/areaRender";

const parseStats = (stat) => {
  if(stat === undefined || stat === null) return {};
  const stats = stat.split(' ').map(term => term.split(':'));
  return stats.reduce((obj, cur) => {
    obj[cur[0]] = cur[1] ?? true;
    return obj;
  }, {});
}

function calculateMean(axis, source) {
  let total = 0;
  source.forEach( r => {
    const v = r[axis];
    total += v;
  })
  return total / source.length;
}

function calculateBins(axis, parsed, host, stats) {
  const {bin: width} = parsed;
  const {scale} = host;
  let min;
  let max;
  // if there are given scale limits use those
  // to infer the number of bins
  if ( scale[0]?.lim ) {
    ([{ lim: [min, max] }] = scale);
  } else {
    ({min, max} = stats[axis]);
  }
  // otherwise use the min and max of the axis to
  // get the number of bins
  const bins = {};
  bins.length = 0;
  for(let i = min; i < max; i += Number(width)) {
    const bin = Math.floor(i / Number(width))
    bins[bin] = 0
    bins.length += 1;
    if(i + Number(width) === max) {
      bins.largestBin = bin;
    }
  }
  return bins;
}

function groupLikeData(data, axis, keyFunc = k => k) {
  return data.reduce((groups, record) => {
    const groupKey = keyFunc(record[axis]);
    if(groups[groupKey] === undefined) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(record);
    return groups;
  }, {});
}

function group(data, aes, keyFunc) {
  if (aes.length === 0) return [data];
  const groups = Object.entries(groupLikeData(data, aes[0])).sort(([keyA], [keyB]) => keyA - keyB ).map(([, v]) => v);
  return groups.flatMap(dataGroup => group(dataGroup, aes.splice(1), keyFunc));
}

function calculateMax(axis, source) {
  return Math.ceil(source.reduce((max, r) => Number(r[axis]) > max ? Number(r[axis]) : max, Number.NEGATIVE_INFINITY));
}

function calculateMin(axis, source) {
  return Math.floor(source.reduce((min, r) => Number(r[axis]) < min ? Number(r[axis]) : min, Number.POSITIVE_INFINITY));
}

function calculateGroupedMax(axis, groupAxis, source) {
  const groups = Object.values(groupLikeData(source, groupAxis));
  const summedGroups = groups.map( g => g.reduce((sum, r) => sum + r[axis], 0));
  return Math.ceil(summedGroups.reduce((max, v) => v > max ? v : max, Number.NEGATIVE_INFINITY));
}

function calculateGroupedMin(axis, groupAxis, source) {
  const groups = Object.values(groupLikeData(source, groupAxis));
  const summedGroups = groups.map( g => g.reduce((sum, r) => sum + r[axis], 0));
  return Math.ceil(summedGroups.reduce((min, v) => v < min ? v : min, Number.POSITIVE_INFINITY));
}

export const runStats = (host) => {
  const {aes, stat, data, pos} = host;

  const parsed = parseStats(stat);
  const stats = {};

  aes.forEach(axis => {
    stats[axis] = {};
    stats[axis].min = Math.min(0, calculateMin(axis, data));
    stats[axis].max = calculateMax(axis, data);
  })

  stats.area = [];

  if (parsed.xmean) {
    const axis = aes[0];
    stats[axis].mean = calculateMean(axis, host.data)
    stats.area[AreaTypes.left] = host.data.reduce((aggr, cur) => cur[axis] < stats[axis].mean ? aggr + 1 : aggr , 0); // left area
    stats.area[AreaTypes.right] = host.data.reduce((aggr, cur) => cur[axis] >= stats[axis].mean ? aggr + 1 : aggr , 0); // right area
  }

  if (parsed.ymean) {
    const axis = aes[1];
    stats[axis].mean = calculateMean(axis, host.data)
    stats.area[AreaTypes.top] = host.data.reduce((aggr, cur) => cur[axis] >= stats[axis].mean ? aggr + 1 : aggr , 0); // top area
    stats.area[AreaTypes.bottom] = host.data.reduce((aggr, cur) => cur[axis] < stats[axis].mean ? aggr + 1 : aggr , 0); // bottom area
  }

  if (parsed.xmean && parsed.ymean) {
    const x = { axis: aes[0], mean: stats[aes[0]].mean};
    const y = { axis: aes[1], mean: stats[aes[1]].mean};

    stats.area[AreaTypes.topLeft] = host.data.reduce((aggr, cur) => cur[x.axis] < x.mean && cur[y.axis] > y.mean ? aggr + 1 : aggr , 0); // topLeft area
    stats.area[AreaTypes.topRight] = host.data.reduce((aggr, cur) => cur[x.axis] > x.mean && cur[y.axis] > y.mean ? aggr + 1 : aggr , 0); // topRight area
    stats.area[AreaTypes.bottomLeft] = host.data.reduce((aggr, cur) => cur[x.axis] < x.mean && cur[y.axis] < y.mean ? aggr + 1 : aggr , 0); // bottomLeft area
    stats.area[AreaTypes.bottomRight] = host.data.reduce((aggr, cur) => cur[x.axis] > x.mean && cur[y.axis] < y.mean ? aggr + 1 : aggr , 0); // bottomRight area
  }

  if (parsed.bin) {
    const axis = aes[0];
    const aggrName = `aggr${aes[1] ?? ''}`;
    const {specialAes} = host;
    stats[axis].binWidth = parsed.bin;
    stats[axis].bins = calculateBins(axis, parsed, host, stats);

    // break down the data into groups in order of higher dimensional aesthetics
    const nonXYAesthetics = aes.specialEntries()
      .filter(([, a]) => a !== axis)
      .map(([,a]) => a);
    const groupedData = group(data, nonXYAesthetics);
    // bin the groups by the y aesthetic
    const binGroups = groupedData.map(grouping => {
      const calculateBin = k => Math.min(Math.floor(k / stats[axis].binWidth), stats[axis].bins.largestBin);
      const binGroup = groupLikeData(grouping, axis, calculateBin, stats[axis].bins.length - 1); // bin group
      const bins = calculateBins(axis, parsed, host, stats);
      Object.keys(binGroup).forEach(key => {
        bins[key] = binGroup[key].length;
      });
      aes.specialEntries().forEach(([, aesthetic]) => {
        if(aesthetic === axis) return;
        bins[aesthetic] = Object.values(binGroup)[0][0][aesthetic];
      })
      return bins;
    })

    // convert the bins into records
    host.data = binGroups.flatMap(g =>
      Object.entries(g).map(([bin, aggr]) => {
        if (Number.isNaN(Number(bin))) return undefined;
        const newRecord = {};
        newRecord[axis] = bin * parsed.bin;
        newRecord[aggrName] = aggr;
        aes.specialEntries().forEach(([, aesthetic]) => {
          if(aesthetic === axis) return;
          newRecord[aesthetic] = g[aesthetic];
        })
        return newRecord;
      })
    ).filter(r => r !== undefined);

    // // remove duplicate bins
    // if(aes.specialEntries().length > 0){
    //   host.data = host.data.filter(record => {
    //     const bin = record[axis];
    //     const duplicate = host.data.find(r => r[axis] === bin && record !== r);
    //     if(duplicate && duplicate[aggrName] !== 0 && record[aggrName] === 0) return false;
    //     return true;
    //   })
    // }

    //host.data.sort((a, b) => a[axis] - b[axis]);

    // rename aes to reflect the new records
    const tempFunc = aes.specialEntries;
    host.aes = [axis, aggrName, ...aes.slice(2)];
    Object.entries(specialAes).forEach(([key, value]) => {host.aes[key] = value});
    host.aes.specialEntries = tempFunc;

    // calculate stats for the aggregate aesthetic
    stats[aggrName] = {};
    stats[aggrName].min = calculateMin(aggrName, host.data);
    stats[aggrName].max = pos.dodge ? calculateMax(aggrName, host.data) : calculateGroupedMax(aggrName, axis, host.data);
    stats[aggrName].parts = binGroups.length;

    if (parsed.ymean) {
      stats[aggrName].mean = calculateMean(aggrName, host.data)
    }

    if (parsed.xmean) {
      stats[axis].mean = calculateMean(axis, host.data)
    }

    if (parsed.xmean) {
      const axis = aes[0];
      stats[axis].mean = calculateMean(axis, host.data)
      stats.area[AreaTypes.left] = host.data.reduce((aggr, cur) => cur[axis] < stats[axis].mean ? aggr + 1 : aggr , 0); // left area
      stats.area[AreaTypes.right] = host.data.reduce((aggr, cur) => cur[axis] >= stats[axis].mean ? aggr + 1 : aggr , 0); // right area
    }

    if (parsed.ymean) {
      const axis = aes[1];
      stats[axis].mean = calculateMean(axis, host.data)
      stats.area[AreaTypes.top] = host.data.reduce((aggr, cur) => cur[axis] >= stats[axis].mean ? aggr + 1 : aggr , 0); // top area
      stats.area[AreaTypes.bottom] = host.data.reduce((aggr, cur) => cur[axis] < stats[axis].mean ? aggr + 1 : aggr , 0); // bottom area
    }

    if (parsed.xmean && parsed.ymean) {
      const x = { axis: aes[0], mean: stats[aes[0]].mean};
      const y = { axis: aes[1], mean: stats[aes[1]].mean};

      stats.area[AreaTypes.topLeft] = host.data.reduce((aggr, cur) => cur[x.axis] < x.mean && cur[y.axis] > y.mean ? aggr + 1 : aggr , 0); // topLeft area
      stats.area[AreaTypes.topRight] = host.data.reduce((aggr, cur) => cur[x.axis] > x.mean && cur[y.axis] > y.mean ? aggr + 1 : aggr , 0); // topRight area
      stats.area[AreaTypes.bottomLeft] = host.data.reduce((aggr, cur) => cur[x.axis] < x.mean && cur[y.axis] < y.mean ? aggr + 1 : aggr , 0); // bottomLeft area
      stats.area[AreaTypes.bottomRight] = host.data.reduce((aggr, cur) => cur[x.axis] > x.mean && cur[y.axis] < y.mean ? aggr + 1 : aggr , 0); // bottomRight area
    }
  }
  host.stats = stats;

  return host
}
