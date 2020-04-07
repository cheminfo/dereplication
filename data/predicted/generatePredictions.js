import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { parse as parseMGF } from 'mgf-parser';

import appendIdCode from '../appendIdCode';

// import data from files
let mgfRawData = readFileSync(join(__dirname, './UNDP_ISDB.mgf'), 'utf8');

let mgfData = parseMGF(mgfRawData, {
  sortX: true,
  uniqueX: true,
  normedY: true,
});

appendIdCode(mgfData); // this takes around 15 minutes
// 3 SMILES could not be parsed:
// COc1cc(C)oc2c(O)c(O)cc(C)c2cc(O)c1
// COc1c(OC)c2sc3c(CCN(C)C)c(SC)c(OC)c(OC)c3sc4c(OC)c(OC)c(SC)c(CCN(C)C)c4ssc2c(CCN(C)C)c1SC
// c1cc2ccc1sc3ccc(cc3)sc4ccc(cc4)sc5ccc(cc5)sc6ccc(cc6)s2

mgfData = mgfData.filter((entry) => entry.meta.idCode);

// generate JSON
writeFileSync(
  join(__dirname, '../predictions.json'),
  JSON.stringify(mgfData, undefined, 2),
  'utf8',
);

console.log(`predictions.json has been generated.`);
