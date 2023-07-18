import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FicheFormService } from './fiche-form.service';
import { FicheService } from '../service/fiche.service';
import { IFiche } from '../fiche.model';
import { IHopital } from 'app/entities/hopital/hopital.model';
import { HopitalService } from 'app/entities/hopital/service/hopital.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { MedecinService } from 'app/entities/medecin/service/medecin.service';

import { FicheUpdateComponent } from './fiche-update.component';

describe('Fiche Management Update Component', () => {
  let comp: FicheUpdateComponent;
  let fixture: ComponentFixture<FicheUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ficheFormService: FicheFormService;
  let ficheService: FicheService;
  let hopitalService: HopitalService;
  let serviceService: ServiceService;
  let medecinService: MedecinService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FicheUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FicheUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FicheUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ficheFormService = TestBed.inject(FicheFormService);
    ficheService = TestBed.inject(FicheService);
    hopitalService = TestBed.inject(HopitalService);
    serviceService = TestBed.inject(ServiceService);
    medecinService = TestBed.inject(MedecinService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Hopital query and add missing value', () => {
      const fiche: IFiche = { id: 456 };
      const ficheHop: IHopital = { id: 14932 };
      fiche.ficheHop = ficheHop;
      const hopital: IHopital = { id: 17039 };
      fiche.hopital = hopital;

      const hopitalCollection: IHopital[] = [{ id: 3455 }];
      jest.spyOn(hopitalService, 'query').mockReturnValue(of(new HttpResponse({ body: hopitalCollection })));
      const additionalHopitals = [ficheHop, hopital];
      const expectedCollection: IHopital[] = [...additionalHopitals, ...hopitalCollection];
      jest.spyOn(hopitalService, 'addHopitalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fiche });
      comp.ngOnInit();

      expect(hopitalService.query).toHaveBeenCalled();
      expect(hopitalService.addHopitalToCollectionIfMissing).toHaveBeenCalledWith(
        hopitalCollection,
        ...additionalHopitals.map(expect.objectContaining)
      );
      expect(comp.hopitalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Service query and add missing value', () => {
      const fiche: IFiche = { id: 456 };
      const service: IService = { id: 32464 };
      fiche.service = service;

      const serviceCollection: IService[] = [{ id: 13659 }];
      jest.spyOn(serviceService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCollection })));
      const additionalServices = [service];
      const expectedCollection: IService[] = [...additionalServices, ...serviceCollection];
      jest.spyOn(serviceService, 'addServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fiche });
      comp.ngOnInit();

      expect(serviceService.query).toHaveBeenCalled();
      expect(serviceService.addServiceToCollectionIfMissing).toHaveBeenCalledWith(
        serviceCollection,
        ...additionalServices.map(expect.objectContaining)
      );
      expect(comp.servicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Medecin query and add missing value', () => {
      const fiche: IFiche = { id: 456 };
      const medecin: IMedecin = { id: 7878 };
      fiche.medecin = medecin;

      const medecinCollection: IMedecin[] = [{ id: 13811 }];
      jest.spyOn(medecinService, 'query').mockReturnValue(of(new HttpResponse({ body: medecinCollection })));
      const additionalMedecins = [medecin];
      const expectedCollection: IMedecin[] = [...additionalMedecins, ...medecinCollection];
      jest.spyOn(medecinService, 'addMedecinToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fiche });
      comp.ngOnInit();

      expect(medecinService.query).toHaveBeenCalled();
      expect(medecinService.addMedecinToCollectionIfMissing).toHaveBeenCalledWith(
        medecinCollection,
        ...additionalMedecins.map(expect.objectContaining)
      );
      expect(comp.medecinsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fiche: IFiche = { id: 456 };
      const ficheHop: IHopital = { id: 11639 };
      fiche.ficheHop = ficheHop;
      const hopital: IHopital = { id: 24510 };
      fiche.hopital = hopital;
      const service: IService = { id: 31893 };
      fiche.service = service;
      const medecin: IMedecin = { id: 24799 };
      fiche.medecin = medecin;

      activatedRoute.data = of({ fiche });
      comp.ngOnInit();

      expect(comp.hopitalsSharedCollection).toContain(ficheHop);
      expect(comp.hopitalsSharedCollection).toContain(hopital);
      expect(comp.servicesSharedCollection).toContain(service);
      expect(comp.medecinsSharedCollection).toContain(medecin);
      expect(comp.fiche).toEqual(fiche);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiche>>();
      const fiche = { id: 123 };
      jest.spyOn(ficheFormService, 'getFiche').mockReturnValue(fiche);
      jest.spyOn(ficheService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fiche });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fiche }));
      saveSubject.complete();

      // THEN
      expect(ficheFormService.getFiche).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ficheService.update).toHaveBeenCalledWith(expect.objectContaining(fiche));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiche>>();
      const fiche = { id: 123 };
      jest.spyOn(ficheFormService, 'getFiche').mockReturnValue({ id: null });
      jest.spyOn(ficheService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fiche: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fiche }));
      saveSubject.complete();

      // THEN
      expect(ficheFormService.getFiche).toHaveBeenCalled();
      expect(ficheService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiche>>();
      const fiche = { id: 123 };
      jest.spyOn(ficheService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fiche });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ficheService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareHopital', () => {
      it('Should forward to hopitalService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(hopitalService, 'compareHopital');
        comp.compareHopital(entity, entity2);
        expect(hopitalService.compareHopital).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareService', () => {
      it('Should forward to serviceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(serviceService, 'compareService');
        comp.compareService(entity, entity2);
        expect(serviceService.compareService).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMedecin', () => {
      it('Should forward to medecinService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(medecinService, 'compareMedecin');
        comp.compareMedecin(entity, entity2);
        expect(medecinService.compareMedecin).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
