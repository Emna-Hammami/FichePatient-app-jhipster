import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFicheP, NewFicheP } from '../fiche-p.model';

export type PartialUpdateFicheP = Partial<IFicheP> & Pick<IFicheP, 'id'>;

export type EntityResponseType = HttpResponse<IFicheP>;
export type EntityArrayResponseType = HttpResponse<IFicheP[]>;

@Injectable({ providedIn: 'root' })
export class FichePService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fiche-ps');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ficheP: NewFicheP): Observable<EntityResponseType> {
    return this.http.post<IFicheP>(this.resourceUrl, ficheP, { observe: 'response' });
  }

  update(ficheP: IFicheP): Observable<EntityResponseType> {
    return this.http.put<IFicheP>(`${this.resourceUrl}/${this.getFichePIdentifier(ficheP)}`, ficheP, { observe: 'response' });
  }

  partialUpdate(ficheP: PartialUpdateFicheP): Observable<EntityResponseType> {
    return this.http.patch<IFicheP>(`${this.resourceUrl}/${this.getFichePIdentifier(ficheP)}`, ficheP, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFicheP>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFicheP[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFichePIdentifier(ficheP: Pick<IFicheP, 'id'>): number {
    return ficheP.id;
  }

  compareFicheP(o1: Pick<IFicheP, 'id'> | null, o2: Pick<IFicheP, 'id'> | null): boolean {
    return o1 && o2 ? this.getFichePIdentifier(o1) === this.getFichePIdentifier(o2) : o1 === o2;
  }

  addFichePToCollectionIfMissing<Type extends Pick<IFicheP, 'id'>>(
    fichePCollection: Type[],
    ...fichePSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fichePS: Type[] = fichePSToCheck.filter(isPresent);
    if (fichePS.length > 0) {
      const fichePCollectionIdentifiers = fichePCollection.map(fichePItem => this.getFichePIdentifier(fichePItem)!);
      const fichePSToAdd = fichePS.filter(fichePItem => {
        const fichePIdentifier = this.getFichePIdentifier(fichePItem);
        if (fichePCollectionIdentifiers.includes(fichePIdentifier)) {
          return false;
        }
        fichePCollectionIdentifiers.push(fichePIdentifier);
        return true;
      });
      return [...fichePSToAdd, ...fichePCollection];
    }
    return fichePCollection;
  }
}
