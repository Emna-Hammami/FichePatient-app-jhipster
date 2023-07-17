import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHopital } from '../hopital.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../hopital.test-samples';

import { HopitalService } from './hopital.service';

const requireRestSample: IHopital = {
  ...sampleWithRequiredData,
};

describe('Hopital Service', () => {
  let service: HopitalService;
  let httpMock: HttpTestingController;
  let expectedResult: IHopital | IHopital[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HopitalService);
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

    it('should create a Hopital', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const hopital = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(hopital).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Hopital', () => {
      const hopital = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(hopital).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Hopital', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Hopital', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Hopital', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHopitalToCollectionIfMissing', () => {
      it('should add a Hopital to an empty array', () => {
        const hopital: IHopital = sampleWithRequiredData;
        expectedResult = service.addHopitalToCollectionIfMissing([], hopital);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hopital);
      });

      it('should not add a Hopital to an array that contains it', () => {
        const hopital: IHopital = sampleWithRequiredData;
        const hopitalCollection: IHopital[] = [
          {
            ...hopital,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHopitalToCollectionIfMissing(hopitalCollection, hopital);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Hopital to an array that doesn't contain it", () => {
        const hopital: IHopital = sampleWithRequiredData;
        const hopitalCollection: IHopital[] = [sampleWithPartialData];
        expectedResult = service.addHopitalToCollectionIfMissing(hopitalCollection, hopital);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hopital);
      });

      it('should add only unique Hopital to an array', () => {
        const hopitalArray: IHopital[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const hopitalCollection: IHopital[] = [sampleWithRequiredData];
        expectedResult = service.addHopitalToCollectionIfMissing(hopitalCollection, ...hopitalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const hopital: IHopital = sampleWithRequiredData;
        const hopital2: IHopital = sampleWithPartialData;
        expectedResult = service.addHopitalToCollectionIfMissing([], hopital, hopital2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hopital);
        expect(expectedResult).toContain(hopital2);
      });

      it('should accept null and undefined values', () => {
        const hopital: IHopital = sampleWithRequiredData;
        expectedResult = service.addHopitalToCollectionIfMissing([], null, hopital, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hopital);
      });

      it('should return initial array if no Hopital is added', () => {
        const hopitalCollection: IHopital[] = [sampleWithRequiredData];
        expectedResult = service.addHopitalToCollectionIfMissing(hopitalCollection, undefined, null);
        expect(expectedResult).toEqual(hopitalCollection);
      });
    });

    describe('compareHopital', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHopital(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHopital(entity1, entity2);
        const compareResult2 = service.compareHopital(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHopital(entity1, entity2);
        const compareResult2 = service.compareHopital(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHopital(entity1, entity2);
        const compareResult2 = service.compareHopital(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
