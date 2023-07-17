import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMedecin, NewMedecin } from '../medecin.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMedecin for edit and NewMedecinFormGroupInput for create.
 */
type MedecinFormGroupInput = IMedecin | PartialWithRequiredKeyOf<NewMedecin>;

type MedecinFormDefaults = Pick<NewMedecin, 'id'>;

type MedecinFormGroupContent = {
  id: FormControl<IMedecin['id'] | NewMedecin['id']>;
  nomMed: FormControl<IMedecin['nomMed']>;
  adresse: FormControl<IMedecin['adresse']>;
  tel: FormControl<IMedecin['tel']>;
  fax: FormControl<IMedecin['fax']>;
  email: FormControl<IMedecin['email']>;
  url: FormControl<IMedecin['url']>;
};

export type MedecinFormGroup = FormGroup<MedecinFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MedecinFormService {
  createMedecinFormGroup(medecin: MedecinFormGroupInput = { id: null }): MedecinFormGroup {
    const medecinRawValue = {
      ...this.getFormDefaults(),
      ...medecin,
    };
    return new FormGroup<MedecinFormGroupContent>({
      id: new FormControl(
        { value: medecinRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nomMed: new FormControl(medecinRawValue.nomMed, {
        validators: [Validators.required],
      }),
      adresse: new FormControl(medecinRawValue.adresse, {
        validators: [Validators.required],
      }),
      tel: new FormControl(medecinRawValue.tel, {
        validators: [Validators.required],
      }),
      fax: new FormControl(medecinRawValue.fax),
      email: new FormControl(medecinRawValue.email, {
        validators: [Validators.required],
      }),
      url: new FormControl(medecinRawValue.url, {
        validators: [Validators.required],
      }),
    });
  }

  getMedecin(form: MedecinFormGroup): IMedecin | NewMedecin {
    return form.getRawValue() as IMedecin | NewMedecin;
  }

  resetForm(form: MedecinFormGroup, medecin: MedecinFormGroupInput): void {
    const medecinRawValue = { ...this.getFormDefaults(), ...medecin };
    form.reset(
      {
        ...medecinRawValue,
        id: { value: medecinRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MedecinFormDefaults {
    return {
      id: null,
    };
  }
}
