import similarity from '../similarity';

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

const pred = {
  data: { x: [1, 2, 3, 4, 5, 6, 7], y: [1, 2, 3, 4, 5, 6, 7] },
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
  it('should return 1', () => {
    expect(similarity(exp, pred)).toStrictEqual(1);
  });
  it('should return 0', () => {
    expect(similarity(exp1, pred)).toStrictEqual(0);
  });
  it('exp longer than pred, match', () => {
    expect(similarity(exp2, pred)).toStrictEqual(1);
  });
  it('pred longer than exp, match', () => {
    expect(similarity(exp, pred1)).toStrictEqual(1);
  });
  it('same length, all X slided', () => {
    expect(similarity(exp3, pred)).toStrictEqual(0);
  });
  it('same length, all Y slided', () => {
    // this is very close because one spectrum is
    // just more intense than the other and it is normalised.
    expect(similarity(exp4, pred)).toBeCloseTo(1, 2);
  });
  it('same length, nothing matching', () => {
    // this is very close because one spectrum is
    // just more intense than the other and it is normalised.
    expect(similarity(exp5, pred2)).toBe(0);
  });
});
