import React from 'react';
import styles from './PropertyForm.module.css';

interface FormActionsProps {
  onSave: () => void;
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  showDelete?: boolean;
  showDuplicate?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onClose,
  onDuplicate,
  onDelete,
  showDelete = true,
  showDuplicate = true,
}) => {
  return (
    <div className={styles.actionGroup}>
      <button type="button" className={styles.saveBtn} onClick={onSave}>
        저장
      </button>
      <button type="button" className={styles.closeBtn} onClick={onClose}>
        닫기
      </button>
      {showDuplicate && (
        <button type="button" className={styles.duplicateBtn} onClick={onDuplicate}>
          복사
        </button>
      )}
      {showDelete && (
        <button type="button" className={styles.deleteBtn} onClick={onDelete}>
          삭제
        </button>
      )}
    </div>
  );
};

export default FormActions;
