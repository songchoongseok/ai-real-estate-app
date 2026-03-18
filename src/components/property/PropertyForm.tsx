import React, { useEffect } from 'react';
import { usePropertyForm } from '../../hooks/usePropertyForm';
import { propertyStorage } from '../../services/property-storage';
import { generatePropertyId } from '../../utils/id-generator';
import BasicInfoSection from './BasicInfoSection';
import TransactionSection from './TransactionSection';
import DetailInfoSection from './DetailInfoSection';
import BuildingInfoSection from './BuildingInfoSection';
import OptionsSection from './OptionsSection';
import FormActions from './FormActions';
import styles from './PropertyForm.module.css';
import type { Property, PropertyFormData } from '../../types/property';

interface PropertyFormProps {
  mode?: 'create' | 'edit';
  initialProperty?: Property;
  onSaveComplete?: () => void;
  onCancel?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  mode = 'create',
  initialProperty,
  onSaveComplete,
  onCancel,
}) => {
  const propertyId = initialProperty?.id ?? generatePropertyId();

  const {
    formData,
    errors,
    updateField,
    updateNestedField,
    addRoom,
    removeRoom,
    toggleFacility,
    validate,
    resetForm,
    loadData,
  } = usePropertyForm();

  useEffect(() => {
    if (initialProperty) {
      const { id: _id, createdAt: _ca, updatedAt: _ua, ...data } = initialProperty;
      loadData(data as PropertyFormData);
    }
  }, [initialProperty, loadData]);

  const handleSave = async () => {
    if (!validate()) {
      alert('필수 항목을 확인해주세요.');
      return;
    }
    const existingId = mode === 'edit' ? initialProperty?.id : undefined;
    const saved = await propertyStorage.save(formData, existingId);
    alert(`매물이 저장되었습니다. (${saved.id})`);
    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  const handleClose = () => {
    if (confirm('작성 중인 내용이 사라집니다. 닫으시겠습니까?')) {
      if (onCancel) {
        onCancel();
      } else {
        resetForm();
      }
    }
  };

  const handleDuplicate = async () => {
    if (mode !== 'edit' || !initialProperty) {
      alert('먼저 매물을 저장해주세요.');
      return;
    }
    const copy = await propertyStorage.duplicate(initialProperty.id);
    if (copy) {
      alert(`매물이 복사되었습니다. (${copy.id})`);
      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !initialProperty) {
      alert('저장된 매물이 없습니다.');
      return;
    }
    if (confirm('정말 삭제하시겠습니까?')) {
      await propertyStorage.deleteById(initialProperty.id);
      alert('매물이 삭제되었습니다.');
      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>
          {mode === 'edit' ? '매물 수정' : '매물 등록'}
          {mode === 'edit' && (
            <span className={styles.propertyIdBadge}>{propertyId}</span>
          )}
        </h1>
        <FormActions
          onSave={handleSave}
          onClose={handleClose}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          showDelete={mode === 'edit'}
          showDuplicate={mode === 'edit'}
        />
      </div>

      <div className={styles.formGrid}>
        {/* 왼쪽 컬럼: 기본정보 + 거래정보 */}
        <div className={styles.column}>
          <BasicInfoSection
            formData={formData}
            errors={errors}
            propertyId={propertyId}
            updateField={updateField}
            updateNestedField={updateNestedField}
          />
          <TransactionSection
            formData={formData}
            errors={errors}
            updateField={updateField}
            updateNestedField={updateNestedField}
          />
        </div>

        {/* 오른쪽 컬럼: 상세정보 + 건물정보 + 옵션/시설 */}
        <div className={styles.column}>
          <DetailInfoSection
            formData={formData}
            errors={errors}
            updateField={updateField}
            updateNestedField={updateNestedField}
          />
          <BuildingInfoSection
            formData={formData}
            errors={errors}
            updateField={updateField}
            addRoom={addRoom}
            removeRoom={removeRoom}
          />
          <OptionsSection
            formData={formData}
            errors={errors}
            updateField={updateField}
            toggleFacility={toggleFacility}
          />
        </div>
      </div>

    </div>
  );
};

export default PropertyForm;
