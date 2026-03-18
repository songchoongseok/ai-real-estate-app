import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionSection from './TransactionSection';
import type { PropertyFormData } from '../../types/property';

function createFormData(overrides: Partial<PropertyFormData> = {}): PropertyFormData {
  return {
    propertyType: 'STORE_OFFICE',
    propertySubType: '',
    isDirect: false,
    owner: { name: '테스트', phone1: '010-0000-0000', phone2: '' },
    receivedDate: '2026-03-17',
    address: { region1: '서울시', region2: '강남구', region3: '역삼동', detail: '' },
    transactionType: 'SALE',
    price: {},
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

describe('TransactionSection', () => {
  it('매매 탭 선택 시 매매가 필드가 표시되어야 한다', () => {
    // Given
    const formData = createFormData({ transactionType: 'SALE' });

    // When
    render(
      <TransactionSection
        formData={formData}
        errors={{}}
        updateField={vi.fn()}
        updateNestedField={vi.fn()}
      />
    );

    // Then
    expect(screen.getByText('매매가')).toBeInTheDocument();
  });

  it('월세 탭 선택 시 보증금과 월세 필드가 표시되어야 한다', () => {
    // Given
    const formData = createFormData({ transactionType: 'MONTHLY' });

    // When
    render(
      <TransactionSection
        formData={formData}
        errors={{}}
        updateField={vi.fn()}
        updateNestedField={vi.fn()}
      />
    );

    // Then
    expect(screen.getByText('보증금')).toBeInTheDocument();
    // '월세' 텍스트는 탭 버튼과 필드 라벨 두 곳에 존재
    const monthlyElements = screen.getAllByText('월세');
    expect(monthlyElements.length).toBeGreaterThanOrEqual(2); // 탭 버튼 + 필드 라벨
  });

  it('전세 탭 선택 시 보증금 필드만 표시되어야 한다', () => {
    // Given
    const formData = createFormData({ transactionType: 'JEONSE' });

    // When
    render(
      <TransactionSection
        formData={formData}
        errors={{}}
        updateField={vi.fn()}
        updateNestedField={vi.fn()}
      />
    );

    // Then
    expect(screen.getByText('보증금')).toBeInTheDocument();
    // 월세 label이 없어야 함 (거래유형 탭의 '월세'와 구분 필요)
    const monthlyLabels = screen.getAllByText('월세');
    // 거래유형 탭에 '월세' 텍스트가 있으므로, 해당 텍스트만 존재해야 함
    expect(monthlyLabels).toHaveLength(1); // 탭 버튼에만 존재
  });

  it('매매 탭 선택 시 보증금/월세 필드가 표시되지 않아야 한다', () => {
    // Given
    const formData = createFormData({ transactionType: 'SALE' });

    // When
    render(
      <TransactionSection
        formData={formData}
        errors={{}}
        updateField={vi.fn()}
        updateNestedField={vi.fn()}
      />
    );

    // Then
    expect(screen.queryByText('보증금')).not.toBeInTheDocument();
  });

  it('거래유형 탭 클릭 시 updateField가 호출되어야 한다', async () => {
    // Given
    const updateField = vi.fn();
    const user = userEvent.setup();
    const formData = createFormData({ transactionType: 'SALE' });

    render(
      <TransactionSection
        formData={formData}
        errors={{}}
        updateField={updateField}
        updateNestedField={vi.fn()}
      />
    );

    // When: 전세 탭 클릭
    await user.click(screen.getByText('전세'));

    // Then
    expect(updateField).toHaveBeenCalledWith('transactionType', 'JEONSE');
  });
});
