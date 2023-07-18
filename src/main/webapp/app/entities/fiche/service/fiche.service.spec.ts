import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFiche } from '../fiche.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fiche.test-samples';

import { FicheService } from './fiche.service';

const requireRestSample: IFiche = {
  ...sampleWithRequiredData,
};

describe('Fiche Service', () => {
  let service: FicheService;
  let httpMock: HttpTestingController;
  let expectedResult: IFiche | IFiche[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FicheService);
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

    it('should create a Fiche', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fiche = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(fiche).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fiche', () => {
      const fiche = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(fiche).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Fiche', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fiche', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Fiche', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFicheToCollectionIfMissing', () => {
      it('should add a Fiche to an empty array', () => {
        const fiche: IFiche = sampleWithRequiredData;
        expectedResult = service.addFicheToCollectionIfMissing([], fiche);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fiche);
      });

      it('should not add a Fiche to an array that contains it', () => {
        const fiche: IFiche = sampleWithRequiredData;
        const ficheCollection: IFiche[] = [
          {
            ...fiche,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFicheToCollectionIfMissing(ficheCollection, fiche);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fiche to an array that doesn't contain it", () => {
        const fiche: IFiche = sampleWithRequiredData;
        const ficheCollection: IFiche[] = [sampleWithPartialData];
        expectedResult = service.addFicheToCollectionIfMissing(ficheCollection, fiche);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fiche);
      });

      it('should add only unique Fiche to an array', () => {
        const ficheArray: IFiche[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ficheCollection: IFiche[] = [sampleWithRequiredData];
        expectedResult = service.addFicheToCollectionIfMissing(ficheCollection, ...ficheArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fiche: IFiche = sampleWithRequiredData;
        const fiche2: IFiche = sampleWithPartialData;
        expectedResult = service.addFicheToCollectionIfMissing([], fiche, fiche2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fiche);
        expect(expectedResult).toContain(fiche2);
      });

      it('should accept null and undefined values', () => {
        const fiche: IFiche = sampleWithRequiredData;
        expectedResult = service.addFicheToCollectionIfMissing([], null, fiche, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fiche);
      });

      it('should return initial array if no Fiche is added', () => {
        const ficheCollection: IFiche[] = [sampleWithRequiredData];
        expectedResult = service.addFicheToCollectionIfMissing(ficheCollection, undefined, null);
        expect(expectedResult).toEqual(ficheCollection);
      });
    });

    describe('compareFiche', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFiche(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFiche(entity1, entity2);
        const compareResult2 = service.compareFiche(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFiche(entity1, entity2);
        const compareResult2 = service.compareFiche(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFiche(entity1, entity2);
        const compareResult2 = service.compareFiche(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
