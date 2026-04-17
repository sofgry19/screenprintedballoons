import { Rampart_One, Montserrat, Permanent_Marker } from "next/font/google";
import { GeoCoords } from "../types";

export const FONT_RAMPART = Rampart_One({
  weight: "400",
  subsets: ["latin"],
});

export const FONT_MON = Montserrat({
  weight: "700",
  subsets: ["latin"],
});

export const FONT_MARKER = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
});

export const NYC_COORDS: GeoCoords = {
  longitude: -73.935242,
  latitude: 40.73061,
};
