import { IStatistique, NewStatistique } from './statistique.model';

export const sampleWithRequiredData: IStatistique = {
  id: 12554,
};

export const sampleWithPartialData: IStatistique = {
  id: 2238,
};

export const sampleWithFullData: IStatistique = {
  id: 12816,
};

export const sampleWithNewData: NewStatistique = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
