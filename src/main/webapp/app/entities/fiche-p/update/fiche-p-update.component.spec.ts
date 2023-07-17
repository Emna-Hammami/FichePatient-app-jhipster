import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FichePFormService } from './fiche-p-form.service';
import { FichePService } from '../service/fiche-p.service';
import { IFicheP } from '../fiche-p.model';

import { FichePUpdateComponent } from './fiche-p-update.component';

describe('FicheP Management Update Component', () => {
  let comp: FichePUpdateComponent;
  let fixture: ComponentFixture<FichePUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fichePFormService: FichePFormService;
  let fichePService: FichePService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FichePUpdateComponent],
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
      .overrideTemplate(FichePUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FichePUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fichePFormService = TestBed.inject(FichePFormService);
    fichePService = TestBed.inject(FichePService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ficheP: IFicheP = { id: 456 };

      activatedRoute.data = of({ ficheP });
      comp.ngOnInit();

      expect(comp.ficheP).toEqual(ficheP);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFicheP>>();
      const ficheP = { id: 123 };
      jest.spyOn(fichePFormService, 'getFicheP').mockReturnValue(ficheP);
      jest.spyOn(fichePService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ficheP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ficheP }));
      saveSubject.complete();

      // THEN
      expect(fichePFormService.getFicheP).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fichePService.update).toHaveBeenCalledWith(expect.objectContaining(ficheP));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFicheP>>();
      const ficheP = { id: 123 };
      jest.spyOn(fichePFormService, 'getFicheP').mockReturnValue({ id: null });
      jest.spyOn(fichePService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ficheP: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ficheP }));
      saveSubject.complete();

      // THEN
      expect(fichePFormService.getFicheP).toHaveBeenCalled();
      expect(fichePService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFicheP>>();
      const ficheP = { id: 123 };
      jest.spyOn(fichePService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ficheP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fichePService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
