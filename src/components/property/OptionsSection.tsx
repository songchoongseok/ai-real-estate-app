import React from 'react';
import type { PropertyFormData, AdPlatform, PropertyStatus, Facility } from '../../types/property';
import {
  AD_PLATFORM_OPTIONS,
  STATUS_OPTIONS,
  FACILITY_OPTIONS,
} from '../../constants/property-options';
import CheckboxGroup from '../common/CheckboxGroup';
import SelectInput from '../common/SelectInput';
import styles from './PropertyForm.module.css';

interface OptionsSectionProps {
  formData: PropertyFormData;
  errors: Record<string, string>;
  updateField: (field: string, value: unknown) => void;
  toggleFacility: (facility: Facility) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  formData,
  errors,
  updateField,
  toggleFacility,
}) => {
  const toggleAdPlatform = (platform: string) => {
    const current = formData.adPlatforms;
    const updated = current.includes(platform as AdPlatform)
      ? current.filter((p) => p !== platform)
      : [...current, platform as AdPlatform];
    updateField('adPlatforms', updated);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>옵션 / 시설</div>
      <div className={styles.sectionBody}>
        <div className={styles.memoRow}>
          <label className={styles.fieldLabel}>메모</label>
          <textarea
            className={styles.textarea}
            value={formData.memo ?? ''}
            onChange={(e) => updateField('memo', e.target.value)}
            placeholder="메모 입력"
            rows={2}
          />
        </div>

        <CheckboxGroup
          label="내부시설"
          options={FACILITY_OPTIONS}
          selectedValues={formData.facilities}
          onChange={(v) => toggleFacility(v as Facility)}
        />

        <CheckboxGroup
          label="광고"
          options={AD_PLATFORM_OPTIONS}
          selectedValues={formData.adPlatforms}
          onChange={toggleAdPlatform}
        />

        <SelectInput
          label="상태"
          value={formData.status}
          onChange={(v) => updateField('status', v as PropertyStatus)}
          options={STATUS_OPTIONS}
          error={errors.status}
        />
      </div>
    </div>
  );
};

export default OptionsSection;
