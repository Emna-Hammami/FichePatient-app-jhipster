import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fiche-p.test-samples';

import { FichePFormService } from './fiche-p-form.service';

describe('FicheP Form Service', () => {
  let service: FichePFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichePFormService);
  });

  describe('Service methods', () => {
    describe('createFichePFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFichePFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numDossier: expect.any(Object),
            nomPatient: expect.any(Object),
          })
        );
      });

      it('passing IFicheP should create a new form with FormGroup', () => {
        const formGroup = service.createFichePFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numDossier: expect.any(Object),
            nomPatient: expect.any(Object),
          })
        );
      });
    });

    describe('getFicheP', () => {
      it('should return NewFicheP for default FicheP initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFichePFormGroup(sampleWithNewData);

        const ficheP = service.getFicheP(formGroup) as any;

        expect(ficheP).toMatchObject(sampleWithNewData);
      });

      it('should return NewFicheP for empty FicheP initial value', () => {
        const formGroup = service.createFichePFormGroup();

        const ficheP = service.getFicheP(formGroup) as any;

        expect(ficheP).toMatchObject({});
      });

      it('should return IFicheP', () => {
        const formGroup = service.createFichePFormGroup(sampleWithRequiredData);

        const ficheP = service.getFicheP(formGroup) as any;

        expect(ficheP).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFicheP should not enable id FormControl', () => {
        const formGroup = service.createFichePFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFicheP should disable id FormControl', () => {
        const formGroup = service.createFichePFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
