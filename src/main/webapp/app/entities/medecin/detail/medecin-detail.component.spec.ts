import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MedecinDetailComponent } from './medecin-detail.component';

describe('Medecin Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MedecinDetailComponent,
              resolve: { medecin: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(MedecinDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load medecin on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MedecinDetailComponent);

      // THEN
      expect(instance.medecin).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
