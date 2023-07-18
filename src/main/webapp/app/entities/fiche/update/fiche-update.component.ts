import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FicheFormService, FicheFormGroup } from './fiche-form.service';
import { IFiche } from '../fiche.model';
import { FicheService } from '../service/fiche.service';
import { IHopital } from 'app/entities/hopital/hopital.model';
import { HopitalService } from 'app/entities/hopital/service/hopital.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { MedecinService } from 'app/entities/medecin/service/medecin.service';

@Component({
  standalone: true,
  selector: 'jhi-fiche-update',
  templateUrl: './fiche-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FicheUpdateComponent implements OnInit {
  isSaving = false;
  fiche: IFiche | null = null;

  hopitalsSharedCollection: IHopital[] = [];
  servicesSharedCollection: IService[] = [];
  medecinsSharedCollection: IMedecin[] = [];

  editForm: FicheFormGroup = this.ficheFormService.createFicheFormGroup();

  constructor(
    protected ficheService: FicheService,
    protected ficheFormService: FicheFormService,
    protected hopitalService: HopitalService,
    protected serviceService: ServiceService,
    protected medecinService: MedecinService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareHopital = (o1: IHopital | null, o2: IHopital | null): boolean => this.hopitalService.compareHopital(o1, o2);

  compareService = (o1: IService | null, o2: IService | null): boolean => this.serviceService.compareService(o1, o2);

  compareMedecin = (o1: IMedecin | null, o2: IMedecin | null): boolean => this.medecinService.compareMedecin(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fiche }) => {
      this.fiche = fiche;
      if (fiche) {
        this.updateForm(fiche);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fiche = this.ficheFormService.getFiche(this.editForm);
    if (fiche.id !== null) {
      this.subscribeToSaveResponse(this.ficheService.update(fiche));
    } else {
      this.subscribeToSaveResponse(this.ficheService.create(fiche));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFiche>>): void {
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

  protected updateForm(fiche: IFiche): void {
    this.fiche = fiche;
    this.ficheFormService.resetForm(this.editForm, fiche);

    this.hopitalsSharedCollection = this.hopitalService.addHopitalToCollectionIfMissing<IHopital>(
      this.hopitalsSharedCollection,
      fiche.ficheHop,
      fiche.hopital
    );
    this.servicesSharedCollection = this.serviceService.addServiceToCollectionIfMissing<IService>(
      this.servicesSharedCollection,
      fiche.service
    );
    this.medecinsSharedCollection = this.medecinService.addMedecinToCollectionIfMissing<IMedecin>(
      this.medecinsSharedCollection,
      fiche.medecin
    );
  }

  protected loadRelationshipsOptions(): void {
    this.hopitalService
      .query()
      .pipe(map((res: HttpResponse<IHopital[]>) => res.body ?? []))
      .pipe(
        map((hopitals: IHopital[]) =>
          this.hopitalService.addHopitalToCollectionIfMissing<IHopital>(hopitals, this.fiche?.ficheHop, this.fiche?.hopital)
        )
      )
      .subscribe((hopitals: IHopital[]) => (this.hopitalsSharedCollection = hopitals));

    this.serviceService
      .query()
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(map((services: IService[]) => this.serviceService.addServiceToCollectionIfMissing<IService>(services, this.fiche?.service)))
      .subscribe((services: IService[]) => (this.servicesSharedCollection = services));

    this.medecinService
      .query()
      .pipe(map((res: HttpResponse<IMedecin[]>) => res.body ?? []))
      .pipe(map((medecins: IMedecin[]) => this.medecinService.addMedecinToCollectionIfMissing<IMedecin>(medecins, this.fiche?.medecin)))
      .subscribe((medecins: IMedecin[]) => (this.medecinsSharedCollection = medecins));
  }
}
