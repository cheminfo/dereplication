import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { parse as parseMGF } from 'mgf-parser';

import testSimilarity from '../..';
import appendIdCode from '../appendIdCode';

// import data from files
let mgfRawData = readFileSync(
  join(__dirname, './benchmarking_dataset_spectral.mgf'),
  'utf8',
);

let mgfData = parseMGF(mgfRawData, {
  sortX: true,
  uniqueX: true,
  normedY: true,
});

appendIdCode(mgfData); // for now, losing 1/2 of data because of invalid smiles

mgfData = mgfData.filter((entry) => entry.meta.idCode);

// generate JSON
writeFileSync(
  join(__dirname, '../experiments.json'),
  JSON.stringify(mgfData, undefined, 2),
  'utf8',
);

console.log(`experiments.json has been generated.`);
