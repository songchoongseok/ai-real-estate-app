import React from 'react';
import { sqmToPyeong } from '../../utils/area-converter';
import styles from './Common.module.css';

interface AreaInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  error?: string;
}

const AreaInput: React.FC<AreaInputProps> = ({ label, value, onChange, error }) => {
  const pyeong = value ? sqmToPyeong(value) : '';

  const handleChange = (raw: string) => {
    if (raw === '') {
      onChange(undefined);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className={styles.fieldRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.areaInputGroup}>
        <div className={styles.areaField}>
          <input
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            type="number"
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="0"
            step="0.01"
          />
          <span className={styles.suffix}>m&sup2;</span>
        </div>
        <div className={styles.areaField}>
          <input
            className={styles.input}
            type="text"
            value={pyeong}
            readOnly
            placeholder="0"
          />
          <span className={styles.suffix}>평</span>
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
};

export default AreaInput;
