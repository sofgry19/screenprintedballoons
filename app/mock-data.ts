import { GeoCoords, MapEntryData } from "./types";

export const MOCK_ENTRIES: MapEntryData[] = [
  {
    name: "Sofia",
    img_url: "mock-photos/sofia.png",
    coords: { longitude: 0, latitude: 0 },
    timestamp: new Date(2002, 9, 3),
  },
  {
    name: "Irregular Sofia",
    img_url: "mock-photos/irregular-sofia.jpg",
    coords: { longitude: 0.005, latitude: 0.005 },
    timestamp: new Date(2018, 2, 22),
  },
  {
    name: "Fake Sofia",
    img_url: "mock-photos/fake-sofia.jpg",
    coords: { longitude: -0.001, latitude: 0.001 },
    timestamp: new Date(),
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
