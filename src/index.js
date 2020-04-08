import testSimilarity from './testSimilarity';

const experimental = './data/matchingExperiments.json';
const predicted = './data/predictions.json';

testSimilarity(experimental, predicted, {
  numExperiments: 10,
  alignDelta: 0.005,
});
