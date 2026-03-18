import type { PropertyFormData } from '../types/property';

export function validatePropertyForm(
  data: PropertyFormData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.propertyType) {
    errors.propertyType = '물건유형을 선택해주세요.';
  }

  if (!data.owner.name.trim()) {
    errors['owner.name'] = '소유자 이름을 입력해주세요.';
  }

  if (!data.owner.phone1.trim()) {
    errors['owner.phone1'] = '소유자 연락처를 입력해주세요.';
  }

  if (!data.receivedDate) {
    errors.receivedDate = '접수일을 입력해주세요.';
  }

  if (!data.address.region1.trim()) {
    errors['address.region1'] = '시/도를 입력해주세요.';
  }

  if (!data.address.region2.trim()) {
    errors['address.region2'] = '시/군/구를 입력해주세요.';
  }

  if (!data.address.region3.trim()) {
    errors['address.region3'] = '읍/면/동을 입력해주세요.';
  }

  if (!data.transactionType) {
    errors.transactionType = '거래유형을 선택해주세요.';
  }

  if (data.transactionType === 'SALE' && !data.price.salePrice) {
    errors['price.salePrice'] = '매매가를 입력해주세요.';
  }

  if (
    (data.transactionType === 'JEONSE' || data.transactionType === 'MONTHLY') &&
    !data.price.deposit
  ) {
    errors['price.deposit'] = '보증금을 입력해주세요.';
  }

  if (data.transactionType === 'MONTHLY' && !data.price.monthlyRent) {
    errors['price.monthlyRent'] = '월세를 입력해주세요.';
  }

  if (!data.status) {
    errors.status = '상태를 선택해주세요.';
  }

  return errors;
}
