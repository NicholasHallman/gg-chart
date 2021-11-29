

const parseCoord = (coord) => {
  if(coord === undefined || coord === null) return {};
  const coords = coord.split(' ').map(term => term.split(':'));
  return coords.reduce((obj, cur) => {
    obj[cur[0]] = cur[1] ?? true;
    return obj;
  }, {});
}

export const runCoord = (host) => {
  host.coord = parseCoord(host.coord);

  if(host.coord.flip) {
    [host.aes[1], host.aes[0]] = [host.aes[0], host.aes[1]];
  }

  return host;
}
