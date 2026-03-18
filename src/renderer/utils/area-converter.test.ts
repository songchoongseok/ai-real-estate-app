import { describe, it, expect } from 'vitest';
import { sqmToPyeong, pyeongToSqm } from './area-converter';

describe('area-converter', () => {
  describe('sqmToPyeong', () => {
    it('33.0579sqm를 약 10평으로 변환해야 한다', () => {
      const result = sqmToPyeong(33.0579);
      expect(result).toBeCloseTo(10, 0);
    });

    it('0 입력 시 0을 반환해야 한다', () => {
      expect(sqmToPyeong(0)).toBe(0);
    });

    it('소수점 둘째 자리까지 반환해야 한다', () => {
      const result = sqmToPyeong(50);
      const decimalPart = result.toString().split('.')[1];
      expect(!decimalPart || decimalPart.length <= 2).toBe(true);
    });
  });

  describe('pyeongToSqm', () => {
    it('10평을 약 33.06sqm로 변환해야 한다', () => {
      const result = pyeongToSqm(10);
      expect(result).toBeCloseTo(33.06, 1);
    });

    it('0 입력 시 0을 반환해야 한다', () => {
      expect(pyeongToSqm(0)).toBe(0);
    });
  });
});
