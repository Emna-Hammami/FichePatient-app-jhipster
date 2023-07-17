export interface IMedecin {
  id: number;
  nomMed?: string | null;
  adresse?: string | null;
  tel?: number | null;
  fax?: number | null;
  email?: string | null;
  url?: string | null;
}

export type NewMedecin = Omit<IMedecin, 'id'> & { id: null };
