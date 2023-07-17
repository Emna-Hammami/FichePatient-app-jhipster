export interface IFicheP {
  id: number;
  numDossier?: number | null;
  nomPatient?: string | null;
}

export type NewFicheP = Omit<IFicheP, 'id'> & { id: null };
