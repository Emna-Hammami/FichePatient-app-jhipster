import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStatistique } from '../statistique.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../statistique.test-samples';

import { StatistiqueService } from './statistique.service';

const requireRestSample: IStatistique = {
  ...sampleWithRequiredData,
};

describe('Statistique Service', () => {
  let service: StatistiqueService;
  let httpMock: HttpTestingController;
  let expectedResult: IStatistique | IStatistique[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StatistiqueService);
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

    it('should create a Statistique', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const statistique = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(statistique).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Statistique', () => {
      const statistique = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(statistique).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Statistique', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Statistique', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Statistique', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStatistiqueToCollectionIfMissing', () => {
      it('should add a Statistique to an empty array', () => {
        const statistique: IStatistique = sampleWithRequiredData;
        expectedResult = service.addStatistiqueToCollectionIfMissing([], statistique);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(statistique);
      });

      it('should not add a Statistique to an array that contains it', () => {
        const statistique: IStatistique = sampleWithRequiredData;
        const statistiqueCollection: IStatistique[] = [
          {
            ...statistique,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStatistiqueToCollectionIfMissing(statistiqueCollection, statistique);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Statistique to an array that doesn't contain it", () => {
        const statistique: IStatistique = sampleWithRequiredData;
        const statistiqueCollection: IStatistique[] = [sampleWithPartialData];
        expectedResult = service.addStatistiqueToCollectionIfMissing(statistiqueCollection, statistique);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(statistique);
      });

      it('should add only unique Statistique to an array', () => {
        const statistiqueArray: IStatistique[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const statistiqueCollection: IStatistique[] = [sampleWithRequiredData];
        expectedResult = service.addStatistiqueToCollectionIfMissing(statistiqueCollection, ...statistiqueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const statistique: IStatistique = sampleWithRequiredData;
        const statistique2: IStatistique = sampleWithPartialData;
        expectedResult = service.addStatistiqueToCollectionIfMissing([], statistique, statistique2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(statistique);
        expect(expectedResult).toContain(statistique2);
      });

      it('should accept null and undefined values', () => {
        const statistique: IStatistique = sampleWithRequiredData;
        expectedResult = service.addStatistiqueToCollectionIfMissing([], null, statistique, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(statistique);
      });

      it('should return initial array if no Statistique is added', () => {
        const statistiqueCollection: IStatistique[] = [sampleWithRequiredData];
        expectedResult = service.addStatistiqueToCollectionIfMissing(statistiqueCollection, undefined, null);
        expect(expectedResult).toEqual(statistiqueCollection);
      });
    });

    describe('compareStatistique', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStatistique(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStatistique(entity1, entity2);
        const compareResult2 = service.compareStatistique(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStatistique(entity1, entity2);
        const compareResult2 = service.compareStatistique(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStatistique(entity1, entity2);
        const compareResult2 = service.compareStatistique(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
