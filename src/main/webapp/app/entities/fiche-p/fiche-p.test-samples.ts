import { IFicheP, NewFicheP } from './fiche-p.model';

export const sampleWithRequiredData: IFicheP = {
  id: 5077,
  numDossier: 13052,
  nomPatient: 'Bedfordshire Gasoline',
};

export const sampleWithPartialData: IFicheP = {
  id: 29981,
  numDossier: 1370,
  nomPatient: 'West navigate though',
};

export const sampleWithFullData: IFicheP = {
  id: 22585,
  numDossier: 27320,
  nomPatient: 'Intelligent Awesome',
};

export const sampleWithNewData: NewFicheP = {
  numDossier: 1064,
  nomPatient: 'Martin',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
