import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'medecin',
        data: { pageTitle: 'Medecins' },
        loadChildren: () => import('./medecin/medecin.routes'),
      },
      {
        path: 'hopital',
        data: { pageTitle: 'Hopitals' },
        loadChildren: () => import('./hopital/hopital.routes'),
      },
      {
        path: 'service',
        data: { pageTitle: 'Services' },
        loadChildren: () => import('./service/service.routes'),
      },
      {
        path: 'fiche-p',
        data: { pageTitle: 'FichePS' },
        loadChildren: () => import('./fiche-p/fiche-p.routes'),
      },
      {
        path: 'statistique',
        data: { pageTitle: 'Statistiques' },
        loadChildren: () => import('./statistique/statistique.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
