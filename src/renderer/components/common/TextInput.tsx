import React from 'react';
import styles from './Common.module.css';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  type?: 'text' | 'number';
  suffix?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  error,
  type = 'text',
  suffix,
}) => {
  return (
    <div className={styles.fieldRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
};

export default TextInput;
