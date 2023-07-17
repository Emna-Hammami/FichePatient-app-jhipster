import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedecin, NewMedecin } from '../medecin.model';

export type PartialUpdateMedecin = Partial<IMedecin> & Pick<IMedecin, 'id'>;

export type EntityResponseType = HttpResponse<IMedecin>;
export type EntityArrayResponseType = HttpResponse<IMedecin[]>;

@Injectable({ providedIn: 'root' })
export class MedecinService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medecins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(medecin: NewMedecin): Observable<EntityResponseType> {
    return this.http.post<IMedecin>(this.resourceUrl, medecin, { observe: 'response' });
  }

  update(medecin: IMedecin): Observable<EntityResponseType> {
    return this.http.put<IMedecin>(`${this.resourceUrl}/${this.getMedecinIdentifier(medecin)}`, medecin, { observe: 'response' });
  }

  partialUpdate(medecin: PartialUpdateMedecin): Observable<EntityResponseType> {
    return this.http.patch<IMedecin>(`${this.resourceUrl}/${this.getMedecinIdentifier(medecin)}`, medecin, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedecin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedecin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMedecinIdentifier(medecin: Pick<IMedecin, 'id'>): number {
    return medecin.id;
  }

  compareMedecin(o1: Pick<IMedecin, 'id'> | null, o2: Pick<IMedecin, 'id'> | null): boolean {
    return o1 && o2 ? this.getMedecinIdentifier(o1) === this.getMedecinIdentifier(o2) : o1 === o2;
  }

  addMedecinToCollectionIfMissing<Type extends Pick<IMedecin, 'id'>>(
    medecinCollection: Type[],
    ...medecinsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const medecins: Type[] = medecinsToCheck.filter(isPresent);
    if (medecins.length > 0) {
      const medecinCollectionIdentifiers = medecinCollection.map(medecinItem => this.getMedecinIdentifier(medecinItem)!);
      const medecinsToAdd = medecins.filter(medecinItem => {
        const medecinIdentifier = this.getMedecinIdentifier(medecinItem);
        if (medecinCollectionIdentifiers.includes(medecinIdentifier)) {
          return false;
        }
        medecinCollectionIdentifiers.push(medecinIdentifier);
        return true;
      });
      return [...medecinsToAdd, ...medecinCollection];
    }
    return medecinCollection;
  }
}
