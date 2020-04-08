import { readFileSync } from 'fs';
import { join } from 'path';

import spectrumWeightedMergeX from 'ml-array-xy-weighted-merge';

/**
 * @typedef {object} Spectrum Data type of all the spectra
 * @property {Array} x X entries of the spectrum
 * @property {Array} y X entries of the spectrum
 */

/**
 * @typedef {object} Entry Entries of Data type: contains a spectrum and meta-information
 * @property {string} kind Kind of the entries of the data (in general: 'IONS')
 * @property {object} meta Meta-information about the spectrum
 * @property {Spectrum} data The spectrum data
 */

/**
 * @typedef {Array<Entry>} Data The type of experimental and predicted data after MGF parsing
 */

/**
 * Loads, parses a JSON file. Then makes a weighted merge of the x values of each spectrum too close to each other using `ml-array-xy-weighted-merge`
 * @param {string} path Relative path to json file
 * @param {object} options
 * @param {number} [options.mergeSpan = 1] How close consecutive x values of a spectrum must be to be merged
 * @param {string} [options.pathType = "relative"] Allows to define wether the path to the JSON is "relative" or "absolute"
 * @returns {Data} Data loaded, parsed and merged
 */
export default function loadAndMergeX(path, options = {}) {
  const { pathType = 'relative', mergeSpan = 1 } = options;
  let rawData;

  switch (pathType) {
    case 'relative':
      rawData = readFileSync(join(__dirname, path), 'utf8');
      break;
    case 'absolute':
      rawData = readFileSync(path, 'utf8');
      break;
    default:
      throw new Error(`Unknown path type: ${pathType}`);
  }

  const data = JSON.parse(rawData);

  return dataWeightedMergeX(data, { mergeSpan });
}

/**
 * makes a weighted merge of the x values of each spectrum too close to each other using `ml-array-xy-weighted-merge`
 * @param {Data} data parsed json containing spectra to merge
 * @param {object} options
 * @param {number} [options.mergeSpan = 1] how close consecutive x values of a spectrum must be to be merged
 * @returns {Data} input data with X values of spectra merged
 */
function dataWeightedMergeX(data, options = {}) {
  const { mergeSpan = 1 } = options;
  let mergedData = [];

  for (let entry of data) {
    let mergedEntry = {
      kind: entry.kind,
      meta: entry.meta,
      data: spectrumWeightedMergeX(entry.data, {
        groupWidth: mergeSpan,
      }),
    };
    mergedData.push(mergedEntry);
  }
  return mergedData;
}
