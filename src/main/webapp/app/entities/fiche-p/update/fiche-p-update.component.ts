import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FichePFormService, FichePFormGroup } from './fiche-p-form.service';
import { IFicheP } from '../fiche-p.model';
import { FichePService } from '../service/fiche-p.service';

@Component({
  standalone: true,
  selector: 'jhi-fiche-p-update',
  templateUrl: './fiche-p-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FichePUpdateComponent implements OnInit {
  isSaving = false;
  ficheP: IFicheP | null = null;

  editForm: FichePFormGroup = this.fichePFormService.createFichePFormGroup();

  constructor(
    protected fichePService: FichePService,
    protected fichePFormService: FichePFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ficheP }) => {
      this.ficheP = ficheP;
      if (ficheP) {
        this.updateForm(ficheP);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ficheP = this.fichePFormService.getFicheP(this.editForm);
    if (ficheP.id !== null) {
      this.subscribeToSaveResponse(this.fichePService.update(ficheP));
    } else {
      this.subscribeToSaveResponse(this.fichePService.create(ficheP));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFicheP>>): void {
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

  protected updateForm(ficheP: IFicheP): void {
    this.ficheP = ficheP;
    this.fichePFormService.resetForm(this.editForm, ficheP);
  }
}
