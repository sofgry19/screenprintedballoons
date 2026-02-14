export interface GeoCoords {
  longitude: number;
  latitude: number;
}

export interface MapEntryData {
  name?: string;
  img_url: string;
  coords: GeoCoords;
  timestamp: Date;
}

export interface HomePageParams {
  lng?: string;
  lat?: string;
}
