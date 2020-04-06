import { Molecule } from 'openchemlib';

export default function appendIdCode(entries) {
  for (let entry of entries) {
    try {
      const molecule = Molecule.fromSmiles(entry.meta.SMILES);
      entry.meta.idCode = molecule.getIDCode();
      molecule.stripStereoInformation();
      entry.meta.idCodeNoStereo = molecule.getIDCode();
    } catch (e) {
      console.log(`Cannot parse smiles: ${entry.meta.SMILES}`);
    }
  }
}
