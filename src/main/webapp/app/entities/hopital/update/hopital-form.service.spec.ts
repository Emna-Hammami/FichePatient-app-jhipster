import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../hopital.test-samples';

import { HopitalFormService } from './hopital-form.service';

describe('Hopital Form Service', () => {
  let service: HopitalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HopitalFormService);
  });

  describe('Service methods', () => {
    describe('createHopitalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHopitalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomHop: expect.any(Object),
          })
        );
      });

      it('passing IHopital should create a new form with FormGroup', () => {
        const formGroup = service.createHopitalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomHop: expect.any(Object),
          })
        );
      });
    });

    describe('getHopital', () => {
      it('should return NewHopital for default Hopital initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHopitalFormGroup(sampleWithNewData);

        const hopital = service.getHopital(formGroup) as any;

        expect(hopital).toMatchObject(sampleWithNewData);
      });

      it('should return NewHopital for empty Hopital initial value', () => {
        const formGroup = service.createHopitalFormGroup();

        const hopital = service.getHopital(formGroup) as any;

        expect(hopital).toMatchObject({});
      });

      it('should return IHopital', () => {
        const formGroup = service.createHopitalFormGroup(sampleWithRequiredData);

        const hopital = service.getHopital(formGroup) as any;

        expect(hopital).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHopital should not enable id FormControl', () => {
        const formGroup = service.createHopitalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHopital should disable id FormControl', () => {
        const formGroup = service.createHopitalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
