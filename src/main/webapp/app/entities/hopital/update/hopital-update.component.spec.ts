import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HopitalFormService } from './hopital-form.service';
import { HopitalService } from '../service/hopital.service';
import { IHopital } from '../hopital.model';

import { HopitalUpdateComponent } from './hopital-update.component';

describe('Hopital Management Update Component', () => {
  let comp: HopitalUpdateComponent;
  let fixture: ComponentFixture<HopitalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hopitalFormService: HopitalFormService;
  let hopitalService: HopitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), HopitalUpdateComponent],
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
      .overrideTemplate(HopitalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HopitalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hopitalFormService = TestBed.inject(HopitalFormService);
    hopitalService = TestBed.inject(HopitalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const hopital: IHopital = { id: 456 };

      activatedRoute.data = of({ hopital });
      comp.ngOnInit();

      expect(comp.hopital).toEqual(hopital);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHopital>>();
      const hopital = { id: 123 };
      jest.spyOn(hopitalFormService, 'getHopital').mockReturnValue(hopital);
      jest.spyOn(hopitalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hopital });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hopital }));
      saveSubject.complete();

      // THEN
      expect(hopitalFormService.getHopital).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(hopitalService.update).toHaveBeenCalledWith(expect.objectContaining(hopital));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHopital>>();
      const hopital = { id: 123 };
      jest.spyOn(hopitalFormService, 'getHopital').mockReturnValue({ id: null });
      jest.spyOn(hopitalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hopital: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hopital }));
      saveSubject.complete();

      // THEN
      expect(hopitalFormService.getHopital).toHaveBeenCalled();
      expect(hopitalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHopital>>();
      const hopital = { id: 123 };
      jest.spyOn(hopitalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hopital });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hopitalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
