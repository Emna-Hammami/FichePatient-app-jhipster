import { IHopital, NewHopital } from './hopital.model';

export const sampleWithRequiredData: IHopital = {
  id: 3312,
  nomHop: 'madly',
};

export const sampleWithPartialData: IHopital = {
  id: 29272,
  nomHop: 'Northwest Ireland',
};

export const sampleWithFullData: IHopital = {
  id: 28896,
  nomHop: 'Licensed Northeast',
};

export const sampleWithNewData: NewHopital = {
  nomHop: 'protocol however Optimization',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
