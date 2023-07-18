import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FicheComponent } from './list/fiche.component';
import { FicheDetailComponent } from './detail/fiche-detail.component';
import { FicheUpdateComponent } from './update/fiche-update.component';
import FicheResolve from './route/fiche-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const ficheRoute: Routes = [
  {
    path: '',
    component: FicheComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FicheDetailComponent,
    resolve: {
      fiche: FicheResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FicheUpdateComponent,
    resolve: {
      fiche: FicheResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FicheUpdateComponent,
    resolve: {
      fiche: FicheResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ficheRoute;
