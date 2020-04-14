export default function median(array, totalLength, defaultValue) {
  let index = Math.floor((totalLength - 1) / 2);
  if (array[index] === undefined) {
    return defaultValue;
  } else {
    return array[index];
  }
}
