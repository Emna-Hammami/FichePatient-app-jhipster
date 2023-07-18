import { IHopital } from 'app/entities/hopital/hopital.model';
import { IService } from 'app/entities/service/service.model';

export interface IMedecin {
  id: number;
  nomMed?: string | null;
  adresse?: string | null;
  tel?: number | null;
  fax?: number | null;
  email?: string | null;
  url?: string | null;
  hopital?: Pick<IHopital, 'id' | 'nomHop'> | null;
  service?: Pick<IService, 'id' | 'nomMed'> | null;
}

export type NewMedecin = Omit<IMedecin, 'id'> & { id: null };
