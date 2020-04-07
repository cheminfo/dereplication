import findBestMatches from './bestMatch';
import loadAndMergeX from './loadData';

const experimentsPath = './data/matchingExperiments.json';
const predictionsPath = './data/predictions.json';

const experiments = loadAndMergeX(experimentsPath);
const predictions = loadAndMergeX(predictionsPath);

const shortExperiments = experiments.slice(0, 9);

for (let experiment of shortExperiments) {
  const result = findBestMatches(experiment, predictions);
  console.log('matchIndex = ', result.matchIndex);
}
