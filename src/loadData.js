import { readFileSync } from 'fs';
import { join } from 'path';

import spectrumWeightedMergeX from 'ml-array-xy-weighted-merge';

/**
 * Loads, parses a JSON file. Then makes a weighted merge of the x values of each spectrum too close to each other using `ml-array-xy-weighted-merge`
 * @param {string} path relative path to json file
 * @param {object} options
 * @param {number} [options.mergeSpan = 1] how close consecutive x values of a spectrum must be to be merged
 * @returns {Data} data loaded, parsed and merged
 */
export default function loadAndMergeX(path, options = {}) {
  const { mergeSpan = 1 } = options;

  const rawData = readFileSync(join(__dirname, path), 'utf8');
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
