import React from 'react';
import type { PropertyFormData } from '../../types/property';
import {
  DIRECTION_OPTIONS,
  BUILDING_STRUCTURE_OPTIONS,
} from '../../constants/property-options';
import SelectInput from '../common/SelectInput';
import TextInput from '../common/TextInput';
import AreaInput from '../common/AreaInput';
import styles from './PropertyForm.module.css';

interface DetailInfoSectionProps {
  formData: PropertyFormData;
  errors: Record<string, string>;
  updateField: (field: string, value: unknown) => void;
  updateNestedField: (parent: string, field: string, value: unknown) => void;
}

const DetailInfoSection: React.FC<DetailInfoSectionProps> = ({
  formData,
  errors,
  updateField,
  updateNestedField,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>상세 정보</div>
      <div className={styles.sectionBody}>
        <AreaInput
          label="대지면적"
          value={formData.area.landArea}
          onChange={(v) => updateNestedField('area', 'landArea', v)}
        />
        <AreaInput
          label="공급면적"
          value={formData.area.supplyArea}
          onChange={(v) => updateNestedField('area', 'supplyArea', v)}
        />
        <AreaInput
          label="전용면적"
          value={formData.area.exclusiveArea}
          onChange={(v) => updateNestedField('area', 'exclusiveArea', v)}
        />
        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <SelectInput
              label="구조"
              value={formData.buildingStructure ?? ''}
              onChange={(v) => updateField('buildingStructure', v)}
              options={BUILDING_STRUCTURE_OPTIONS.map((s) => ({ label: s, value: s }))}
            />
          </div>
          <div className={styles.inlineFieldHalf}>
            <SelectInput
              label="방향"
              value={formData.direction ?? ''}
              onChange={(v) => updateField('direction', v || undefined)}
              options={DIRECTION_OPTIONS}
            />
          </div>
        </div>
        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="현재층"
              value={formData.floor.currentFloor?.toString() ?? ''}
              onChange={(v) =>
                updateNestedField('floor', 'currentFloor', v === '' ? undefined : Number(v))
              }
              type="number"
              placeholder="층"
              suffix="층"
            />
          </div>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="총층수"
              value={formData.floor.totalFloors?.toString() ?? ''}
              onChange={(v) =>
                updateNestedField('floor', 'totalFloors', v === '' ? undefined : Number(v))
              }
              type="number"
              placeholder="층"
              suffix="층"
            />
          </div>
        </div>
        <div className={styles.inlineFields}>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="준공일"
              value={formData.completionDate ?? ''}
              onChange={(v) => updateField('completionDate', v)}
              placeholder="2020-01"
            />
          </div>
          <div className={styles.inlineFieldHalf}>
            <TextInput
              label="추천용도"
              value={formData.recommendedUse ?? ''}
              onChange={(v) => updateField('recommendedUse', v)}
              placeholder="사무실, 카페"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailInfoSection;
