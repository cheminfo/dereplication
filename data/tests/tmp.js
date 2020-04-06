// this function is useless because all entries have all keys
// data is an array of objects
function getAllKeys(data) {
  let keys = Object.keys(data[0].meta);

  for (let i = 1; i < data.length; i++) {
    let currentKeys = Object.keys(data[i].meta);
    for (let currentKey of currentKeys) {
      if (keys.indexOf(currentKey) === -1) {
        keys.push(currentKey);
      }
    }
  }
  return keys;
}

// extract all possible keys of spectrum and metadata

let spectrumKeys = Object.keys(mgfData[0].meta);
let metadataKeys = Object.keys(parsedCsv.data[0]);

// console.log(spectrumKeys, metadataKeys);

// way to know how much time come code takes to be executed
console.time('read');
all = JSON.parse(readFileSync(join(__dirname, 'test.json'), 'utf8'));
console.timeEnd('read');
