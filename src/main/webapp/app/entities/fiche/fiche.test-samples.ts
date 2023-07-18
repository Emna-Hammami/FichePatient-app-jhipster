import { IFiche, NewFiche } from './fiche.model';

export const sampleWithRequiredData: IFiche = {
  id: 23919,
};

export const sampleWithPartialData: IFiche = {
  id: 28903,
};

export const sampleWithFullData: IFiche = {
  id: 14583,
};

export const sampleWithNewData: NewFiche = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
