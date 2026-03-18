import type { Property } from '../types/property';

export function formatPrice(price: number): string {
  if (price <= 0) return '0';
  const uk = Math.floor(price / 10000);
  const rest = price % 10000;
  if (uk > 0 && rest > 0) return `${uk}억 ${rest.toLocaleString()}`;
  if (uk > 0) return `${uk}억`;
  return price.toLocaleString();
}

export function formatTransactionPrice(property: Property): string {
  switch (property.transactionType) {
    case 'SALE':
      return formatPrice(property.price.salePrice || 0);
    case 'JEONSE':
      return formatPrice(property.price.deposit || 0);
    case 'MONTHLY':
      return `${formatPrice(property.price.deposit || 0)}/${(property.price.monthlyRent || 0).toLocaleString()}`;
    case 'EXCHANGE':
      return '교환';
  }
}
