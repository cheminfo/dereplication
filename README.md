# dereplication

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

Handling large JSON files with experimental and predicted mass spectra. Computing similarity between an experiment and a predicted spectrum and finding best match.

## Installation

`$ npm i dereplication`

## Usage

The code underneath allows you to have a lot of information about the similarity results between experiments and predictions. To see the debug information, use this command:
```bash
DEBUG=testSimilarity node --max-old-space-size=8192 -r esm index.js 
```

The `--max-old-space-size=8192` option has to be used because Node.js cannot handle files this large otherwise.

The code underneath should be the contents of `index.js`.

```js
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
```

## [API Documentation](https://cheminfo.github.io/dereplication/)

CLick on this link to access the API documentation.

## Project documentation and results

- [dereplication.md](./docs/dereplication.md): explains how the code was written and what problems were encountered.
- [dereplicationData.md](./docs/dereplicationData.md): shows different similarity results when various parameters are varied. We try to optimize the position of the exact match.
- [dereplicationAllAlgorithms.md](./docs/dereplicationAllAlgorithms.md): results when testing various similarity algorithms.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/dereplication.svg
[npm-url]: https://www.npmjs.com/package/dereplication
[ci-image]: https://github.com/cheminfo/dereplication/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/dereplication/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/dereplication.svg
[download-url]: https://www.npmjs.com/package/dereplication
