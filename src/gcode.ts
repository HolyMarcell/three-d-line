

type GCode = string[];

export const parseGcode = (gcode: GCode) => {

  const lc = gcode.map((line) => line.toLowerCase().trim());

  const onlyMovement = lc.filter((line) => (line.startsWith('g1') || line.startsWith('g0')));

  const coordinates = onlyMovement.map((line) => {
    const xre = /x[0-9]+([,.][0-9]+)?/;
    const yre = /y[0-9]+([,.][0-9]+)?/;
    const zre = /z[0-9]+([,.][0-9]+)?/;

    const xs = line.match(xre)?.[0] || 'x0';
    const ys = line.match(yre)?.[0] || 'y0';
    const zs = line.match(zre)?.[0] || 'z0';

    return {
      x: parseFloat(xs.replace('x', '')),
      y: parseFloat(ys.replace('y', '')),
      z: parseFloat(zs.replace('z', ''))
    }
  });

  return coordinates;
}
