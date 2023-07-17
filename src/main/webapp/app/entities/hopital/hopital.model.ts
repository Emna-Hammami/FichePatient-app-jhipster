export interface IHopital {
  id: number;
  nomHop?: string | null;
}

export type NewHopital = Omit<IHopital, 'id'> & { id: null };
