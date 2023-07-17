import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MedecinFormService, MedecinFormGroup } from './medecin-form.service';
import { IMedecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';

@Component({
  standalone: true,
  selector: 'jhi-medecin-update',
  templateUrl: './medecin-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MedecinUpdateComponent implements OnInit {
  isSaving = false;
  medecin: IMedecin | null = null;

  editForm: MedecinFormGroup = this.medecinFormService.createMedecinFormGroup();

  constructor(
    protected medecinService: MedecinService,
    protected medecinFormService: MedecinFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecin }) => {
      this.medecin = medecin;
      if (medecin) {
        this.updateForm(medecin);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medecin = this.medecinFormService.getMedecin(this.editForm);
    if (medecin.id !== null) {
      this.subscribeToSaveResponse(this.medecinService.update(medecin));
    } else {
      this.subscribeToSaveResponse(this.medecinService.create(medecin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedecin>>): void {
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

  protected updateForm(medecin: IMedecin): void {
    this.medecin = medecin;
    this.medecinFormService.resetForm(this.editForm, medecin);
  }
}
