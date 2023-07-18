import { IStatistique, NewStatistique } from './statistique.model';

export const sampleWithRequiredData: IStatistique = {
  id: 21020,
};

export const sampleWithPartialData: IStatistique = {
  id: 23176,
};

export const sampleWithFullData: IStatistique = {
  id: 11638,
};

export const sampleWithNewData: NewStatistique = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
