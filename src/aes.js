
const keyWords = [
  'color',
  'size'
]

const parseAes = (aes) => {
  let parsedAes = aes.split(',').map(axis => axis.trim());
  const copySpecial = {};

  // go through each aes,
  parsedAes = parsedAes.map( (axis) => {
    // check if it's a special keyword.
    const key = keyWords.find(k => axis.includes(`${k}(`));
    if(key) {
      const reg = /\((.*?)\)/;
      const result = reg.exec(axis);
      [,copySpecial[key]] = result;
      return result[1];
    }
    return axis;
  })
  Object.entries(copySpecial).forEach(([key, value]) => {parsedAes[key] = value});
  return {parsedAes, copySpecial};
}

const parse = (prop) => {
  if(prop === undefined || prop === null) return {};
  const props = prop.split(' ').map(term => term.split(':'));
  return props.reduce((obj, cur) => {
    obj[cur[0]] = cur[1] ?? true;
    return obj;
  }, {});
}


export const runAes = (host) => {
  const { parsedAes, copySpecial } = parseAes(host.aes);

  host.aes = parsedAes;
  host.specialAes = copySpecial;
  host.aes.specialEntries = function specialEntries() {
    return Object.keys(this)
      .filter(key => keyWords.includes(key))
      .map(key => [key, this[key]]);
  }

  host.pos = parse(host.pos);

  return host;
}


