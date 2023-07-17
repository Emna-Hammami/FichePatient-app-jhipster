import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../statistique.test-samples';

import { StatistiqueFormService } from './statistique-form.service';

describe('Statistique Form Service', () => {
  let service: StatistiqueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatistiqueFormService);
  });

  describe('Service methods', () => {
    describe('createStatistiqueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStatistiqueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
          })
        );
      });

      it('passing IStatistique should create a new form with FormGroup', () => {
        const formGroup = service.createStatistiqueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
          })
        );
      });
    });

    describe('getStatistique', () => {
      it('should return NewStatistique for default Statistique initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStatistiqueFormGroup(sampleWithNewData);

        const statistique = service.getStatistique(formGroup) as any;

        expect(statistique).toMatchObject(sampleWithNewData);
      });

      it('should return NewStatistique for empty Statistique initial value', () => {
        const formGroup = service.createStatistiqueFormGroup();

        const statistique = service.getStatistique(formGroup) as any;

        expect(statistique).toMatchObject({});
      });

      it('should return IStatistique', () => {
        const formGroup = service.createStatistiqueFormGroup(sampleWithRequiredData);

        const statistique = service.getStatistique(formGroup) as any;

        expect(statistique).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStatistique should not enable id FormControl', () => {
        const formGroup = service.createStatistiqueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStatistique should disable id FormControl', () => {
        const formGroup = service.createStatistiqueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
