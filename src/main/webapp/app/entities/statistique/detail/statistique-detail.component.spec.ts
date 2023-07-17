import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StatistiqueDetailComponent } from './statistique-detail.component';

describe('Statistique Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiqueDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: StatistiqueDetailComponent,
              resolve: { statistique: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(StatistiqueDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load statistique on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StatistiqueDetailComponent);

      // THEN
      expect(instance.statistique).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
