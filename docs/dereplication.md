# `cheminfo/dereplication`

[README](../README.md) | [Stats: varying all parameters](./dereplicationData.md) | [Stats: comparing similarity algorithms](./dereplicationAllAlgorithms.md)

## Goal
Write a similarity algorithm that allows to find best matches of predicted mass spectra for an experimental mass spectrum.

## Context

Same as [mgf-parser](./mgf-parser.md).

**Definition:** "Dereplication is a process used in recognising and eliminating the active substances that have already been studied in the early stage of the screening process." - [https://www.thefreedictionary.com/Dereplication](https://www.thefreedictionary.com/Dereplication)

**Client:** UNIGE

## Main steps

1. Parse experimental and predicted mass spectra data that are in .mgf, .csv and .tsv formats. Then generate two JSON files with the data (`experiments.json`and `predictions.json`).
2. Verify if each experimental spectrum has a match in the predictions using the idCode.
3. Generate a file `matchingExperiments,json` with only the spectra with a corresponding prediction.
4. Write a method to load the experimental and predicted data json files and apply a weighted merge to the X values of all the spectra.
5. Write a method `similarity()` that returns the similarity between two spectra. The similarity function should be an option, default is `cosine()`. Main functions used: `align()`, `norm()`and `cosine()`.
6. Write a function `findBestMatches()` that runs `similarity()` for one experimental spectrum and an array of predicted spectra. It should return the best matches and meta-information.

## Packages used

- `mgf-parser`: To parse the mgf files
- `papaparse`: To parse the csv files
- `openchemlib`: Obtain the id code from SMILES
- `ml-array-xy-weighted-merge`: Weighted merge of x values that are too close to each other in `loadData.js`
- `ml-spectra-processing`: Use the `align` method to align experimental and predicted spectrum for similarity
- `ml-distance`: Access to the similarity algorithms (e.g. cosine similarity)
- `ml-array-normed`: To normalize the aligned spectra
- `ml-array-min`, `ml-array-max`, `ml-array-mean`, `ml-array-median`: To generate stats on the matchIndex of many experiments
- `debug` (dev): to output things from `testSimilarity()` in the console

## Problems

### Step 1: Handling very large files

While wanting to parse the database, we had a problem with node.js, which threw the error:

```bash
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

Indeed the file was too big to be handled by node as it is. To solve this, we can use the option `--max-old-space-size` like so:

```bash
node --max-old-space-size=8192 -r esm combineMgfCsv.js
```

### Stap 2: Verify if experiments have a match in predictions

We tried to use the InChi to see wether each experiment has a prediction. However, this did not work, because many experiments did not have one. Therefore, we had to find another unique identifier to match predictions and experiments.

We decided to use `openchemlib`and to generate the ID code of the molecules using the SMILES. Yet again, around half of the experiments did not have a valid SMILES. It appears that the molecule either have the SMILES or the InChi. 

We will therefore have to find a way to convert InChi into SMILES, to be able to then work with the other half of the experimental data.

### Step 6: Bad similarity results

We have documented the results of various tests we have led, varying a handful parameters in [dereplicationData.md](./dereplicationData.md) and in [dereplicationStats.md](./dereplicationAllAlgorithms.md)
