export interface IStatistique {
  id: number;
}

export type NewStatistique = Omit<IStatistique, 'id'> & { id: null };
