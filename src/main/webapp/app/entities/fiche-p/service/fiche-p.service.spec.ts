import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFicheP } from '../fiche-p.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fiche-p.test-samples';

import { FichePService } from './fiche-p.service';

const requireRestSample: IFicheP = {
  ...sampleWithRequiredData,
};

describe('FicheP Service', () => {
  let service: FichePService;
  let httpMock: HttpTestingController;
  let expectedResult: IFicheP | IFicheP[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FichePService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a FicheP', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ficheP = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ficheP).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FicheP', () => {
      const ficheP = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ficheP).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FicheP', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FicheP', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FicheP', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFichePToCollectionIfMissing', () => {
      it('should add a FicheP to an empty array', () => {
        const ficheP: IFicheP = sampleWithRequiredData;
        expectedResult = service.addFichePToCollectionIfMissing([], ficheP);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ficheP);
      });

      it('should not add a FicheP to an array that contains it', () => {
        const ficheP: IFicheP = sampleWithRequiredData;
        const fichePCollection: IFicheP[] = [
          {
            ...ficheP,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFichePToCollectionIfMissing(fichePCollection, ficheP);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FicheP to an array that doesn't contain it", () => {
        const ficheP: IFicheP = sampleWithRequiredData;
        const fichePCollection: IFicheP[] = [sampleWithPartialData];
        expectedResult = service.addFichePToCollectionIfMissing(fichePCollection, ficheP);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ficheP);
      });

      it('should add only unique FicheP to an array', () => {
        const fichePArray: IFicheP[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const fichePCollection: IFicheP[] = [sampleWithRequiredData];
        expectedResult = service.addFichePToCollectionIfMissing(fichePCollection, ...fichePArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ficheP: IFicheP = sampleWithRequiredData;
        const ficheP2: IFicheP = sampleWithPartialData;
        expectedResult = service.addFichePToCollectionIfMissing([], ficheP, ficheP2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ficheP);
        expect(expectedResult).toContain(ficheP2);
      });

      it('should accept null and undefined values', () => {
        const ficheP: IFicheP = sampleWithRequiredData;
        expectedResult = service.addFichePToCollectionIfMissing([], null, ficheP, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ficheP);
      });

      it('should return initial array if no FicheP is added', () => {
        const fichePCollection: IFicheP[] = [sampleWithRequiredData];
        expectedResult = service.addFichePToCollectionIfMissing(fichePCollection, undefined, null);
        expect(expectedResult).toEqual(fichePCollection);
      });
    });

    describe('compareFicheP', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFicheP(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFicheP(entity1, entity2);
        const compareResult2 = service.compareFicheP(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFicheP(entity1, entity2);
        const compareResult2 = service.compareFicheP(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFicheP(entity1, entity2);
        const compareResult2 = service.compareFicheP(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
