const SQM_PER_PYEONG = 3.305785;

/**
 * 제곱미터를 평으로 변환
 */
export function sqmToPyeong(sqm: number): number {
  return Math.round((sqm / SQM_PER_PYEONG) * 100) / 100;
}

/**
 * 평을 제곱미터로 변환
 */
export function pyeongToSqm(pyeong: number): number {
  return Math.round(pyeong * SQM_PER_PYEONG * 100) / 100;
}
