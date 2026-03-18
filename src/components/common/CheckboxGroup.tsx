import React from 'react';
import styles from './Common.module.css';

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  return (
    <div className={styles.fieldRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.checkboxGroup}>
        {options.map((opt) => (
          <label key={opt.value} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
