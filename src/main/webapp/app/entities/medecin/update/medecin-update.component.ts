import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MedecinFormService, MedecinFormGroup } from './medecin-form.service';
import { IMedecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';
import { IHopital } from 'app/entities/hopital/hopital.model';
import { HopitalService } from 'app/entities/hopital/service/hopital.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

@Component({
  standalone: true,
  selector: 'jhi-medecin-update',
  templateUrl: './medecin-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MedecinUpdateComponent implements OnInit {
  isSaving = false;
  medecin: IMedecin | null = null;

  hopitalsSharedCollection: IHopital[] = [];
  servicesCollection: IService[] = [];

  editForm: MedecinFormGroup = this.medecinFormService.createMedecinFormGroup();

  constructor(
    protected medecinService: MedecinService,
    protected medecinFormService: MedecinFormService,
    protected hopitalService: HopitalService,
    protected serviceService: ServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareHopital = (o1: IHopital | null, o2: IHopital | null): boolean => this.hopitalService.compareHopital(o1, o2);

  compareService = (o1: IService | null, o2: IService | null): boolean => this.serviceService.compareService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecin }) => {
      this.medecin = medecin;
      if (medecin) {
        this.updateForm(medecin);
      }

      this.loadRelationshipsOptions();
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

    this.hopitalsSharedCollection = this.hopitalService.addHopitalToCollectionIfMissing<IHopital>(
      this.hopitalsSharedCollection,
      medecin.hopital
    );
    this.servicesCollection = this.serviceService.addServiceToCollectionIfMissing<IService>(this.servicesCollection, medecin.service);
  }

  protected loadRelationshipsOptions(): void {
    this.hopitalService
      .query()
      .pipe(map((res: HttpResponse<IHopital[]>) => res.body ?? []))
      .pipe(map((hopitals: IHopital[]) => this.hopitalService.addHopitalToCollectionIfMissing<IHopital>(hopitals, this.medecin?.hopital)))
      .subscribe((hopitals: IHopital[]) => (this.hopitalsSharedCollection = hopitals));

    this.serviceService
      .query({ filter: 'chefservice-is-null' })
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(map((services: IService[]) => this.serviceService.addServiceToCollectionIfMissing<IService>(services, this.medecin?.service)))
      .subscribe((services: IService[]) => (this.servicesCollection = services));
  }
}
