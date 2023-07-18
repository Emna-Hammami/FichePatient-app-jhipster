import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFiche } from '../fiche.model';
import { FicheService } from '../service/fiche.service';

export const ficheResolve = (route: ActivatedRouteSnapshot): Observable<null | IFiche> => {
  const id = route.params['id'];
  if (id) {
    return inject(FicheService)
      .find(id)
      .pipe(
        mergeMap((fiche: HttpResponse<IFiche>) => {
          if (fiche.body) {
            return of(fiche.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default ficheResolve;
