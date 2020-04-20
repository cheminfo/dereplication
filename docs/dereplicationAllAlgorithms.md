# Changing parameters to see the impact on all the different similarity algorithms (2020.04.09)

[README](../README.md) | [Dereplication main doc](./dereplication.md) | [Stats: varying all parameters](./dereplicationData.md) 

## General

The variable that we monitor is the median of the matchIndex of the first 200 experiments.

`matchIndex` is set to `predictions.length` if similarity is zero.

The `massFilter` option was not existing yet.

## Parameters we test and default values

1. Number of experiments for which matchIndex is computed: `numExperiments`
2. Wether the spectra are normed in `loadData` or in `similarity`: `norm`
3. What algorithm is used to compute the similarity: `algorithm`
4. `mergeSpan`
5. `alignSpan`
6. Weight of Y values: `weight`

We set some default values for all these parameters, and then only vary one at a time. Here are the default values:
1. `numExperiments`: 200
2. `norm`:           in `loadData`
3. `algorithm`:      we test all algorithms each time
4. `mergeSpan`:      0.05
5. `alignSpan`:      0.05
6. `weight`:         x^3

## Results with default values

| Algorithm     | Median |
|---------------|---------
| `cosine`      |  12814  |
| `czekanowski` |  11342  |
| `dice`        |  9585   |
| `intersection`|  168    |
| `jaccard`     |  9585   |
| `kulczynski`  |  11342  |
| `motyka`      |  11342  |


## `norm`: in `similarity` (2)

| Algorithm     | Median |
|---------------|---------
| `cosine`      |  12814  |
| `czekanowski` |  16326  |
| `dice`        |  12964  |
| `intersection`|  16326  |
| `jaccard`     |  12964  |
| `kulczynski`  |  16326  |
| `motyka`      |  16326  |

## `mergeSpan`: 0.5 (4)

| Algorithm     | Median |
|---------------|---------
| `cosine`      |  15305  |
| `czekanowski` |  14642  |
| `dice`        |  14655  |
| `intersection`|  255    |
| `jaccard`     |  14655  |
| `kulczynski`  |  14642  |
| `motyka`      |  14642  |

## `alignDelta`: 0.5 (5)

| Algorithm     | Median |
|---------------|---------
| `cosine`      |  36607  |
| `czekanowski` |  32929  |
| `dice`        |  33408  |
| `intersection`|  819    |
| `jaccard`     |  33408  |
| `kulczynski`  |  32929  |
| `motyka`      |  32929  |


## `mergeSpan`: 0.5 and `alignDelta`: 0.5 (4 and 5)

| Algorithm     | Median |
|---------------|---------
| `cosine`      |  15305  |
| `czekanowski` |  14642  |
| `dice`        |  14655  |
| `intersection`|  255    |
| `jaccard`     |  14655  |
| `kulczynski`  |  14642  |
| `motyka`      |  14642  |

## `weight` : none (6)

| Algorithm     | Median |
|---------------|---------
| `cosine`      |  15908 |
| `czekanowski` |  9702  |
| `dice`        |  8086  |
| `intersection`|  337   |
| `jaccard`     |  8086  |
| `kulczynski`  |  9702  |
| `motyka`      |  9702  |


## `weight` : none, `mergeSpan`: 0.5 and `alignDelta`: 0.5 (4, 5 and 6)

(done by mistake)

| Algorithm     | Median |
|---------------|---------
| `cosine`      |  32194  |
| `czekanowski` |  19516  |
| `dice`        |  13614  |
| `intersection`|  663    |
| `jaccard`     |  13614  |
| `kulczynski`  |  19516  |
| `motyka`      |  19516  |

More tests on the `weight` parameter were done in [dereplicationData.md](./dereplicationData.md)





