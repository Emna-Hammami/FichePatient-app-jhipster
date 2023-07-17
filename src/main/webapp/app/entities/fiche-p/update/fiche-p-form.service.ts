import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFicheP, NewFicheP } from '../fiche-p.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFicheP for edit and NewFichePFormGroupInput for create.
 */
type FichePFormGroupInput = IFicheP | PartialWithRequiredKeyOf<NewFicheP>;

type FichePFormDefaults = Pick<NewFicheP, 'id'>;

type FichePFormGroupContent = {
  id: FormControl<IFicheP['id'] | NewFicheP['id']>;
  numDossier: FormControl<IFicheP['numDossier']>;
  nomPatient: FormControl<IFicheP['nomPatient']>;
};

export type FichePFormGroup = FormGroup<FichePFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FichePFormService {
  createFichePFormGroup(ficheP: FichePFormGroupInput = { id: null }): FichePFormGroup {
    const fichePRawValue = {
      ...this.getFormDefaults(),
      ...ficheP,
    };
    return new FormGroup<FichePFormGroupContent>({
      id: new FormControl(
        { value: fichePRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      numDossier: new FormControl(fichePRawValue.numDossier, {
        validators: [Validators.required],
      }),
      nomPatient: new FormControl(fichePRawValue.nomPatient, {
        validators: [Validators.required],
      }),
    });
  }

  getFicheP(form: FichePFormGroup): IFicheP | NewFicheP {
    return form.getRawValue() as IFicheP | NewFicheP;
  }

  resetForm(form: FichePFormGroup, ficheP: FichePFormGroupInput): void {
    const fichePRawValue = { ...this.getFormDefaults(), ...ficheP };
    form.reset(
      {
        ...fichePRawValue,
        id: { value: fichePRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FichePFormDefaults {
    return {
      id: null,
    };
  }
}
