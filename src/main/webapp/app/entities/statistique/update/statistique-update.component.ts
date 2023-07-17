import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StatistiqueFormService, StatistiqueFormGroup } from './statistique-form.service';
import { IStatistique } from '../statistique.model';
import { StatistiqueService } from '../service/statistique.service';

@Component({
  standalone: true,
  selector: 'jhi-statistique-update',
  templateUrl: './statistique-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StatistiqueUpdateComponent implements OnInit {
  isSaving = false;
  statistique: IStatistique | null = null;

  editForm: StatistiqueFormGroup = this.statistiqueFormService.createStatistiqueFormGroup();

  constructor(
    protected statistiqueService: StatistiqueService,
    protected statistiqueFormService: StatistiqueFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statistique }) => {
      this.statistique = statistique;
      if (statistique) {
        this.updateForm(statistique);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const statistique = this.statistiqueFormService.getStatistique(this.editForm);
    if (statistique.id !== null) {
      this.subscribeToSaveResponse(this.statistiqueService.update(statistique));
    } else {
      this.subscribeToSaveResponse(this.statistiqueService.create(statistique));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStatistique>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(statistique: IStatistique): void {
    this.statistique = statistique;
    this.statistiqueFormService.resetForm(this.editForm, statistique);
  }
}
