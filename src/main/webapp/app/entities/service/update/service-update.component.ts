import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceFormService, ServiceFormGroup } from './service-form.service';
import { IService } from '../service.model';
import { ServiceService } from '../service/service.service';
import { IHopital } from 'app/entities/hopital/hopital.model';
import { HopitalService } from 'app/entities/hopital/service/hopital.service';

@Component({
  standalone: true,
  selector: 'jhi-service-update',
  templateUrl: './service-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ServiceUpdateComponent implements OnInit {
  isSaving = false;
  service: IService | null = null;

  hopitalsSharedCollection: IHopital[] = [];

  editForm: ServiceFormGroup = this.serviceFormService.createServiceFormGroup();

  constructor(
    protected serviceService: ServiceService,
    protected serviceFormService: ServiceFormService,
    protected hopitalService: HopitalService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareHopital = (o1: IHopital | null, o2: IHopital | null): boolean => this.hopitalService.compareHopital(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ service }) => {
      this.service = service;
      if (service) {
        this.updateForm(service);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const service = this.serviceFormService.getService(this.editForm);
    if (service.id !== null) {
      this.subscribeToSaveResponse(this.serviceService.update(service));
    } else {
      this.subscribeToSaveResponse(this.serviceService.create(service));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IService>>): void {
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

  protected updateForm(service: IService): void {
    this.service = service;
    this.serviceFormService.resetForm(this.editForm, service);

    this.hopitalsSharedCollection = this.hopitalService.addHopitalToCollectionIfMissing<IHopital>(
      this.hopitalsSharedCollection,
      service.hopital
    );
  }

  protected loadRelationshipsOptions(): void {
    this.hopitalService
      .query()
      .pipe(map((res: HttpResponse<IHopital[]>) => res.body ?? []))
      .pipe(map((hopitals: IHopital[]) => this.hopitalService.addHopitalToCollectionIfMissing<IHopital>(hopitals, this.service?.hopital)))
      .subscribe((hopitals: IHopital[]) => (this.hopitalsSharedCollection = hopitals));
  }
}
