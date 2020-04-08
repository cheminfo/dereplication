import { writeFileSync } from 'fs';
import { join } from 'path';

import { parse as parseMGF } from 'mgf-parser';
import Papa from 'papaparse';

/**
 * combine MGF and TSV data and generate JSON file
 * @param {string} filename name of the JSON file to be generated
 * @param {string} mgfRawData MGF data
 * @param {string} csvRawData CSV data
 */
export default function combineAndGenerateJSON(
  filename,
  mgfRawData,
  csvRawData,
) {
  // parse data

  let mgfData = parseMGF(mgfRawData, { sortX: true, uniqueX: true });

  let parsedCsv = Papa.parse(csvRawData, {
    header: true,
    dynamicTyping: true,
  });

  // convert parsedCsv into an object of of objects where the keys are spectrum_id_val

  let csvData = {};
  let noID = 0;

  for (let entry of parsedCsv.data) {
    if (entry.spectrum_id_val) {
      csvData[entry.spectrum_id_val] = entry;
    } else {
      noID++; // check if some entries do not have a spectrum_id_val (here: 1)
    }
  }

  // console.log(mgfData);
  // console.log(csvData);

  // add inchi of metadata to spectrum if it's not already existing
  addExistingKey(mgfData, csvData, 'INCHI', 'inchi_val');

  // console.log(mgfData);

  // generate JSON
  writeFileSync(
    join(__dirname, filename),
    JSON.stringify(mgfData, undefined, 2),
    'utf8',
  );
  console.log(`A new JSON file has been generated: ${__dirname}/${filename}`);
}

/**
 * add value of a property of metadata (called metadataKey) to spectrum if it does not exist already under the name spectrumKey
 * @param {array<object>} mgfData we want to add properties to the meta of each entry of spectrum
 * @param {object<object>} csvData csv data in object with keys spectrum_id_val
 * @param {string} mgfKey key of the property in spectrum
 * @param {string} csvKey key of the property in metadata
 */
function addExistingKey(mgfData, csvData, mgfKey, csvKey) {
  for (let i = 0; i < mgfData.length; i++) {
    let spectrumID = mgfData[i].meta.SPECTRUMID;
    let csvEntry = csvData[spectrumID];
    let mgfEntryMeta = mgfData[i].meta;
    if (csvEntry) {
      if (!mgfEntryMeta[mgfKey] || mgfEntryMeta[mgfKey] === 'N/A') {
        mgfEntryMeta[mgfKey] = csvEntry[csvKey];
      }
    }
  }
}
