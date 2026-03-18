import React from 'react';
import styles from './Common.module.css';

interface TabOption {
  label: string;
  value: string;
}

interface TabSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: TabOption[];
  error?: string;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  label,
  value,
  onChange,
  options,
  error,
}) => {
  return (
    <div className={styles.fieldRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <div className={styles.tabGroup}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.tabButton} ${value === opt.value ? styles.tabActive : ''}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
};

export default TabSelector;
