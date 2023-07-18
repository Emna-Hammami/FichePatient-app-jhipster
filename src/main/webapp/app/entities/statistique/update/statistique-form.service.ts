import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IStatistique, NewStatistique } from '../statistique.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStatistique for edit and NewStatistiqueFormGroupInput for create.
 */
type StatistiqueFormGroupInput = IStatistique | PartialWithRequiredKeyOf<NewStatistique>;

type StatistiqueFormDefaults = Pick<NewStatistique, 'id'>;

type StatistiqueFormGroupContent = {
  id: FormControl<IStatistique['id'] | NewStatistique['id']>;
};

export type StatistiqueFormGroup = FormGroup<StatistiqueFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StatistiqueFormService {
  createStatistiqueFormGroup(statistique: StatistiqueFormGroupInput = { id: null }): StatistiqueFormGroup {
    const statistiqueRawValue = {
      ...this.getFormDefaults(),
      ...statistique,
    };
    return new FormGroup<StatistiqueFormGroupContent>({
      id: new FormControl(
        { value: statistiqueRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });
  }

  getStatistique(form: StatistiqueFormGroup): IStatistique | NewStatistique {
    if (form.controls.id.disabled) {
      // form.value returns id with null value for FormGroup with only one FormControl
      // return {};
    }
    return form.getRawValue() as IStatistique | NewStatistique;
  }

  resetForm(form: StatistiqueFormGroup, statistique: StatistiqueFormGroupInput): void {
    const statistiqueRawValue = { ...this.getFormDefaults(), ...statistique };
    form.reset(
      {
        ...statistiqueRawValue,
        id: { value: statistiqueRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StatistiqueFormDefaults {
    return {
      id: null,
    };
  }
}
