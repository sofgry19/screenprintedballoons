import { GeoCoords, MapEntryData } from "./types";

export const MOCK_ENTRIES: MapEntryData[] = [
  {
    name: "Sofia",
    photo_url: "mock-photos/sofia.png",
    coords: { longitude: 0, latitude: 0 },
  },
  {
    name: "Irregular Sofia",
    photo_url: "mock-photos/irregular-sofia.jpg",
    coords: { longitude: 0.005, latitude: 0.005 },
  },
  {
    name: "Fake Sofia",
    photo_url: "mock-photos/fake-sofia.jpg",
    coords: { longitude: -0.001, latitude: 0.001 },
  },
];

export const MOCK_COORDS: GeoCoords[] = [];

export const createMockCoords = (
  center: GeoCoords,
  range: number,
  count: number,
): GeoCoords[] => {
  const exports: GeoCoords[] = [];

  for (let i = 0; i < count; i++) {
    exports.push({
      longitude: center.longitude + Math.random() * (range * 2) - range,
      latitude: center.latitude + Math.random() * (range * 2) - range,
    });
  }

  return exports;
};
