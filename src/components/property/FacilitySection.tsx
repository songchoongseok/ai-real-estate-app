import React from 'react';
import type { Facility } from '../../types/property';
import { FACILITY_OPTIONS } from '../../constants/property-options';
import CheckboxGroup from '../common/CheckboxGroup';
import styles from './PropertyForm.module.css';

interface FacilitySectionProps {
  facilities: Facility[];
  toggleFacility: (facility: Facility) => void;
}

const FacilitySection: React.FC<FacilitySectionProps> = ({
  facilities,
  toggleFacility,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>내부시설</div>
      <div className={styles.sectionBody}>
        <CheckboxGroup
          label="시설"
          options={FACILITY_OPTIONS}
          selectedValues={facilities}
          onChange={(v) => toggleFacility(v as Facility)}
        />
      </div>
    </div>
  );
};

export default FacilitySection;
