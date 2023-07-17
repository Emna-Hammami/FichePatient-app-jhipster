import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStatistique } from '../statistique.model';
import { StatistiqueService } from '../service/statistique.service';

export const statistiqueResolve = (route: ActivatedRouteSnapshot): Observable<null | IStatistique> => {
  const id = route.params['id'];
  if (id) {
    return inject(StatistiqueService)
      .find(id)
      .pipe(
        mergeMap((statistique: HttpResponse<IStatistique>) => {
          if (statistique.body) {
            return of(statistique.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default statistiqueResolve;
