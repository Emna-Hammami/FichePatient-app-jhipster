import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FichePComponent } from './list/fiche-p.component';
import { FichePDetailComponent } from './detail/fiche-p-detail.component';
import { FichePUpdateComponent } from './update/fiche-p-update.component';
import FichePResolve from './route/fiche-p-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const fichePRoute: Routes = [
  {
    path: '',
    component: FichePComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FichePDetailComponent,
    resolve: {
      ficheP: FichePResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FichePUpdateComponent,
    resolve: {
      ficheP: FichePResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FichePUpdateComponent,
    resolve: {
      ficheP: FichePResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default fichePRoute;
