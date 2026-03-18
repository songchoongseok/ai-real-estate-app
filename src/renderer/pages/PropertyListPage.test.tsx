import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PropertyListPage from './PropertyListPage';
import { propertyStorage } from '../services/property-storage';
import type { Property } from '../types/property';

vi.mock('../services/property-storage');

function createProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: 'TEST-001',
    propertyType: 'STORE_OFFICE',
    propertySubType: '',
    isDirect: false,
    owner: { name: '테스트', phone1: '010-0000-0000' },
    receivedDate: '2026-03-17',
    address: { region1: '서울시', region2: '강남구', region3: '역삼동', detail: '123' },
    transactionType: 'SALE',
    price: { salePrice: 50000 },
    moveInDate: { immediate: false, negotiable: false },
    area: { exclusiveArea: 33 },
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

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <PropertyListPage />
    </MemoryRouter>
  );
}

describe('PropertyListPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('렌더링 시 "매물 목록" 제목이 표시되어야 한다', async () => {
    vi.mocked(propertyStorage.getAll).mockResolvedValue([]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('매물 목록')).toBeInTheDocument();
    });
  });

  it('매물이 없을 때 안내 메시지가 표시되어야 한다', async () => {
    vi.mocked(propertyStorage.getAll).mockResolvedValue([]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('등록된 매물이 없습니다. 매물을 등록해주세요.')).toBeInTheDocument();
    });
  });

  it('저장된 매물이 테이블에 표시되어야 한다', async () => {
    const properties = [
      createProperty({ id: 'P-001', buildingName: '테스트빌딩' }),
      createProperty({
        id: 'P-002',
        propertyType: 'APARTMENT',
        transactionType: 'JEONSE',
        price: { deposit: 20000 },
        address: { region1: '서울시', region2: '서초구', region3: '반포동', detail: '' },
      }),
    ];
    vi.mocked(propertyStorage.getAll).mockResolvedValue(properties);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('P-001')).toBeInTheDocument();
      expect(screen.getByText('P-002')).toBeInTheDocument();
    });
  });

  it('검색어 입력 시 매물이 필터링되어야 한다', async () => {
    const properties = [
      createProperty({
        id: 'P-001',
        address: { region1: '서울시', region2: '강남구', region3: '역삼동', detail: '' },
      }),
      createProperty({
        id: 'P-002',
        address: { region1: '부산시', region2: '해운대구', region3: '우동', detail: '' },
      }),
    ];
    vi.mocked(propertyStorage.getAll).mockResolvedValue(properties);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('P-001')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('건물명, 주소로 검색...');
    fireEvent.change(searchInput, { target: { value: '부산' } });

    expect(screen.queryByText('P-001')).not.toBeInTheDocument();
    expect(screen.getByText('P-002')).toBeInTheDocument();
  });

  it('물건유형 필터 선택 시 해당 유형만 표시되어야 한다', async () => {
    const properties = [
      createProperty({ id: 'P-001', propertyType: 'STORE_OFFICE' }),
      createProperty({ id: 'P-002', propertyType: 'APARTMENT' }),
    ];
    vi.mocked(propertyStorage.getAll).mockResolvedValue(properties);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('P-001')).toBeInTheDocument();
    });

    const typeSelect = screen.getByDisplayValue('물건유형 전체');
    fireEvent.change(typeSelect, { target: { value: 'APARTMENT' } });

    expect(screen.queryByText('P-001')).not.toBeInTheDocument();
    expect(screen.getByText('P-002')).toBeInTheDocument();
  });

  it('거래유형 필터 선택 시 해당 유형만 표시되어야 한다', async () => {
    const properties = [
      createProperty({ id: 'P-001', transactionType: 'SALE' }),
      createProperty({ id: 'P-002', transactionType: 'JEONSE', price: { deposit: 10000 } }),
    ];
    vi.mocked(propertyStorage.getAll).mockResolvedValue(properties);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('P-001')).toBeInTheDocument();
    });

    const transactionSelect = screen.getByDisplayValue('거래유형 전체');
    fireEvent.change(transactionSelect, { target: { value: 'JEONSE' } });

    expect(screen.queryByText('P-001')).not.toBeInTheDocument();
    expect(screen.getByText('P-002')).toBeInTheDocument();
  });

  it('상태 필터 선택 시 해당 상태만 표시되어야 한다', async () => {
    const properties = [
      createProperty({ id: 'P-001', status: 'NORMAL' }),
      createProperty({ id: 'P-002', status: 'URGENT' }),
    ];
    vi.mocked(propertyStorage.getAll).mockResolvedValue(properties);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('P-001')).toBeInTheDocument();
    });

    const statusSelect = screen.getByDisplayValue('상태 전체');
    fireEvent.change(statusSelect, { target: { value: 'URGENT' } });

    expect(screen.queryByText('P-001')).not.toBeInTheDocument();
    expect(screen.getByText('P-002')).toBeInTheDocument();
  });

  it('삭제 버튼 클릭 후 confirm 시 매물이 제거되어야 한다', async () => {
    const properties = [createProperty({ id: 'P-001' })];
    vi.mocked(propertyStorage.getAll)
      .mockResolvedValueOnce(properties)
      .mockResolvedValueOnce([]);
    vi.mocked(propertyStorage.deleteById).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('P-001')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('삭제');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('정말 삭제하시겠습니까?');
    expect(propertyStorage.deleteById).toHaveBeenCalledWith('P-001');

    await waitFor(() => {
      expect(screen.queryByText('P-001')).not.toBeInTheDocument();
    });
  });
});
