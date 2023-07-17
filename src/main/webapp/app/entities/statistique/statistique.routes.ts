import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StatistiqueComponent } from './list/statistique.component';
import { StatistiqueDetailComponent } from './detail/statistique-detail.component';
import { StatistiqueUpdateComponent } from './update/statistique-update.component';
import StatistiqueResolve from './route/statistique-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const statistiqueRoute: Routes = [
  {
    path: '',
    component: StatistiqueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StatistiqueDetailComponent,
    resolve: {
      statistique: StatistiqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StatistiqueUpdateComponent,
    resolve: {
      statistique: StatistiqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StatistiqueUpdateComponent,
    resolve: {
      statistique: StatistiqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default statistiqueRoute;
