export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const MOCK_COORDS: Coordinates[] = [];

export const createMockCoords = (
  center: Coordinates,
  range: number,
): Coordinates[] => {
  const exports: Coordinates[] = [];

  for (let i = 0; i < 5; i++) {
    exports.push({
      longitude: center.longitude + Math.random() * (range * 2) - range,
      latitude: center.latitude + Math.random() * (range * 2) - range,
    });
  }

  return exports;
};
