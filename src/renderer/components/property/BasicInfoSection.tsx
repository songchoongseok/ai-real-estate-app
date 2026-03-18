import React from 'react';
import type { PropertyFormData } from '../../types/property';
import { PROPERTY_TYPE_OPTIONS, PROPERTY_SUB_TYPE_OPTIONS } from '../../constants/property-options';
import TextInput from '../common/TextInput';
import SelectInput from '../common/SelectInput';
import PhoneInput from '../common/PhoneInput';
import DateInput from '../common/DateInput';
import styles from './PropertyForm.module.css';

interface BasicInfoSectionProps {
  formData: PropertyFormData;
  errors: Record<string, string>;
  propertyId: string;
  updateField: (field: string, value: unknown) => void;
  updateNestedField: (parent: string, field: string, value: unknown) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  propertyId,
  updateField,
  updateNestedField,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>기본 정보</div>
      <div className={styles.sectionBody}>
        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <TextInput label="물건번호" value={propertyId} onChange={() => {}} readOnly />
          </div>
          <div className={styles.inlineFieldHalf}>
            <DateInput
              label="접수일"
              value={formData.receivedDate}
              onChange={(v) => updateField('receivedDate', v)}
              error={errors.receivedDate}
            />
          </div>
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <SelectInput
              label="물건유형"
              value={formData.propertyType}
              onChange={(v) => updateField('propertyType', v)}
              options={PROPERTY_TYPE_OPTIONS}
              error={errors.propertyType}
            />
          </div>
          <div className={styles.inlineFieldHalf}>
            {formData.propertyType ? (
              <SelectInput
                label="물건구분"
                value={formData.propertySubType ?? ''}
                onChange={(v) => updateField('propertySubType', v)}
                options={(PROPERTY_SUB_TYPE_OPTIONS[formData.propertyType] || []).map(
                  (s) => ({ label: s, value: s })
                )}
              />
            ) : (
              <div />
            )}
          </div>
        </div>

        <div className={styles.fieldRow}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={formData.isDirect}
              onChange={(e) => updateField('isDirect', e.target.checked)}
            />
            <span>직접물건</span>
          </label>
        </div>

        <TextInput
          label="소유자명"
          value={formData.owner.name}
          onChange={(v) => updateNestedField('owner', 'name', v)}
          placeholder="소유자 이름"
          error={errors['owner.name']}
        />
        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <PhoneInput
              label="연락처1"
              value={formData.owner.phone1}
              onChange={(v) => updateNestedField('owner', 'phone1', v)}
              error={errors['owner.phone1']}
            />
          </div>
          <div className={styles.inlineFieldHalf}>
            <PhoneInput
              label="연락처2"
              value={formData.owner.phone2 ?? ''}
              onChange={(v) => updateNestedField('owner', 'phone2', v)}
            />
          </div>
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="시/도"
              value={formData.address.region1}
              onChange={(v) => updateNestedField('address', 'region1', v)}
              placeholder="서울특별시"
              error={errors['address.region1']}
            />
          </div>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="시/군/구"
              value={formData.address.region2}
              onChange={(v) => updateNestedField('address', 'region2', v)}
              placeholder="강남구"
              error={errors['address.region2']}
            />
          </div>
        </div>
        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="읍/면/동"
              value={formData.address.region3}
              onChange={(v) => updateNestedField('address', 'region3', v)}
              placeholder="역삼동"
              error={errors['address.region3']}
            />
          </div>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="상세주소"
              value={formData.address.detail}
              onChange={(v) => updateNestedField('address', 'detail', v)}
              placeholder="상세주소"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
