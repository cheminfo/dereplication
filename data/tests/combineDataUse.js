import { readFileSync } from 'fs';
import { join } from 'path';

import combineAndGenerateJSON from './combineData';

// import data from files
// benchmarking_dataset_spectral.mgf
let mgfRawData = readFileSync(join(__dirname, './test.mgf'), 'utf8');
// benchmarking_dataset_metadata.tsv
let csvRawData = readFileSync(join(__dirname, './test.tsv'), 'utf8');

combineAndGenerateJSON('experimental.json', mgfRawData, csvRawData);
