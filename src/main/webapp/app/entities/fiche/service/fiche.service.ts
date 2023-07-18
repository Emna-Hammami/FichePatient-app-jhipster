import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFiche, NewFiche } from '../fiche.model';

export type PartialUpdateFiche = Partial<IFiche> & Pick<IFiche, 'id'>;

export type EntityResponseType = HttpResponse<IFiche>;
export type EntityArrayResponseType = HttpResponse<IFiche[]>;

@Injectable({ providedIn: 'root' })
export class FicheService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fiches');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fiche: NewFiche): Observable<EntityResponseType> {
    return this.http.post<IFiche>(this.resourceUrl, fiche, { observe: 'response' });
  }

  update(fiche: IFiche): Observable<EntityResponseType> {
    return this.http.put<IFiche>(`${this.resourceUrl}/${this.getFicheIdentifier(fiche)}`, fiche, { observe: 'response' });
  }

  partialUpdate(fiche: PartialUpdateFiche): Observable<EntityResponseType> {
    return this.http.patch<IFiche>(`${this.resourceUrl}/${this.getFicheIdentifier(fiche)}`, fiche, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFiche>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFiche[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFicheIdentifier(fiche: Pick<IFiche, 'id'>): number {
    return fiche.id;
  }

  compareFiche(o1: Pick<IFiche, 'id'> | null, o2: Pick<IFiche, 'id'> | null): boolean {
    return o1 && o2 ? this.getFicheIdentifier(o1) === this.getFicheIdentifier(o2) : o1 === o2;
  }

  addFicheToCollectionIfMissing<Type extends Pick<IFiche, 'id'>>(
    ficheCollection: Type[],
    ...fichesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fiches: Type[] = fichesToCheck.filter(isPresent);
    if (fiches.length > 0) {
      const ficheCollectionIdentifiers = ficheCollection.map(ficheItem => this.getFicheIdentifier(ficheItem)!);
      const fichesToAdd = fiches.filter(ficheItem => {
        const ficheIdentifier = this.getFicheIdentifier(ficheItem);
        if (ficheCollectionIdentifiers.includes(ficheIdentifier)) {
          return false;
        }
        ficheCollectionIdentifiers.push(ficheIdentifier);
        return true;
      });
      return [...fichesToAdd, ...ficheCollection];
    }
    return ficheCollection;
  }
}
