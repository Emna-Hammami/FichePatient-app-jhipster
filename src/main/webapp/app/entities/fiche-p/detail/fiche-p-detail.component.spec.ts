import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FichePDetailComponent } from './fiche-p-detail.component';

describe('FicheP Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichePDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: FichePDetailComponent,
              resolve: { ficheP: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(FichePDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load ficheP on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FichePDetailComponent);

      // THEN
      expect(instance.ficheP).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
