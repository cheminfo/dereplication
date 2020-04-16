import { readFileSync } from 'fs';
import { join } from 'path';

import normalize from 'ml-array-normed';
import spectrumWeightedMergeX from 'ml-array-xy-weighted-merge';
import { XY } from 'ml-spectra-processing';

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
 * @param {object} [options={}]
 * @param {string} [options.treatment="mergeX"] If 'mergeX': x spectra values are merged with span `mergeSpan`, if 'maxPeaks' return `numberMaxPeaks` peaks of the spectra
 * @param {number} [options.numberMaxPeaks=30] Used if options.treatment='maxPeaks'. Number of max. intensity peaks to keep. This removes some of the spectrum noise.
 * @param {number} [options.mergeSpan=0.05] How close consecutive x values of a spectrum must be to be merged
 * @param {string} [options.pathType="relative"] Allows to define wether the path to the JSON is "relative" or "absolute"
 * @param {bool}   [options.norm=true] If `true`, the spectra data are normalized before merging too close x values.
 * @returns {Data} Data loaded, parsed and merged
 */
export default function loadAndMergeX(path, options = {}) {
  const {
    pathType = 'relative',
    treatment = 'mergeX',
    numberMaxPeaks = 30,
    mergeSpan = 0.05,
    norm = true,
  } = options;
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

  const spectra = JSON.parse(rawData);

  // normalizing the spectra at this step
  if (norm) {
    for (let spectrum of spectra) {
      spectrum.data.y = normalize(spectrum.data.y);
    }
  }
  switch (treatment) {
    case 'mergeX':
      return dataWeightedMergeX(spectra, { mergeSpan });
    case 'maxPeaks':
      return dataKeepMaxPeaks(spectra, { numberMaxPeaks });
    default:
      throw new Error(`Unknown treatment type: ${treatment}`);
  }
}

/**
 * makes a weighted merge of the x values of each spectrum too close to each other using `ml-array-xy-weighted-merge`
 * @param {Data} spectra parsed json containing spectra to merge
 * @param {object} options
 * @param {number} [options.mergeSpan=1] how close consecutive x values of a spectrum must be to be merged
 * @returns {Data} input data with X values of spectra merged
 */
function dataWeightedMergeX(spectra, options = {}) {
  const { mergeSpan = 0.05 } = options;
  let mergedSpectra = [];

  for (let spectrum of spectra) {
    let mergedSpectrum = {
      kind: spectrum.kind,
      meta: spectrum.meta,
      data: spectrumWeightedMergeX(spectrum.data, {
        groupWidth: mergeSpan,
      }),
    };
    mergedSpectra.push(mergedSpectrum);
  }
  return mergedSpectra;
}

function dataKeepMaxPeaks(spectra, options = {}) {
  const { numberMaxPeaks = 30 } = options;

  let maxPeaksSpectra = [];

  for (let spectrum of spectra) {
    let maxPeaksSpectrum = {
      kind: spectrum.kind,
      meta: spectrum.meta,
      data: XY.getNMaxY(spectrum.data, numberMaxPeaks),
    };
    maxPeaksSpectra.push(maxPeaksSpectrum);
  }
  return maxPeaksSpectra;
}
