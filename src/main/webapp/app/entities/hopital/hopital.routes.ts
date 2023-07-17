import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HopitalComponent } from './list/hopital.component';
import { HopitalDetailComponent } from './detail/hopital-detail.component';
import { HopitalUpdateComponent } from './update/hopital-update.component';
import HopitalResolve from './route/hopital-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const hopitalRoute: Routes = [
  {
    path: '',
    component: HopitalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HopitalDetailComponent,
    resolve: {
      hopital: HopitalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HopitalUpdateComponent,
    resolve: {
      hopital: HopitalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HopitalUpdateComponent,
    resolve: {
      hopital: HopitalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default hopitalRoute;
