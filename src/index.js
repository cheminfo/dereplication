import { similarity as Similarity } from 'ml-distance';

import computeSimilarities from './computeSimilarities';

const intersection = Similarity.intersection;

const experimental = './data/matchingExperiments.json';
const predicted = './data/predictions.json';

computeSimilarities(experimental, predicted, {
  numExperiments: undefined,
  bestMatch: {
    massFilter: 0.05,
  },
  loadData: {
    numberMaxPeaks: undefined,
    mergeSpan: 0.05,
    norm: true,
  },
  similarity: {
    alignDelta: 0.05,
    algorithm: intersection,
    norm: false,
  },
});
