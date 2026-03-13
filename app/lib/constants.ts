import { Luckiest_Guy } from "next/font/google";
import { GeoCoords } from "../types";


export const FONT_LUCKY = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
});

export const NYC_COORDS: GeoCoords = { longitude: -73.935242, latitude: 40.73061 };

