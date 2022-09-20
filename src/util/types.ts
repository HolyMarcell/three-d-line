
export type Maybe<T> = T | null;

export interface Point3 {
  x: number;
  y: number;
  z: number;
  order: number;
}


export type Color = string;

export interface ColorGradient {
  from: Color;
  to: Color;
}
