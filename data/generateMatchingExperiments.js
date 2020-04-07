import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const predictedRawData = readFileSync(
  join(__dirname, './predictions.json'),
  'utf8',
);
const experimentalRawData = readFileSync(
  join(__dirname, './experiments.json'),
  'utf8',
);

const predicted = JSON.parse(predictedRawData);
const experimental = JSON.parse(experimentalRawData);

const remainingExperiments = returnMatchExperiments(experimental, predicted);
// There was no prediction found for 99 of 871 experiments.
// this leaves us around 780 spectra to work with.

// generate JSON
writeFileSync(
  join(__dirname, './matchingExperiments.json'),
  JSON.stringify(remainingExperiments, undefined, 2),
  'utf8',
);

console.log(`matchingExperiments.json has been generated.`);

/**
 * Verify how many spectra of the experimental data have a match in the predictions (using entry.meta.idCodeNoStereo). A message is printed in the console. Returns an object with all matching experiments.
 * @param {array<objectY} experiments experimental data with idCodeNoStereo in the meta of each spectrum
 * @param {array<objectY} predictions predicted data with idCodeNoStereo in the meta of each spectrum
 * @returns {array<object} all matching experiments
 */
export default function returnMatchExperiments(experiments, predictions) {
  // transforming predicted to object of objects with properties
  let idPredictions = {};
  let noID = 0;

  for (let prediction of predictions) {
    let id = prediction.meta.idCodeNoStereo;
    if (id) {
      idPredictions[id] = prediction;
    } else {
      // check if some entries do not have an id code no stereo
      // (there should be none, for we add it to the entries)
      noID++;
    }
  }

  console.log({ noID });

  let matchingExperiments = [];
  let noPredictionFound = 0;

  for (let experiment of experiments) {
    if (idPredictions[experiment.meta.idCodeNoStereo] === undefined) {
      console.log(
        `No match in predictions for idCode ${experiment.meta.idCodeNoStereo}`,
      );
      noPredictionFound++;
    } else {
      matchingExperiments.push(experiment);
    }
  }

  console.log(
    `There was no prediction found for ${noPredictionFound} of ${experiments.length} experiments.`,
  );

  return matchingExperiments;
}
