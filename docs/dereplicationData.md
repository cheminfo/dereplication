# `cheminfo/dereplication`:  Bad similarity results

[README](../README.md) | [Dereplication main doc](./dereplication.md) | [Stats: comparing similarity algorithms](./dereplicationAllAlgorithms.md)

## General

After the `findBestMatches()` function was written, we started testing it on 10 experiments and the complete predicted data. To evaluate if the similarity is good or not, we want to optimize the `matchIndex`: the index of the exact match (the predicted spectrum that actually corresponds to the experiment) in an array of all predictions sorted by similarity with the experiment. 

Ideally, `matchIndex`should be 1, which would mean that the best similarity is between the experiment and the correct predicted spectrum.

## Changing `mergeSpan` and `alignDelta` values (2020.04.08)

**NB:** According to the specification of `align()`, `mergeSpan` must be bigger or equal to `alignDelta`!

The first tests we made, however, were fairly bad. Here is what we obtained for the first 10 experiments with all default options (mergeSpan = 1, alignDelta = 1, algorithm = cosine):

```bash
mergeSpan = 1, alignDelta = 1, algorithm = cosine

experiment   common     matchIndex
1            32         4260
2            31         71345
3            30         40876
4            18         98723
5            11         55451
6            15         11970
7            14         48598
8            21         7381
9            36         39856
10           38         17944
```

To enhance this, we thought about setting the `mergeSpan` of `loadData()` to 0.005, but it did not help.

```bash
mergeSpan = 0.05, alignDelta = 1, algorithm = cosine

experiment   common     matchIndex
1            45         4879
2            32         65890
3            31         41169
4            27         137461
5            33         108171
6            19         24138
7            22         30797
8            32         7090
9            43         17822
10           44         16573
```

Then, we tried changing the `alignDelta` option of `similarity()` to 0.005.

Changing both: `mergeSpan` = 0.005, `alignDelta` = 0.005

```bash
mergeSpan = 0.05, alignDelta = 0.05, algorithm = cosine

experiment   common     matchIndex
1            45         4879
2            32         65890
3            31         41169
4            27         137461
5            33         108171
6            19         24138
7            22         30797
8            32         7090
9            43         17822
10           44         16573
```

**WARNING:** From here on, if the similarity between an experiment and its true match is zero, the `matchIndex` is set to `predictions.length`.

## Changing similarity algorithm (2020.04.09)

Median of matchIndex for the first 200 experiments.

```txt
Algorithm   norm in loadData     norm in similarity
cosine                  15'908                15908
intersection               337                2'510
```

## Norm in `loadData` or in `similarity` (2020.04.09)

We tried to change where the spectra are normed. We either normed in `loadData` (so before even merging) or in `similarity`, before the `align()`function.

Observations:
- Norm in `loadData` gives better results when `algorithm = intersection`
- Where the data is normed has no influence on the median when `algorithm = cosine`

Further tests in [dereplicationStats.md](./dereplicationStats.md) have shown that normalizing in `similarity` gives worse results for seven out of eight similarity algorithms, excepted `cosine`. THis shows that the cosine algorithm probably normalizes the data internally.

**Comment:** The fact that normalizing the spectra in similarity, after aligning them gives worse results is worrying. Indeed, it implies that the data that we discard when aligning has some importance.

## Varying Y values weight (2020.04.09)

We thought about weighting the Y values of the spectra by the X values to enhance the data. This means that we give more importance to bigger fragments, which have a bigger mass. This is done in the `similarity()` method, just before the similarity algorithm is applied.

Parameters:
- number of experiments: 200
- algorithm: `intersection`
- normalizing in loadData
- `matchIndex` set to `predictions.length` if similarity is zero

```bash
Weight   Median
x           239
x^2         206
x^3         168
x^4         154
x^10        128
log(x)      297
2^x         205
10^x        119
```

Based on these results, we decided to use a weight of x^3 from here on.

