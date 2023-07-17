import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHopital, NewHopital } from '../hopital.model';

export type PartialUpdateHopital = Partial<IHopital> & Pick<IHopital, 'id'>;

export type EntityResponseType = HttpResponse<IHopital>;
export type EntityArrayResponseType = HttpResponse<IHopital[]>;

@Injectable({ providedIn: 'root' })
export class HopitalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hopitals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(hopital: NewHopital): Observable<EntityResponseType> {
    return this.http.post<IHopital>(this.resourceUrl, hopital, { observe: 'response' });
  }

  update(hopital: IHopital): Observable<EntityResponseType> {
    return this.http.put<IHopital>(`${this.resourceUrl}/${this.getHopitalIdentifier(hopital)}`, hopital, { observe: 'response' });
  }

  partialUpdate(hopital: PartialUpdateHopital): Observable<EntityResponseType> {
    return this.http.patch<IHopital>(`${this.resourceUrl}/${this.getHopitalIdentifier(hopital)}`, hopital, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHopital>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHopital[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHopitalIdentifier(hopital: Pick<IHopital, 'id'>): number {
    return hopital.id;
  }

  compareHopital(o1: Pick<IHopital, 'id'> | null, o2: Pick<IHopital, 'id'> | null): boolean {
    return o1 && o2 ? this.getHopitalIdentifier(o1) === this.getHopitalIdentifier(o2) : o1 === o2;
  }

  addHopitalToCollectionIfMissing<Type extends Pick<IHopital, 'id'>>(
    hopitalCollection: Type[],
    ...hopitalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const hopitals: Type[] = hopitalsToCheck.filter(isPresent);
    if (hopitals.length > 0) {
      const hopitalCollectionIdentifiers = hopitalCollection.map(hopitalItem => this.getHopitalIdentifier(hopitalItem)!);
      const hopitalsToAdd = hopitals.filter(hopitalItem => {
        const hopitalIdentifier = this.getHopitalIdentifier(hopitalItem);
        if (hopitalCollectionIdentifiers.includes(hopitalIdentifier)) {
          return false;
        }
        hopitalCollectionIdentifiers.push(hopitalIdentifier);
        return true;
      });
      return [...hopitalsToAdd, ...hopitalCollection];
    }
    return hopitalCollection;
  }
}
