import loadAndMergeX from '../loadData';

const testDataPath = './__tests__/data/loadData.json';
const simpleSpectra = './__tests__/data/twoSimpleSpectra.json';
const absPath =
  '/home/opatiny/git/cheminfo/dereplication/src/__tests__/data/twoSimpleSpectra.json';

describe('loadData', () => {
  it('should return merged test data', () => {
    const results = loadAndMergeX(testDataPath);

    // dealing with the DEL character hidden in the idcode (invisible)
    results[0].meta.idCode = escape(results[0].meta.idCode);
    results[0].meta.idCodeNoStereo = escape(results[0].meta.idCodeNoStereo);

    expect(results).toStrictEqual([
      {
        data: { x: [1.75, 4.5, 7], y: [4, 2, 1] },
        kind: 'IONS',
        meta: {
          idCode: 'fm%7Fap@E%60EIUVcrJJJJJJjJJKRYJVgI%7DdoZkZffjjjjjfj%60@@',
          idCodeNoStereo:
            'fm%7Fap@E%60EIUVcrJJJJJJjJJKRYJVgI%7DdoZkZffjjjjjfj%60@@',
        },
      },
    ]);
  });
  it('should parse two simple spectra', () => {
    const results = loadAndMergeX(simpleSpectra);

    expect(results).toStrictEqual([
      {
        data: { x: [1.5], y: [3] },
        kind: 'IONS',
        meta: { idCode: 'first', idCodeNoStereo: 'first' },
      },
      {
        data: { x: [1.75, 4.5, 7], y: [4, 2, 1] },
        kind: 'IONS',
        meta: { idCode: 'second', idCodeNoStereo: 'second' },
      },
    ]);
  });
  it('test pathType = absolute', () => {
    const results = loadAndMergeX(absPath, { pathType: 'absolute' });

    expect(results).toStrictEqual([
      {
        data: { x: [1.5], y: [3] },
        kind: 'IONS',
        meta: { idCode: 'first', idCodeNoStereo: 'first' },
      },
      {
        data: { x: [1.75, 4.5, 7], y: [4, 2, 1] },
        kind: 'IONS',
        meta: { idCode: 'second', idCodeNoStereo: 'second' },
      },
    ]);
  });
  it('test pathType is unknown type', () => {
    expect(() => loadAndMergeX(simpleSpectra, { pathType: 'test' })).toThrow(
      'Unknown path type: test',
    );
  });
});
