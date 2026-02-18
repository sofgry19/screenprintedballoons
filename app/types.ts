export interface GeoCoords {
  longitude: number;
  latitude: number;
}

export interface MapEntryData {
  name?: string;
  photo_url: string;
  coords: GeoCoords;
}

export interface HomePageParams {
  lng?: string;
  lat?: string;
}
