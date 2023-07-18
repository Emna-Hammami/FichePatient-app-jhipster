import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MedecinFormService } from './medecin-form.service';
import { MedecinService } from '../service/medecin.service';
import { IMedecin } from '../medecin.model';
import { IHopital } from 'app/entities/hopital/hopital.model';
import { HopitalService } from 'app/entities/hopital/service/hopital.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

import { MedecinUpdateComponent } from './medecin-update.component';

describe('Medecin Management Update Component', () => {
  let comp: MedecinUpdateComponent;
  let fixture: ComponentFixture<MedecinUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let medecinFormService: MedecinFormService;
  let medecinService: MedecinService;
  let hopitalService: HopitalService;
  let serviceService: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MedecinUpdateComponent],
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
      .overrideTemplate(MedecinUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedecinUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medecinFormService = TestBed.inject(MedecinFormService);
    medecinService = TestBed.inject(MedecinService);
    hopitalService = TestBed.inject(HopitalService);
    serviceService = TestBed.inject(ServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Hopital query and add missing value', () => {
      const medecin: IMedecin = { id: 456 };
      const hopital: IHopital = { id: 19697 };
      medecin.hopital = hopital;

      const hopitalCollection: IHopital[] = [{ id: 10459 }];
      jest.spyOn(hopitalService, 'query').mockReturnValue(of(new HttpResponse({ body: hopitalCollection })));
      const additionalHopitals = [hopital];
      const expectedCollection: IHopital[] = [...additionalHopitals, ...hopitalCollection];
      jest.spyOn(hopitalService, 'addHopitalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      expect(hopitalService.query).toHaveBeenCalled();
      expect(hopitalService.addHopitalToCollectionIfMissing).toHaveBeenCalledWith(
        hopitalCollection,
        ...additionalHopitals.map(expect.objectContaining)
      );
      expect(comp.hopitalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call service query and add missing value', () => {
      const medecin: IMedecin = { id: 456 };
      const service: IService = { id: 32575 };
      medecin.service = service;

      const serviceCollection: IService[] = [{ id: 4306 }];
      jest.spyOn(serviceService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCollection })));
      const expectedCollection: IService[] = [service, ...serviceCollection];
      jest.spyOn(serviceService, 'addServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      expect(serviceService.query).toHaveBeenCalled();
      expect(serviceService.addServiceToCollectionIfMissing).toHaveBeenCalledWith(serviceCollection, service);
      expect(comp.servicesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const medecin: IMedecin = { id: 456 };
      const hopital: IHopital = { id: 20063 };
      medecin.hopital = hopital;
      const service: IService = { id: 27627 };
      medecin.service = service;

      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      expect(comp.hopitalsSharedCollection).toContain(hopital);
      expect(comp.servicesCollection).toContain(service);
      expect(comp.medecin).toEqual(medecin);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedecin>>();
      const medecin = { id: 123 };
      jest.spyOn(medecinFormService, 'getMedecin').mockReturnValue(medecin);
      jest.spyOn(medecinService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medecin }));
      saveSubject.complete();

      // THEN
      expect(medecinFormService.getMedecin).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(medecinService.update).toHaveBeenCalledWith(expect.objectContaining(medecin));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedecin>>();
      const medecin = { id: 123 };
      jest.spyOn(medecinFormService, 'getMedecin').mockReturnValue({ id: null });
      jest.spyOn(medecinService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medecin: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medecin }));
      saveSubject.complete();

      // THEN
      expect(medecinFormService.getMedecin).toHaveBeenCalled();
      expect(medecinService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedecin>>();
      const medecin = { id: 123 };
      jest.spyOn(medecinService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medecinService.update).toHaveBeenCalled();
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
  });
});
