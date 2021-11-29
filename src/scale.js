
const reasonableBreaks = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const isPrime = (n, i) => {
  if(i === undefined) {
    return isPrime(n, 2);
  } if( n === i || n === 1) {
    return true;
  }
  if(n % i === 0) return false;
  return isPrime(n, i+1);
}

const findReasonableBreak = (limDiff) => {
  const breakFits = reasonableBreaks.filter(numBreaks => limDiff % numBreaks === 0);
  return breakFits[breakFits.length - 1];
}

const makeBreaks = (lim, numBreaks) => {
  const breaks = [];
  const limDiff = lim[1] - lim[0];
  const spaceBetween = Math.floor(limDiff / numBreaks);
  for(let i = 0; i <= numBreaks; i+=1) {
    breaks.push((spaceBetween * i) + lim[0]);
  }
  return breaks;
}

const findBreaks = (lim) => {
  const newLim = [...lim];
  let limDiff = lim[1] - lim[0];

  if(isPrime(limDiff)) {
    limDiff += 1;
    newLim[1] += 1;
  }
  let breakFit = findReasonableBreak(limDiff);
  while (breakFit === undefined) {
    limDiff += 1;
    newLim[1] += 1;
    if(isPrime(limDiff)) {
      limDiff += 1;
      newLim[1] += 1;
    }
    breakFit = findReasonableBreak(limDiff);
  }

  return {breaks: makeBreaks(newLim, breakFit), newLim};
}

export const runScale = (host) => {
  const {aes, stats, scale, coord, geom} = host;
  if(coord.flip) {
    [scale[1], scale[0]] = [scale[0], scale[1]];
  }

  [aes[0], aes[1]].forEach((axis, i) => {
    if(scale[i] === undefined) {
      scale[i] = {};
    }
    if(scale[i].lim === undefined) {
      scale[i].lim = [
        stats[axis].min === 0 ? 0 : stats[axis].min - 1,
        geom.includes('bar') ? stats[axis].max + 1 : stats[axis].max
      ];
    }
    if(scale[i].name === undefined) {
      scale[i].name = axis;
    }
    if(scale[i].breaks === undefined) {
      const { breaks, newLim } = findBreaks(scale[i].lim);
      scale[i].breaks = breaks;
      scale[i].lim = newLim;
    }
    else if(typeof scale[i].breaks === 'number') {
      scale[i].breaks = makeBreaks(scale[i].lim, scale[i].breaks);
    }
  })
  return host;
}
