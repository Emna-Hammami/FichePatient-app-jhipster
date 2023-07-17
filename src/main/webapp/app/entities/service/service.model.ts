export interface IService {
  id: number;
  nomS?: string | null;
  description?: string | null;
}

export type NewService = Omit<IService, 'id'> & { id: null };
