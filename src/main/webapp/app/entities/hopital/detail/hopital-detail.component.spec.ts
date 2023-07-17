import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HopitalDetailComponent } from './hopital-detail.component';

describe('Hopital Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HopitalDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: HopitalDetailComponent,
              resolve: { hopital: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(HopitalDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load hopital on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', HopitalDetailComponent);

      // THEN
      expect(instance.hopital).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
