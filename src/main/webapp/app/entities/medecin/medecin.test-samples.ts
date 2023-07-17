import { IMedecin, NewMedecin } from './medecin.model';

export const sampleWithRequiredData: IMedecin = {
  id: 18716,
  nomMed: 'transparent protocol becquerel',
  adresse: 'female Supervisor networks',
  tel: 15014,
  email: 'Abigail_Bruen@gmail.com',
  url: 'https://pointless-switchboard.org/',
};

export const sampleWithPartialData: IMedecin = {
  id: 27116,
  nomMed: 'Paradigm',
  adresse: 'Southwest',
  tel: 31681,
  fax: 19321,
  email: 'Margot.Oberbrunner47@hotmail.com',
  url: 'https://grown-shoe-horn.com',
};

export const sampleWithFullData: IMedecin = {
  id: 4878,
  nomMed: 'Dynamic',
  adresse: 'Fundamental content',
  tel: 30206,
  fax: 11342,
  email: 'Marcelle91@hotmail.com',
  url: 'https://beloved-limo.com',
};

export const sampleWithNewData: NewMedecin = {
  nomMed: 'Computers male Fresh',
  adresse: 'Bicycle farad Electronic',
  tel: 22644,
  email: 'Evelyn96@hotmail.com',
  url: 'https://turbulent-ballot.org/',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
