import { IHopital } from 'app/entities/hopital/hopital.model';

export interface IService {
  id: number;
  nomS?: string | null;
  description?: string | null;
  hopital?: Pick<IHopital, 'id' | 'nomHop'> | null;
}

export type NewService = Omit<IService, 'id'> & { id: null };
