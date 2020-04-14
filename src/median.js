export default function median(array, totalLength) {
  array = array.sort((a, b) => a - b);
  let index = Math.floor((totalLength - 1) / 2);
  if (array[index] === undefined) {
    return totalLength;
  } else {
    return array[index];
  }
}
