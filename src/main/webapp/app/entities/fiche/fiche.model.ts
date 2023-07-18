import { IHopital } from 'app/entities/hopital/hopital.model';
import { IService } from 'app/entities/service/service.model';
import { IMedecin } from 'app/entities/medecin/medecin.model';

export interface IFiche {
  id: number;
  ficheHop?: Pick<IHopital, 'id'> | null;
  hopital?: Pick<IHopital, 'id' | 'nomHop'> | null;
  service?: Pick<IService, 'id' | 'nomS'> | null;
  medecin?: Pick<IMedecin, 'id' | 'nomMed'> | null;
}

export type NewFiche = Omit<IFiche, 'id'> & { id: null };
