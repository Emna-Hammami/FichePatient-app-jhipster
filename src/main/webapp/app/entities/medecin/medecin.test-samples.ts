import { IMedecin, NewMedecin } from './medecin.model';

export const sampleWithRequiredData: IMedecin = {
  id: 14357,
  nomMed: 'Computer Extended Pound',
  adresse: 'vitae',
  tel: 11144,
  email: 'Maddison.Cormier@gmail.com',
  url: 'https://enchanting-amber.info/',
};

export const sampleWithPartialData: IMedecin = {
  id: 30060,
  nomMed: 'wearily compress',
  adresse: 'politely neural Tools',
  tel: 3068,
  fax: 15440,
  email: 'Gilda_Schuppe60@gmail.com',
  url: 'https://hoarse-seabass.net',
};

export const sampleWithFullData: IMedecin = {
  id: 111,
  nomMed: 'radian',
  adresse: 'yum man',
  tel: 14403,
  fax: 15147,
  email: 'Zachary_McKenzie@hotmail.com',
  url: 'https://soggy-honoree.name/',
};

export const sampleWithNewData: NewMedecin = {
  nomMed: 'Intersex Latin Courts',
  adresse: 'Legacy',
  tel: 9867,
  email: 'Deshaun_Stehr21@gmail.com',
  url: 'https://impolite-alpenhorn.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
