import { describe, it, expect } from 'vitest';
import { validatePropertyForm } from './validators';
import type { PropertyFormData } from '../types/property';

function createValidFormData(overrides: Partial<PropertyFormData> = {}): PropertyFormData {
  return {
    propertyType: 'STORE_OFFICE',
    propertySubType: '',
    isDirect: false,
    owner: { name: '홍길동', phone1: '010-1234-5678', phone2: '' },
    receivedDate: '2026-03-17',
    address: { region1: '서울시', region2: '강남구', region3: '역삼동', detail: '' },
    transactionType: 'SALE',
    price: { salePrice: 50000 },
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

describe('validatePropertyForm', () => {
  it('필수 필드 누락 시 에러를 반환해야 한다', () => {
    // Given: 비어있는 폼 데이터
    const emptyData = createValidFormData({
      propertyType: '' as any,
      owner: { name: '', phone1: '', phone2: '' },
      receivedDate: '',
      address: { region1: '', region2: '', region3: '', detail: '' },
      transactionType: '' as any,
      status: '' as any,
    });

    // When
    const errors = validatePropertyForm(emptyData);

    // Then
    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(errors.propertyType).toBeDefined();
    expect(errors['owner.name']).toBeDefined();
    expect(errors['owner.phone1']).toBeDefined();
    expect(errors.receivedDate).toBeDefined();
    expect(errors['address.region1']).toBeDefined();
    expect(errors['address.region2']).toBeDefined();
    expect(errors['address.region3']).toBeDefined();
    expect(errors.status).toBeDefined();
  });

  it('모든 필수 필드 입력 시 에러가 없어야 한다', () => {
    // Given
    const validData = createValidFormData();

    // When
    const errors = validatePropertyForm(validData);

    // Then
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('매매 거래유형일 때 매매가가 없으면 에러를 반환해야 한다', () => {
    // Given
    const data = createValidFormData({
      transactionType: 'SALE',
      price: {},
    });

    // When
    const errors = validatePropertyForm(data);

    // Then
    expect(errors['price.salePrice']).toBeDefined();
  });

  it('월세 거래유형일 때 보증금과 월세가 없으면 에러를 반환해야 한다', () => {
    // Given
    const data = createValidFormData({
      transactionType: 'MONTHLY',
      price: {},
    });

    // When
    const errors = validatePropertyForm(data);

    // Then
    expect(errors['price.deposit']).toBeDefined();
    expect(errors['price.monthlyRent']).toBeDefined();
  });

  it('전세 거래유형일 때 보증금이 없으면 에러를 반환해야 한다', () => {
    // Given
    const data = createValidFormData({
      transactionType: 'JEONSE',
      price: {},
    });

    // When
    const errors = validatePropertyForm(data);

    // Then
    expect(errors['price.deposit']).toBeDefined();
  });

  it('월세 거래유형일 때 보증금과 월세 모두 있으면 에러가 없어야 한다', () => {
    // Given
    const data = createValidFormData({
      transactionType: 'MONTHLY',
      price: { deposit: 1000, monthlyRent: 50 },
    });

    // When
    const errors = validatePropertyForm(data);

    // Then
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
