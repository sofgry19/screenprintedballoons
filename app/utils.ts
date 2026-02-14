/**
 * This is a classic Vitalian utility function.
 * @param array An array of any element
 * @returns A random element from the array
 */
// eslint-disable-next-line
export const randElem = (array: any[]): any =>
  array[Math.floor(Math.random() * array.length)];
