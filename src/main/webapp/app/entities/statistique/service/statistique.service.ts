import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStatistique, NewStatistique } from '../statistique.model';

export type PartialUpdateStatistique = Partial<IStatistique> & Pick<IStatistique, 'id'>;

export type EntityResponseType = HttpResponse<IStatistique>;
export type EntityArrayResponseType = HttpResponse<IStatistique[]>;

@Injectable({ providedIn: 'root' })
export class StatistiqueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/statistiques');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(statistique: NewStatistique): Observable<EntityResponseType> {
    return this.http.post<IStatistique>(this.resourceUrl, statistique, { observe: 'response' });
  }

  update(statistique: IStatistique): Observable<EntityResponseType> {
    return this.http.put<IStatistique>(`${this.resourceUrl}/${this.getStatistiqueIdentifier(statistique)}`, statistique, {
      observe: 'response',
    });
  }

  partialUpdate(statistique: PartialUpdateStatistique): Observable<EntityResponseType> {
    return this.http.patch<IStatistique>(`${this.resourceUrl}/${this.getStatistiqueIdentifier(statistique)}`, statistique, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStatistique>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStatistique[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStatistiqueIdentifier(statistique: Pick<IStatistique, 'id'>): number {
    return statistique.id;
  }

  compareStatistique(o1: Pick<IStatistique, 'id'> | null, o2: Pick<IStatistique, 'id'> | null): boolean {
    return o1 && o2 ? this.getStatistiqueIdentifier(o1) === this.getStatistiqueIdentifier(o2) : o1 === o2;
  }

  addStatistiqueToCollectionIfMissing<Type extends Pick<IStatistique, 'id'>>(
    statistiqueCollection: Type[],
    ...statistiquesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const statistiques: Type[] = statistiquesToCheck.filter(isPresent);
    if (statistiques.length > 0) {
      const statistiqueCollectionIdentifiers = statistiqueCollection.map(
        statistiqueItem => this.getStatistiqueIdentifier(statistiqueItem)!
      );
      const statistiquesToAdd = statistiques.filter(statistiqueItem => {
        const statistiqueIdentifier = this.getStatistiqueIdentifier(statistiqueItem);
        if (statistiqueCollectionIdentifiers.includes(statistiqueIdentifier)) {
          return false;
        }
        statistiqueCollectionIdentifiers.push(statistiqueIdentifier);
        return true;
      });
      return [...statistiquesToAdd, ...statistiqueCollection];
    }
    return statistiqueCollection;
  }
}
