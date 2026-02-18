import { GeoCoords } from "../types";

// https://www.youtube.com/watch?v=87JAdYPC2n0
export async function convertBlobUrlToFile(blobUrl: string) {
  console.log(blobUrl);
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  return file;
}

/**
 * This is a classic Vitalian utility function.
 * @param array An array of any element
 * @returns A random element from the array
 */
// eslint-disable-next-line
export const randElem = (array: any[]): any =>
  array[Math.floor(Math.random() * array.length)];

/**
 * Finds the longitude and latitude of the user's current location
 * @returns a coordinate pair or undefined
 */
export function getGeolocation(): GeoCoords | undefined {
  let coords: GeoCoords | undefined = undefined;

  function success(pos: GeolocationPosition) {
    const { longitude, latitude } = pos.coords;
    coords = { longitude, latitude };
  }

  function error(err: GeolocationPositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation?.getCurrentPosition(success, error);

  return coords;
}
