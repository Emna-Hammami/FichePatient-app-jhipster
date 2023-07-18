import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fiche.test-samples';

import { FicheFormService } from './fiche-form.service';

describe('Fiche Form Service', () => {
  let service: FicheFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheFormService);
  });

  describe('Service methods', () => {
    describe('createFicheFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFicheFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ficheHop: expect.any(Object),
            hopital: expect.any(Object),
            service: expect.any(Object),
            medecin: expect.any(Object),
          })
        );
      });

      it('passing IFiche should create a new form with FormGroup', () => {
        const formGroup = service.createFicheFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ficheHop: expect.any(Object),
            hopital: expect.any(Object),
            service: expect.any(Object),
            medecin: expect.any(Object),
          })
        );
      });
    });

    describe('getFiche', () => {
      it('should return NewFiche for default Fiche initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFicheFormGroup(sampleWithNewData);

        const fiche = service.getFiche(formGroup) as any;

        expect(fiche).toMatchObject(sampleWithNewData);
      });

      it('should return NewFiche for empty Fiche initial value', () => {
        const formGroup = service.createFicheFormGroup();

        const fiche = service.getFiche(formGroup) as any;

        expect(fiche).toMatchObject({});
      });

      it('should return IFiche', () => {
        const formGroup = service.createFicheFormGroup(sampleWithRequiredData);

        const fiche = service.getFiche(formGroup) as any;

        expect(fiche).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFiche should not enable id FormControl', () => {
        const formGroup = service.createFicheFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFiche should disable id FormControl', () => {
        const formGroup = service.createFicheFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
