import React from 'react';
import type { PropertyFormData } from '../../types/property';
import { TRANSACTION_TYPE_OPTIONS } from '../../constants/property-options';
import TabSelector from '../common/TabSelector';
import TextInput from '../common/TextInput';
import styles from './PropertyForm.module.css';

interface TransactionSectionProps {
  formData: PropertyFormData;
  errors: Record<string, string>;
  updateField: (field: string, value: unknown) => void;
  updateNestedField: (parent: string, field: string, value: unknown) => void;
}

const TransactionSection: React.FC<TransactionSectionProps> = ({
  formData,
  errors,
  updateField,
  updateNestedField,
}) => {
  const txType = formData.transactionType;

  const handlePriceChange = (field: string, raw: string) => {
    const value = raw === '' ? undefined : Number(raw);
    updateNestedField('price', field, value);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>거래 정보</div>
      <div className={styles.sectionBody}>
        <TabSelector
          label="거래유형"
          value={txType}
          onChange={(v) => updateField('transactionType', v)}
          options={TRANSACTION_TYPE_OPTIONS}
          error={errors.transactionType}
        />

        {txType === 'SALE' && (
          <TextInput
            label="매매가"
            value={formData.price.salePrice?.toString() ?? ''}
            onChange={(v) => handlePriceChange('salePrice', v)}
            placeholder="만원 단위"
            type="number"
            suffix="만원"
            error={errors['price.salePrice']}
          />
        )}

        {(txType === 'JEONSE' || txType === 'MONTHLY') && (
          <TextInput
            label="보증금"
            value={formData.price.deposit?.toString() ?? ''}
            onChange={(v) => handlePriceChange('deposit', v)}
            placeholder="만원 단위"
            type="number"
            suffix="만원"
            error={errors['price.deposit']}
          />
        )}

        {txType === 'MONTHLY' && (
          <TextInput
            label="월세"
            value={formData.price.monthlyRent?.toString() ?? ''}
            onChange={(v) => handlePriceChange('monthlyRent', v)}
            placeholder="만원 단위"
            type="number"
            suffix="만원"
            error={errors['price.monthlyRent']}
          />
        )}

        <TextInput
          label="관리비"
          value={formData.price.maintenanceFee?.toString() ?? ''}
          onChange={(v) => handlePriceChange('maintenanceFee', v)}
          placeholder="만원 단위"
          type="number"
          suffix="만원"
        />

        <div className={styles.moveInRow}>
          <label className={styles.fieldLabel}>입주일</label>
          <div className={styles.moveInControls}>
            <input
              type="date"
              className={styles.dateInput}
              value={formData.moveInDate.date ?? ''}
              onChange={(e) =>
                updateNestedField('moveInDate', 'date', e.target.value)
              }
            />
            <label className={styles.inlineCheck}>
              <input
                type="checkbox"
                checked={formData.moveInDate.immediate}
                onChange={(e) =>
                  updateNestedField('moveInDate', 'immediate', e.target.checked)
                }
              />
              즉시입주
            </label>
            <label className={styles.inlineCheck}>
              <input
                type="checkbox"
                checked={formData.moveInDate.negotiable}
                onChange={(e) =>
                  updateNestedField('moveInDate', 'negotiable', e.target.checked)
                }
              />
              협의가능
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSection;
