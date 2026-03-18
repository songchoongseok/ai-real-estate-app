import React from 'react';
import styles from './Common.module.css';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, error }) => {
  return (
    <div className={styles.fieldRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
};

export default DateInput;
