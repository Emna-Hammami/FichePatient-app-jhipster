import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFicheP } from '../fiche-p.model';
import { FichePService } from '../service/fiche-p.service';

export const fichePResolve = (route: ActivatedRouteSnapshot): Observable<null | IFicheP> => {
  const id = route.params['id'];
  if (id) {
    return inject(FichePService)
      .find(id)
      .pipe(
        mergeMap((ficheP: HttpResponse<IFicheP>) => {
          if (ficheP.body) {
            return of(ficheP.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default fichePResolve;
