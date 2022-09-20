import { Point3 } from './types';


export const sortByOrder = (a: Point3, b: Point3) => {
  return a.order > b.order ? 1 : -1;
}
