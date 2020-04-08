import { Molecule } from 'openchemlib';

/**
 * Append ID code (with and without stereochemistry) to the meta of each spectrum. ID code is computed using SMILES.
 * @param {array<object>} entries data to which you want to append idCode and idCodeNoStereo (in place modicication)
 */
export default function appendIdCode(entries) {
  console.log('Appending ID code.');
  let noValidSmiles = 0;
  let counter = 0;
  let length = entries.length;
  for (let entry of entries) {
    try {
      const molecule = Molecule.fromSmiles(entry.meta.SMILES);
      entry.meta.idCode = molecule.getIDCode();
      molecule.stripStereoInformation();
      entry.meta.idCodeNoStereo = molecule.getIDCode();
    } catch (e) {
      noValidSmiles++;
      console.log(`Cannot parse smiles: ${entry.meta.SMILES}`);
    }
    counter++;
    if (!(counter % 1000)) {
      console.log(`Entry ${counter} / ${length}`);
    }
  }
  console.log(
    `${noValidSmiles} of ${entries.length} SMILES could not be parsed.`,
  );
}
