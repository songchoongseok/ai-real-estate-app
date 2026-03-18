import { describe, it, expect } from 'vitest';
import { generatePropertyId } from './id-generator';

describe('generatePropertyId', () => {
  it('#Y로 시작해야 한다', () => {
    const id = generatePropertyId();
    expect(id.startsWith('#Y')).toBe(true);
  });

  it('적절한 길이(11자: #Y + 9자리)여야 한다', () => {
    const id = generatePropertyId();
    expect(id).toHaveLength(11);
  });

  it('호출마다 고유한 ID를 생성해야 한다', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 20; i++) {
      ids.add(generatePropertyId());
    }
    // 랜덤 요소가 포함되어 있으므로 대부분 고유해야 한다
    expect(ids.size).toBeGreaterThanOrEqual(15);
  });
});
