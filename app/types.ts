import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface GeoCoords {
  longitude: number;
  latitude: number;
}

export interface LocationData {
  id: number;
  name?: string;
  longitude: number;
  latitude: number;
  submission_count: number;
}

export interface SubmissionData {
  photo_url: string;
  social?: string;
  location_id: number;
  created_at?: Timestamp;
}

export interface HomePageParams {
  lng?: string;
  lat?: string;
}
