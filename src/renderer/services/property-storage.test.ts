import { describe, it, expect, beforeEach } from 'vitest';
import { propertyStorage } from './property-storage';
import type { PropertyFormData } from '../types/property';

function createTestFormData(overrides: Partial<PropertyFormData> = {}): PropertyFormData {
  return {
    propertyType: 'STORE_OFFICE',
    propertySubType: '',
    isDirect: false,
    owner: { name: '테스트', phone1: '010-0000-0000', phone2: '' },
    receivedDate: '2026-03-17',
    address: { region1: '서울시', region2: '강남구', region3: '역삼동', detail: '' },
    transactionType: 'SALE',
    price: { salePrice: 30000 },
    moveInDate: { immediate: false, negotiable: false },
    area: {},
    buildingStructure: '',
    floor: {},
    direction: undefined,
    completionDate: '',
    recommendedUse: '',
    buildingName: '',
    buildingType: '',
    rooms: [],
    facilities: [],
    memo: '',
    adPlatforms: [],
    status: 'NORMAL',
    ...overrides,
  };
}

describe('propertyStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('save 후 getById로 조회할 수 있어야 한다', async () => {
    // Given
    const formData = createTestFormData();

    // When
    const saved = await propertyStorage.save(formData);
    const found = await propertyStorage.getById(saved.id);

    // Then
    expect(found).not.toBeNull();
    expect(found!.id).toBe(saved.id);
    expect(found!.owner.name).toBe('테스트');
  });

  it('getAll로 전체 목록을 조회할 수 있어야 한다', async () => {
    // Given
    await propertyStorage.save(createTestFormData({ owner: { name: 'A', phone1: '010-1111-1111' } }));
    await propertyStorage.save(createTestFormData({ owner: { name: 'B', phone1: '010-2222-2222' } }));

    // When
    const all = await propertyStorage.getAll();

    // Then
    expect(all).toHaveLength(2);
  });

  it('deleteById 후 조회 시 null을 반환해야 한다', async () => {
    // Given
    const saved = await propertyStorage.save(createTestFormData());

    // When
    await propertyStorage.deleteById(saved.id);
    const found = await propertyStorage.getById(saved.id);

    // Then
    expect(found).toBeNull();
  });

  it('duplicate 시 새로운 id가 부여되어야 한다', async () => {
    // Given
    const saved = await propertyStorage.save(createTestFormData());

    // When
    const copy = await propertyStorage.duplicate(saved.id);

    // Then
    expect(copy).not.toBeNull();
    expect(copy!.id).not.toBe(saved.id);
    expect(copy!.owner.name).toBe(saved.owner.name);
    const all = await propertyStorage.getAll();
    expect(all).toHaveLength(2);
  });

  it('존재하지 않는 id로 duplicate 시 null을 반환해야 한다', async () => {
    const result = await propertyStorage.duplicate('nonexistent');
    expect(result).toBeNull();
  });

  it('save with existingId should update the property', async () => {
    // Given
    const saved = await propertyStorage.save(createTestFormData());
    const updatedData = createTestFormData({ owner: { name: '수정됨', phone1: '010-9999-9999' } });

    // When
    const updated = await propertyStorage.save(updatedData, saved.id);

    // Then
    expect(updated.id).toBe(saved.id);
    expect(updated.owner.name).toBe('수정됨');
    expect(updated.createdAt).toBe(saved.createdAt);
    const all = await propertyStorage.getAll();
    expect(all).toHaveLength(1);
  });
});
