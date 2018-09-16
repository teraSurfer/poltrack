/** Returns a numeric hash for the inputString */
export function getHash(inputString: string): number {
  // based on https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  let hash = 0,
    i,
    chr;
  if (inputString.length === 0) {
    return hash;
  }

  for (i = 0; i < inputString.length; i++) {
    chr = inputString.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
    hash = (hash << 5) - hash + chr;
    // tslint:disable-next-line:no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
