import mlMedian from 'ml-array-median';

import median from '../median';

describe('median', () => {
  it('should return 3', () => {
    let a = [1, 2, 3, 4, 5];
    expect(median(a, a.length)).toStrictEqual(3);
  });
  it('even length array', () => {
    let a = [1, 2, 3, 4, 5, 5];
    expect(median(a, a.length)).toStrictEqual(3);
  });
  it('array with some values not pushed', () => {
    let a = [1, 2, 3, 4];
    expect(median(a, a.length + 2)).toStrictEqual(3);
  });
  it('median is the default value', () => {
    let a = [1, 2, 3];
    expect(median(a, a.length + 4)).toStrictEqual(7);
  });
  it('compare with ml-array-median (wicked test)', () => {
    let a = [1, 2, 3];
    let b = [1, 2, 3, 5, 5, 5, 5];
    expect(median(a, a.length + 4)).toStrictEqual(7);
    expect(mlMedian(b)).toStrictEqual(5);
  });
  it('check ml-array-median behavior', () => {
    let a = [1, 2, 3, 4, 5, 5];
    let commonResult = 3;
    expect(median(a, a.length)).toStrictEqual(commonResult);
    expect(mlMedian(a)).toStrictEqual(commonResult);
  });
  it('check ml-array-median behavior 2', () => {
    let a = [1, 2, 3, 4, 5, 5, 5];
    let commonResult = 4;
    expect(median(a, a.length)).toStrictEqual(commonResult);
    expect(mlMedian(a)).toStrictEqual(commonResult);
  });
  it('check ml-array-median behavior 3', () => {
    let a = [1, 2];
    let commonResult = 1;
    expect(median(a, a.length)).toStrictEqual(commonResult);
    expect(mlMedian(a)).toStrictEqual(commonResult);
  });
});
