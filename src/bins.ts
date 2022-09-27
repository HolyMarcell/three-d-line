import { Color, ColorGradient, Maybe, Point3 } from './util/types';

export type BinId = number;


export interface Bin {
  id: BinId;
  points: Point3[];
  color: Color;
  colorGradient: Maybe<ColorGradient>;
}

export interface BinStore {
  bins: Record<BinId, Bin>;
  active: BinId;
}

interface CreateBinProps {
  color?: Color;
  colorGradient?: ColorGradient;
}

type CreateBinFn = (props: CreateBinProps) => void;
type CreateBinFnFactory = (binStore: BinStore) => CreateBinFn;

const newBinId = (binStore) => () => {
  return (1 + Math.max(0, ...Object.keys(binStore.bins).map(v => +v)));
}


export const createBinFactory: CreateBinFnFactory =
  (binStore) =>
  ({color = null, colorGradient = null} = {}) => {
  const newId = newBinId(binStore)();
  const newBin = {
    id: newId,
    color: color,
    colorGradient: colorGradient,
    points: []
  };

  if(color === null) {
    if(colorGradient === null) {
      newBin.color = "#00ff00"; // Lovely default green
    } else {
      newBin.color = colorGradient.from;
    }
  }

  binStore.bins = {...binStore.bins, [newId]: newBin };
  binStore.active = newId;
  return binStore;
}

export const sanitizePoints = (points) => {
  if(points?.length >= 0) {
    return points.map((point) => {
      if (point === undefined ||
        point?.x === undefined ||
        point?.y === undefined ||
        point?.z === undefined
      ) {
        return null
      }
      return point
    }).filter((v) => v !== null);
  } else {
    return []
  }
}

export const addPointFactory =
  (binStore: BinStore) =>
    (points: Point3[]) => {

  const sanitizedPoints = sanitizePoints(points)

  binStore.bins[binStore.active].points = binStore.bins[binStore.active].points.concat(sanitizedPoints);
  return binStore;
}
