import { IFicheP, NewFicheP } from './fiche-p.model';

export const sampleWithRequiredData: IFicheP = {
  id: 779,
  numDossier: 28089,
  nomPatient: 'yacht',
};

export const sampleWithPartialData: IFicheP = {
  id: 13955,
  numDossier: 2978,
  nomPatient: 'Buckinghamshire',
};

export const sampleWithFullData: IFicheP = {
  id: 15157,
  numDossier: 27072,
  nomPatient: 'application Folk',
};

export const sampleWithNewData: NewFicheP = {
  numDossier: 18576,
  nomPatient: 'sometimes',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
