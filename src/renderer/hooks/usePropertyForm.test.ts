import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePropertyForm } from './usePropertyForm';

describe('usePropertyForm', () => {
  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    expect(result.current.formData.propertyType).toBe('STORE_OFFICE');
    expect(result.current.formData.transactionType).toBe('SALE');
    expect(result.current.formData.status).toBe('NORMAL');
    expect(result.current.formData.rooms).toEqual([]);
    expect(result.current.formData.facilities).toEqual([]);
    expect(result.current.errors).toEqual({});
  });

  it('updateField로 필드를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.updateField('propertyType', 'APARTMENT');
    });

    expect(result.current.formData.propertyType).toBe('APARTMENT');
  });

  it('updateNestedField로 중첩 필드를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.updateNestedField('owner', 'name', '홍길동');
    });

    expect(result.current.formData.owner.name).toBe('홍길동');
  });

  it('toggleFacility로 시설을 토글할 수 있어야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    // 추가
    act(() => {
      result.current.toggleFacility('WALL_AC');
    });
    expect(result.current.formData.facilities).toContain('WALL_AC');

    // 제거
    act(() => {
      result.current.toggleFacility('WALL_AC');
    });
    expect(result.current.formData.facilities).not.toContain('WALL_AC');
  });

  it('addRoom으로 방을 추가할 수 있어야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.addRoom({ floor: 1, roomNumber: '101', area: 33 });
    });

    expect(result.current.formData.rooms).toHaveLength(1);
    expect(result.current.formData.rooms[0].roomNumber).toBe('101');
  });

  it('removeRoom으로 방을 제거할 수 있어야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.addRoom({ floor: 1, roomNumber: '101' });
      result.current.addRoom({ floor: 2, roomNumber: '201' });
    });

    act(() => {
      result.current.removeRoom(0);
    });

    expect(result.current.formData.rooms).toHaveLength(1);
    expect(result.current.formData.rooms[0].roomNumber).toBe('201');
  });

  it('validate 호출 시 필수 필드 누락이면 에러를 반환해야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    // 초기 상태에서 owner.name, owner.phone1, address 등이 비어있으므로 에러 발생
    act(() => {
      result.current.updateField('owner', { name: '', phone1: '', phone2: '' });
    });

    let isValid: boolean = false;
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(false);
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('모든 필수 필드가 입력되면 validate가 true를 반환해야 한다', () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.updateNestedField('owner', 'name', '홍길동');
      result.current.updateNestedField('owner', 'phone1', '010-1234-5678');
      result.current.updateNestedField('address', 'region1', '서울시');
      result.current.updateNestedField('address', 'region2', '강남구');
      result.current.updateNestedField('address', 'region3', '역삼동');
      result.current.updateNestedField('price', 'salePrice', 50000);
    });

    let isValid: boolean = false;
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(true);
    expect(Object.keys(result.current.errors)).toHaveLength(0);
  });
});
