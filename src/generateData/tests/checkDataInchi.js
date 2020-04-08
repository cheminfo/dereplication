import { readFileSync } from 'fs';
import { join } from 'path';

const predictedRawData = readFileSync(
  join(__dirname, './predicted.json'),
  'utf8',
);
const experimentalRawData = readFileSync(
  join(__dirname, './experimental.json'),
  'utf8',
);

const predictions = JSON.parse(predictedRawData);
const experiments = JSON.parse(experimentalRawData);

// transforming predicted to object of objects with properties
let inchiPredictions = {};
let noInchi = 0;

for (let prediction of predictions) {
  if (
    prediction.meta.INCHI &&
    prediction.meta.INCHI !== 'N/A' &&
    prediction.meta.INCHI !== null
  ) {
    inchiPredictions[prediction.meta.INCHI] = prediction;
  } else {
    noInchi++; // check if some entries do not have a spectrum_id_val (here: 1)
  }
}

console.log({ noInchi });

let noPredictionFound = 0;

for (let experiment of experiments) {
  if (inchiPredictions[experiment.meta.INCHI] === undefined) {
    noPredictionFound++;
  }
}

console.log(
  `There was no prediction found for ${noPredictionFound} experiments.`,
);
