import { similarity as Similarity } from 'ml-distance';

import loadAndMergeX from '../loadData';
import similarity from '../similarity';

const cosine = Similarity.cosine;

const experimentPath = './__tests__/data/experiment.json';
let exp6 = loadAndMergeX(experimentPath)[0];

const exp = {
  data: { x: [1, 2, 3, 4, 5, 6, 7], y: [1, 2, 3, 4, 5, 6, 7] },
  meta: {},
  kind: 'test',
};

const exp1 = {
  data: { x: [1, 2, 3], y: [1, 2, 3] },
  meta: {},
  kind: 'test',
};

const exp2 = {
  data: {
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  meta: {},
  kind: 'test',
};

const exp3 = {
  data: {
    x: [2, 4, 6, 8, 10, 12, 14],
    y: [1, 2, 3, 4, 5, 6, 7],
  },
  meta: {},
  kind: 'test',
};

const exp4 = {
  data: { x: [1, 2, 3, 4, 5, 6, 7], y: [2, 3, 4, 5, 6, 7, 8] },
  meta: {},
  kind: 'test',
};
const exp5 = {
  data: { x: [1, 2, 3, 4, 5, 6, 7], y: [0, 0, 0, 0, 0, 0, 1] },
  meta: {},
  kind: 'test',
};

const pred1 = {
  data: {
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  meta: {},
  kind: 'test',
};

const pred2 = {
  data: {
    x: [1, 2, 3, 4, 5, 6, 7],
    y: [1, 0, 0, 0, 0, 0, 0],
  },
  meta: {},
  kind: 'test',
};

describe('similarity', () => {
  it('should return similarity of 1', () => {
    expect(
      similarity(exp, exp, { alignDelta: 1, algorithm: cosine }),
    ).toStrictEqual({
      common: 7,
      similarity: 1,
    });
    expect(similarity(exp, exp, { alignDelta: 1, norm: true })).toStrictEqual({
      common: 7,
      similarity: 1,
    });
  });
  it('should return similarity of 0', () => {
    expect(similarity(exp1, exp, { alignDelta: 1, norm: true })).toStrictEqual({
      common: 3,
      similarity: 0,
    });
  });
  it('exp longer than pred, match', () => {
    expect(similarity(exp2, exp, { alignDelta: 1, norm: true })).toStrictEqual({
      common: 7,
      similarity: 1,
    });
  });
  it('pred longer than exp, match', () => {
    expect(similarity(exp, pred1, { alignDelta: 1, norm: true })).toStrictEqual(
      {
        common: 7,
        similarity: 1,
      },
    );
  });
  it('same length, all X slided', () => {
    expect(similarity(exp3, exp, { alignDelta: 1 })).toStrictEqual({
      common: 4,
      similarity: 0,
    });
  });
  it('same length, all Y slided', () => {
    // this is very close to 1 because one spectrum is
    // just more intense than the other and it is normalized.
    let result = similarity(exp4, exp, {
      alignDelta: 1,
      norm: true,
      massWeight: noWeight,
    });
    expect(result.similarity).toBeCloseTo(0.957, 2);
    expect(result.common).toBe(7);
  });
  it('same length, nothing matching', () => {
    expect(similarity(exp5, pred2)).toStrictEqual({ common: 7, similarity: 0 });
  });
  it('one experiment with itself', () => {
    expect(
      similarity(exp6, exp6, { alignDelta: 1, algorithm: cosine }),
    ).toStrictEqual({
      common: exp6.data.x.length,
      similarity: 1,
    });
  });
  it('test norm option (norm = true)', () => {
    const experiment = {
      data: {
        x: [1, 2, 3, 4, 5, 6, 7],
        y: [1, 0, 0, 0, 0, 0, 0],
      },
    };
    const prediction = {
      data: {
        x: [1, 2, 3, 4, 5, 6, 7],
        y: [1, 0, 0, 0, 0, 0, 0],
      },
    };
    expect(
      similarity(experiment, prediction, { alignDelta: 1, norm: true }),
    ).toStrictEqual({
      common: 7,
      similarity: 1,
    });
  });
  it('test massWeight option (no weighting)', () => {
    expect(
      similarity(exp, exp, {
        alignDelta: 1,
        norm: true,
        massWeight: noWeight,
      }),
    ).toStrictEqual({ common: 7, similarity: 1 });
  });
});

function noWeight(x, y) {
  return y;
}
