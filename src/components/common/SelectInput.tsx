import React from 'react';
import styles from './Common.module.css';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = '선택해주세요',
  error,
}) => {
  return (
    <div className={styles.fieldRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <select
          className={`${styles.select} ${error ? styles.inputError : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
};

export default SelectInput;
