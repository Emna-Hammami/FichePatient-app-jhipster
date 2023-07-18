import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FicheDetailComponent } from './fiche-detail.component';

describe('Fiche Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: FicheDetailComponent,
              resolve: { fiche: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(FicheDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load fiche on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FicheDetailComponent);

      // THEN
      expect(instance.fiche).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
