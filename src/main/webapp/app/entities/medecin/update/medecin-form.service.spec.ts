import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../medecin.test-samples';

import { MedecinFormService } from './medecin-form.service';

describe('Medecin Form Service', () => {
  let service: MedecinFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedecinFormService);
  });

  describe('Service methods', () => {
    describe('createMedecinFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMedecinFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomMed: expect.any(Object),
            adresse: expect.any(Object),
            tel: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            url: expect.any(Object),
            hopital: expect.any(Object),
            service: expect.any(Object),
          })
        );
      });

      it('passing IMedecin should create a new form with FormGroup', () => {
        const formGroup = service.createMedecinFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomMed: expect.any(Object),
            adresse: expect.any(Object),
            tel: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            url: expect.any(Object),
            hopital: expect.any(Object),
            service: expect.any(Object),
          })
        );
      });
    });

    describe('getMedecin', () => {
      it('should return NewMedecin for default Medecin initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMedecinFormGroup(sampleWithNewData);

        const medecin = service.getMedecin(formGroup) as any;

        expect(medecin).toMatchObject(sampleWithNewData);
      });

      it('should return NewMedecin for empty Medecin initial value', () => {
        const formGroup = service.createMedecinFormGroup();

        const medecin = service.getMedecin(formGroup) as any;

        expect(medecin).toMatchObject({});
      });

      it('should return IMedecin', () => {
        const formGroup = service.createMedecinFormGroup(sampleWithRequiredData);

        const medecin = service.getMedecin(formGroup) as any;

        expect(medecin).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMedecin should not enable id FormControl', () => {
        const formGroup = service.createMedecinFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMedecin should disable id FormControl', () => {
        const formGroup = service.createMedecinFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
