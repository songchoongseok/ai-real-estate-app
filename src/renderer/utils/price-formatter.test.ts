import { describe, it, expect } from 'vitest';
import { formatPrice, formatTransactionPrice } from './price-formatter';
import type { Property } from '../types/property';

function createProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: 'TEST-001',
    propertyType: 'STORE_OFFICE',
    propertySubType: '',
    isDirect: false,
    owner: { name: '테스트', phone1: '010-0000-0000' },
    receivedDate: '2026-03-17',
    address: { region1: '서울시', region2: '강남구', region3: '역삼동', detail: '' },
    transactionType: 'SALE',
    price: {},
    moveInDate: { immediate: false, negotiable: false },
    area: {},
    buildingStructure: '',
    floor: {},
    rooms: [],
    facilities: [],
    memo: '',
    adPlatforms: [],
    status: 'NORMAL',
    createdAt: '2026-03-17T00:00:00.000Z',
    updatedAt: '2026-03-17T00:00:00.000Z',
    ...overrides,
  };
}

describe('formatPrice', () => {
  it('10000 → "1억"', () => {
    expect(formatPrice(10000)).toBe('1억');
  });

  it('32000 → "3억 2,000"', () => {
    expect(formatPrice(32000)).toBe('3억 2,000');
  });

  it('5000 → "5,000"', () => {
    expect(formatPrice(5000)).toBe('5,000');
  });

  it('0 → "0"', () => {
    expect(formatPrice(0)).toBe('0');
  });

  it('15500 → "1억 5,500"', () => {
    expect(formatPrice(15500)).toBe('1억 5,500');
  });
});

describe('formatTransactionPrice', () => {
  it('SALE 매물은 매매가를 표시해야 한다', () => {
    const property = createProperty({
      transactionType: 'SALE',
      price: { salePrice: 50000 },
    });
    expect(formatTransactionPrice(property)).toBe('5억');
  });

  it('MONTHLY 매물은 "보증금/월세" 형식으로 표시해야 한다', () => {
    const property = createProperty({
      transactionType: 'MONTHLY',
      price: { deposit: 5000, monthlyRent: 50 },
    });
    expect(formatTransactionPrice(property)).toBe('5,000/50');
  });

  it('JEONSE 매물은 보증금을 표시해야 한다', () => {
    const property = createProperty({
      transactionType: 'JEONSE',
      price: { deposit: 20000 },
    });
    expect(formatTransactionPrice(property)).toBe('2억');
  });

  it('EXCHANGE 매물은 "교환"을 표시해야 한다', () => {
    const property = createProperty({
      transactionType: 'EXCHANGE',
    });
    expect(formatTransactionPrice(property)).toBe('교환');
  });
});
