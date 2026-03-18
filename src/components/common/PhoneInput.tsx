import React from 'react';
import styles from './Common.module.css';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '010-0000-0000',
  error,
}) => {
  const handleChange = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    let formatted = digits;
    if (digits.length > 3 && digits.length <= 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
    onChange(formatted);
  };

  return (
    <div className={styles.fieldRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type="tel"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          maxLength={13}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
};

export default PhoneInput;
