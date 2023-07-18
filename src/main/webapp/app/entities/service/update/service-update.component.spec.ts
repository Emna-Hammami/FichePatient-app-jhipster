import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ServiceFormService } from './service-form.service';
import { ServiceService } from '../service/service.service';
import { IService } from '../service.model';
import { IHopital } from 'app/entities/hopital/hopital.model';
import { HopitalService } from 'app/entities/hopital/service/hopital.service';

import { ServiceUpdateComponent } from './service-update.component';

describe('Service Management Update Component', () => {
  let comp: ServiceUpdateComponent;
  let fixture: ComponentFixture<ServiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serviceFormService: ServiceFormService;
  let serviceService: ServiceService;
  let hopitalService: HopitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ServiceUpdateComponent],
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
      .overrideTemplate(ServiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serviceFormService = TestBed.inject(ServiceFormService);
    serviceService = TestBed.inject(ServiceService);
    hopitalService = TestBed.inject(HopitalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Hopital query and add missing value', () => {
      const service: IService = { id: 456 };
      const hopital: IHopital = { id: 11867 };
      service.hopital = hopital;

      const hopitalCollection: IHopital[] = [{ id: 29276 }];
      jest.spyOn(hopitalService, 'query').mockReturnValue(of(new HttpResponse({ body: hopitalCollection })));
      const additionalHopitals = [hopital];
      const expectedCollection: IHopital[] = [...additionalHopitals, ...hopitalCollection];
      jest.spyOn(hopitalService, 'addHopitalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ service });
      comp.ngOnInit();

      expect(hopitalService.query).toHaveBeenCalled();
      expect(hopitalService.addHopitalToCollectionIfMissing).toHaveBeenCalledWith(
        hopitalCollection,
        ...additionalHopitals.map(expect.objectContaining)
      );
      expect(comp.hopitalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const service: IService = { id: 456 };
      const hopital: IHopital = { id: 2051 };
      service.hopital = hopital;

      activatedRoute.data = of({ service });
      comp.ngOnInit();

      expect(comp.hopitalsSharedCollection).toContain(hopital);
      expect(comp.service).toEqual(service);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IService>>();
      const service = { id: 123 };
      jest.spyOn(serviceFormService, 'getService').mockReturnValue(service);
      jest.spyOn(serviceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ service });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: service }));
      saveSubject.complete();

      // THEN
      expect(serviceFormService.getService).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(serviceService.update).toHaveBeenCalledWith(expect.objectContaining(service));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IService>>();
      const service = { id: 123 };
      jest.spyOn(serviceFormService, 'getService').mockReturnValue({ id: null });
      jest.spyOn(serviceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ service: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: service }));
      saveSubject.complete();

      // THEN
      expect(serviceFormService.getService).toHaveBeenCalled();
      expect(serviceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IService>>();
      const service = { id: 123 };
      jest.spyOn(serviceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ service });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serviceService.update).toHaveBeenCalled();
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
  });
});