## `sufficientCommon` (2020.04.14)



Here, we count how many experiment/prediction couples have more than 6 common values after aligning. This allows us to check that the align algorithm does not eliminate too many predictions.

Here are the results for the first 50 experiments.


```bash
number experiments: 200, mergeSpan: 0.05, alignDelta: 0.05, algorithm: intersection, norm: loadData

experiment   sufficientCommon 
  1          120389       
  2          120320      
  3          116778       
  4          119397       
  5          84968        
  6          18677        
  7          1360         
  8          235          
  9          17849        
  10         17006        
  11         68129        
  12         45366        
  13         6694         
  14         987          
  15         173          
  16         413          
  17         86           
  18         63692        
  19         461          
  20         54232        
  21         10181        
  22         59652        
  23         53120        
  24         72828        
  25         1529         
  26         6028         
  27         5242         
  28         21743        
  29         255          
  30         40564        
  31         45306        
  32         39185        
  33         45586        
  34         6344         
  35         221          
  36         0            
  37         1094         
  38         3511         
  39         0            
  40         33187        
  41         30533        
  42         11427        
  43         1760         
  44         21473        
  45         66848        
  46         67183        
  47         37872        
  48         41745        
  49         36856        
  50         47677        
```

## Data for a first hit (2020.04.14)

Here are the result that we got for an experiment which correct prediction had the best similarity. We see that they were not a lot of common values between the experiment and it's correct match. However, they were still 413 predictions for which the similarity was computed.

```bash
number experiments: 50, mergeSpan: 0.05, alignDelta: 0.05, algorithm: intersection, norm: loadData

experiment   common     matchIndex similarity      sufficientCommon

16           7          1          1209490763.96   413      
```

## Execution time (2020.04.14)

### Loading data (`loadAndMerge()`)

The time taken to load all the data (matching experiments and predictions) from the JSON files is **6.83s**.

### Finding best match for 50 experiments (`testSimilarity()`)

The time taken to find the best match in all the 1705999 predictions.

Time for 50 experiments: **17.18s**

Average time per experiment: **0.34s**

### Finding best match for all matching experiments

Time for 772 experiments: **363.90s**

Average time per experiment: **0.47s**

### Finding best match for all matching experiments, massFilter = 0.05

Time for 772 experiments: **84.37s**

Average time per experiment: **0.11s**

### Finding best match for all matching experiments, massFilter = 0.05, after optimization of the code

By optimization, we mean that we stop pushing some of the entries if the similarity is zero, so that the `sort` is faster. So if the similarity of the experiment with the exact match is zero, we just set its `matchIndex` to `predictions.length`.

Time for 772 experiments: **71.43s**

Average time per experiment: **0.09s**

## `stats` object when all experiments are processed (2020.04.14)

### norm in loadData (default)

```bash
number experiments: 772, mergeSpan: 0.05, alignDelta: 0.05, algorithm: intersection, norm: loadData

  { average: 67516.42098445595,
    median: 1296,
    min: 1,
    max: 170599,
    matchIndexHistogram: { '1': 25, '2': 10, '3': 12 },
    matchIndexHistogramPercent:
     { '1': 3.2383419689119166,
       '2': 1.2953367875647668,
       '3': 1.5544041450777202 } }
```

### norm in similarity and loadData (`both`)

```bash
number experiments: 772, mergeSpan: 0.05, alignDelta: 0.05, algorithm: intersection, norm: both

  { average: 87092.94300518135,
    median: 73111,
    min: 1,
    max: 170599,
    matchIndexHistogram: { '1': 2, '2': 3, '3': 3 },
    matchIndexHistogramPercent:
     { '1': 0.2590673575129534,
       '2': 0.38860103626943004,
       '3': 0.38860103626943004 } }
```

### norm in loadData, massFilter = 0.05

