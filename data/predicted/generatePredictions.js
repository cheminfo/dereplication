import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { parse as parseMGF } from 'mgf-parser';

import appendIdCode from '../appendIdCode';

// import data from files
let mgfRawData = readFileSync(join(__dirname, './UNDP_ISDB.mgf'), 'utf8');

let mgfData = parseMGF(mgfRawData, { sortX: true, uniqueX: true });

appendIdCode(mgfData);

// generate JSON
writeFileSync(
  join(__dirname, '../predictions.json'),
  JSON.stringify(mgfData, undefined, 2),
  'utf8',
);

console.log(`predictions.json has been generated.`);
