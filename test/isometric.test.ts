import { describe, expect, it } from "vitest";
import { iso } from "../src/catalog/preview/isometric";

describe("architectural isometric projection", () => {
  it("uses equal scale on X, Y and Z, two 30 degree floor axes and vertical walls", () => {
    const origin = iso(0, 0, 0);
    const vector = (x: number, y: number, z: number) => {
      const point = iso(x, y, z);
      return [point[0] - origin[0], point[1] - origin[1]];
    };
    const [x, y, z] = [vector(100, 0, 0), vector(0, 100, 0), vector(0, 0, 100)];
    for (const axis of [x, y, z])
      expect(Math.hypot(...axis)).toBeCloseTo(100, 8);
    expect((Math.atan2(x[1], x[0]) * 180) / Math.PI).toBeCloseTo(30, 8);
    expect((Math.atan2(y[1], y[0]) * 180) / Math.PI).toBeCloseTo(150, 8);
    expect(z).toEqual([0, -100]);
  });
  it("keeps parallel walls parallel at every position and height", () => {
    const edge = (x: number, y: number, z: number) => {
      const a = iso(x, y, z);
      const b = iso(x + 130, y, z);
      return [b[0] - a[0], b[1] - a[1]];
    };
    const reference = edge(0, 0, 0);
    for (const point of [
      [-200, 110, 0],
      [80, -60, 240],
      [300, 200, 100],
    ]) {
      const actual = edge(point[0], point[1], point[2]);
      expect(actual[0]).toBeCloseTo(reference[0], 8);
      expect(actual[1]).toBeCloseTo(reference[1], 8);
    }
  });
});
