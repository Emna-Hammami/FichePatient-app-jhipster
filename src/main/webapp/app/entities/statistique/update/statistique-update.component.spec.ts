import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StatistiqueFormService } from './statistique-form.service';
import { StatistiqueService } from '../service/statistique.service';
import { IStatistique } from '../statistique.model';

import { StatistiqueUpdateComponent } from './statistique-update.component';

describe('Statistique Management Update Component', () => {
  let comp: StatistiqueUpdateComponent;
  let fixture: ComponentFixture<StatistiqueUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let statistiqueFormService: StatistiqueFormService;
  let statistiqueService: StatistiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), StatistiqueUpdateComponent],
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
      .overrideTemplate(StatistiqueUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StatistiqueUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    statistiqueFormService = TestBed.inject(StatistiqueFormService);
    statistiqueService = TestBed.inject(StatistiqueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const statistique: IStatistique = { id: 456 };

      activatedRoute.data = of({ statistique });
      comp.ngOnInit();

      expect(comp.statistique).toEqual(statistique);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStatistique>>();
      const statistique = { id: 123 };
      jest.spyOn(statistiqueFormService, 'getStatistique').mockReturnValue(statistique);
      jest.spyOn(statistiqueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statistique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: statistique }));
      saveSubject.complete();

      // THEN
      expect(statistiqueFormService.getStatistique).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(statistiqueService.update).toHaveBeenCalledWith(expect.objectContaining(statistique));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStatistique>>();
      const statistique = { id: 123 };
      jest.spyOn(statistiqueFormService, 'getStatistique').mockReturnValue({ id: null });
      jest.spyOn(statistiqueService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statistique: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: statistique }));
      saveSubject.complete();

      // THEN
      expect(statistiqueFormService.getStatistique).toHaveBeenCalled();
      expect(statistiqueService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStatistique>>();
      const statistique = { id: 123 };
      jest.spyOn(statistiqueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statistique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(statistiqueService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
