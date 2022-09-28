

type GCode = string[];

export const parseGcode = (gcode: GCode) => {

  const lc = gcode.map((line) => line.toLowerCase().trim());

  const onlyMovement = lc.filter((line) => (line.startsWith('g1') || line.startsWith('g0')));


  let _last_values = {
    x: 0,
    y: 0,
    z: 0
  }

  const coordinates = onlyMovement.map((line) => {
    const xre = /x-?[0-9]+([,.][0-9]+)?/;
    const yre = /y-?[0-9]+([,.][0-9]+)?/;
    const zre = /z-?[0-9]+([,.][0-9]+)?/;

    const xs = line.match(xre)?.[0] || null;
    const ys = line.match(yre)?.[0] || null;
    const zs = line.match(zre)?.[0] || null;

    if(zs === null && ys === null && xs === null) {
      return false;
    }
    else {

      const x = xs === null ? _last_values.x : parseFloat(xs.replace('x', ''));
      const y = ys === null ? _last_values.y : parseFloat(ys.replace('y', ''));
      const z = zs === null ? _last_values.z : parseFloat(zs.replace('z', ''));

      _last_values = {
        x,
        y,
        z
      };

      return {
        x,y,z
      }
    }
  }).filter(Boolean);

  return coordinates;
}
