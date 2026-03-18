import React, { useState } from 'react';
import type { PropertyFormData, RoomUnit } from '../../types/property';
import { BUILDING_TYPE_OPTIONS } from '../../constants/property-options';
import TextInput from '../common/TextInput';
import SelectInput from '../common/SelectInput';
import styles from './PropertyForm.module.css';

interface BuildingInfoSectionProps {
  formData: PropertyFormData;
  errors: Record<string, string>;
  updateField: (field: string, value: unknown) => void;
  addRoom: (room: RoomUnit) => void;
  removeRoom: (index: number) => void;
}

const BuildingInfoSection: React.FC<BuildingInfoSectionProps> = ({
  formData,
  errors,
  updateField,
  addRoom,
  removeRoom,
}) => {
  const [newRoom, setNewRoom] = useState<RoomUnit>({
    floor: 1,
    roomNumber: '',
    area: undefined,
    structure: '',
  });

  const handleAddRoom = () => {
    if (!newRoom.roomNumber.trim()) return;
    addRoom({ ...newRoom });
    setNewRoom({ floor: 1, roomNumber: '', area: undefined, structure: '' });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>건물 정보</div>
      <div className={styles.sectionBody}>
        <TextInput
          label="건물명"
          value={formData.buildingName ?? ''}
          onChange={(v) => updateField('buildingName', v)}
          placeholder="건물명 입력"
        />
        <SelectInput
          label="건물유형"
          value={formData.buildingType ?? ''}
          onChange={(v) => updateField('buildingType', v)}
          options={BUILDING_TYPE_OPTIONS.map((s) => ({ label: s, value: s }))}
        />

        <div className={styles.roomSection}>
          <div className={styles.roomHeader}>
            <span className={styles.roomTitle}>호실 정보</span>
          </div>

          {formData.rooms.length > 0 && (
            <table className={styles.roomTable}>
              <thead>
                <tr>
                  <th>층</th>
                  <th>호실</th>
                  <th>면적(m&sup2;)</th>
                  <th>구조</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.rooms.map((room, idx) => (
                  <tr key={idx}>
                    <td>{room.floor}</td>
                    <td>{room.roomNumber}</td>
                    <td>{room.area ?? '-'}</td>
                    <td>{room.structure || '-'}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeRoom(idx)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className={styles.addRoomRow}>
            <input
              type="number"
              className={styles.roomInput}
              placeholder="층"
              value={newRoom.floor}
              onChange={(e) =>
                setNewRoom({ ...newRoom, floor: Number(e.target.value) })
              }
            />
            <input
              className={styles.roomInput}
              placeholder="호실"
              value={newRoom.roomNumber}
              onChange={(e) =>
                setNewRoom({ ...newRoom, roomNumber: e.target.value })
              }
            />
            <input
              type="number"
              className={styles.roomInput}
              placeholder="면적(m²)"
              value={newRoom.area ?? ''}
              onChange={(e) =>
                setNewRoom({
                  ...newRoom,
                  area: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            <input
              className={styles.roomInput}
              placeholder="구조"
              value={newRoom.structure ?? ''}
              onChange={(e) =>
                setNewRoom({ ...newRoom, structure: e.target.value })
              }
            />
            <button
              type="button"
              className={styles.addRoomBtn}
              onClick={handleAddRoom}
            >
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingInfoSection;