```bash
number experiments: 772, mergeSpan: 0.05, alignDelta: 0.05, algorithm: intersection, norm: loadData, massWeight: defaultMassWeight, massFilter: 0.05

 { average: 72501.90284974093,
   median: 76,
   min: 1,
   max: 170599,
   matchIndexHistogram: { '1': 68, '2': 45, '3': 23, '4': 24, '5': 13 },
   matchIndexHistogramPercent:
    { '1': 8.81,
      '2': 5.83,
      '3': 2.98,
      '4': 3.11,
      '5': 1.68
      '170599': 42.49 } }
```

### loadData.treatment = maxPeaks, numberMaxPeaks = 30 (2020.04.16)

First test after adding this option.

WARNING: Here data is only filtered by maxPeaks -> no mergeX!!!

```bash
number experiments: 772, mergeSpan: 0.05, alignDelta: 0.05, loadData.norm: true, similarity.norm: false, massWeight: *x^3, massFilter: 0.05

 time to treat data:  73885

{ average: 102324.01165803109,
  median: 170599,
  min: 1,
  max: 170599,
  matchIndexHistogram:
   { '1': 69, '2': 32, '3': 23, '4': 11, '5': 10, '170599': 463 },
  matchIndexHistogramPercent:
   { '1': '8.94',
     '2': '4.15',
     '3': '2.98',
     '4': '1.42',
     '5': '1.30',
     '170599': '59.97' } }
```

## Varying numberMaxPeaks (2020.04.16)

### Parameters for all
 number experiments: 772, mergeSpan: 0.05, alignDelta: 0.05, loadData.norm: true, similarity.norm: false, massWeight: *x^3, massFilter: 0.05

### numberMaxPeaks = 30

WARNING: Here data is only filtered by maxPeaks -> no mergeX!!!

```bash
{ average: 102324.01165803109,
  median: 170599,
  min: 1,
  max: 170599,
  matchIndexHistogram:
   { '1': 69, '2': 32, '3': 23, '4': 11, '5': 10, '170599': 463 },
  matchIndexHistogramPercent:
   { '1': '8.94',
     '2': '4.15',
     '3': '2.98',
     '4': '1.42',
     '5': '1.30',
     '170599': '59.97' } }
```

### numberMaxPeaks = 100

WARNING: Here data is only filtered by maxPeaks -> no mergeX!!!

```bash
{ average: 73607.29792746114,
  median: 83,
  min: 1,
  max: 170599,
  matchIndexHistogram:
   { '1': 65, '2': 45, '3': 25, '4': 22, '5': 8, '170599': 333 },
  matchIndexHistogramPercent:
   { '1': '8.42',
     '2': '5.83',
     '3': '3.24',
     '4': '2.85',
     '5': '1.04',
     '170599': '43.13' } }
```

### numberMaxPeaks = 200

WARNING: Here data is only filtered by maxPeaks -> no mergeX!!!

```bash
{ average: 72282.78626943006,
  median: 79,
  min: 1,
  max: 170599,
  matchIndexHistogram:
   { '1': 62, '2': 44, '3': 25, '4': 24, '5': 10, '170599': 327 },
  matchIndexHistogramPercent:
   { '1': '8.03',
     '2': '5.70',
     '3': '3.24',
     '4': '3.11',
     '5': '1.30',
     '170599': '42.36' } }
```

### numberMaxPeaks = 30 and merging X!

```bash
{ average: 101661.61917098446,
  median: 170599,
  min: 1,
  max: 170599,
  matchIndexHistogram:
   { '1': 67, '2': 34, '3': 19, '4': 13, '5': 9, '170599': 460 },
  matchIndexHistogramPercent:
   { '1': '8.68',
     '2': '4.40',
     '3': '2.46',
     '4': '1.68',
     '5': '1.17',
     '170599': '59.59' } }
```

### Conclusions

Filtering the max intensity peaks gives worse results. They are less hits in the top five and a lot more cases where similarity with the exact match is zero.