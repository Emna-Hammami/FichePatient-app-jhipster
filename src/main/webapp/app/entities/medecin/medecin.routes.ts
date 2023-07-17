import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedecinComponent } from './list/medecin.component';
import { MedecinDetailComponent } from './detail/medecin-detail.component';
import { MedecinUpdateComponent } from './update/medecin-update.component';
import MedecinResolve from './route/medecin-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const medecinRoute: Routes = [
  {
    path: '',
    component: MedecinComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedecinDetailComponent,
    resolve: {
      medecin: MedecinResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedecinUpdateComponent,
    resolve: {
      medecin: MedecinResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedecinUpdateComponent,
    resolve: {
      medecin: MedecinResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default medecinRoute;
