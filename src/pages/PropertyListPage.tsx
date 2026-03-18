import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyStorage } from '../services/property-storage';
import { formatTransactionPrice } from '../utils/price-formatter';
import {
  PROPERTY_TYPE_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  STATUS_OPTIONS,
} from '../constants/property-options';
import type { Property, PropertyType, TransactionType, PropertyStatus } from '../types/property';
import styles from './PropertyListPage.module.css';

const STATUS_COLORS: Record<PropertyStatus, string> = {
  URGENT: '#e53e3e',
  NORMAL: '#3182ce',
  FLEXIBLE: '#38a169',
  UNDECIDED: '#a0aec0',
  FAILED: '#dd6b20',
};

const STATUS_LABELS: Record<PropertyStatus, string> = {
  URGENT: '급매',
  NORMAL: '일반',
  FLEXIBLE: '여유',
  UNDECIDED: '미정',
  FAILED: '유찰',
};

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  STORE_OFFICE: '상가/사무실',
  APARTMENT: '아파트',
  OFFICETEL: '오피스텔',
  VILLA: '빌라/연립',
  HOUSE: '주택',
  ONE_ROOM: '원룸',
};

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  SALE: '매매',
  JEONSE: '전세',
  MONTHLY: '월세',
  EXCHANGE: '교환',
};

function formatArea(sqm: number | undefined): string {
  if (!sqm) return '-';
  const pyeong = (sqm / 3.306).toFixed(1);
  return `${sqm}m\u00B2 (${pyeong}평)`;
}

const PropertyListPage: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<PropertyType | ''>('');
  const [filterTransaction, setFilterTransaction] = useState<TransactionType | ''>('');
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | ''>('');

  const loadProperties = async () => {
    setLoading(true);
    const all = await propertyStorage.getAll();
    setProperties(all);
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (searchText) {
        const s = searchText.toLowerCase();
        const addressStr = `${p.address.region1} ${p.address.region2} ${p.address.region3} ${p.address.detail}`.toLowerCase();
        const buildingName = (p.buildingName || '').toLowerCase();
        if (!addressStr.includes(s) && !buildingName.includes(s)) return false;
      }
      if (filterType && p.propertyType !== filterType) return false;
      if (filterTransaction && p.transactionType !== filterTransaction) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      return true;
    });
  }, [properties, searchText, filterType, filterTransaction, filterStatus]);

  const handleRowClick = (id: string) => {
    navigate(`/property/edit/${id}`);
  };

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const copy = await propertyStorage.duplicate(id);
    if (copy) {
      await loadProperties();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('정말 삭제하시겠습니까?')) {
      await propertyStorage.deleteById(id);
      await loadProperties();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>매물 목록</h2>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => navigate('/property/new')}
        >
          + 매물 등록
        </button>
      </div>

      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="건물명, 주소로 검색..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as PropertyType | '')}
        >
          <option value="">물건유형 전체</option>
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={filterTransaction}
          onChange={(e) => setFilterTransaction(e.target.value as TransactionType | '')}
        >
          <option value="">거래유형 전체</option>
          {TRANSACTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as PropertyStatus | '')}
        >
          <option value="">상태 전체</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <p>로딩 중...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{'\uD83C\uDFE2'}</div>
            <p className={styles.emptyText}>
              {properties.length === 0
                ? '등록된 매물이 없습니다. 매물을 등록해주세요.'
                : '검색 결과가 없습니다.'}
            </p>
            {properties.length === 0 && (
              <button
                type="button"
                className={styles.addButton}
                onClick={() => navigate('/property/new')}
              >
                + 매물 등록하기
              </button>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>물건번호</th>
                <th>물건유형</th>
                <th>거래유형</th>
                <th>주소</th>
                <th>가격</th>
                <th>면적</th>
                <th>상태</th>
                <th>등록일</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(p.id)}
                >
                  <td className={styles.idCell}>{p.id}</td>
                  <td>{PROPERTY_TYPE_LABELS[p.propertyType]}</td>
                  <td>{TRANSACTION_TYPE_LABELS[p.transactionType]}</td>
                  <td className={styles.addressCell}>
                    {`${p.address.region1} ${p.address.region2} ${p.address.region3}`.trim()}
                    {p.address.detail ? ` ${p.address.detail}` : ''}
                  </td>
                  <td className={styles.priceCell}>{formatTransactionPrice(p)}</td>
                  <td>{formatArea(p.area.exclusiveArea || p.area.supplyArea)}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{ backgroundColor: STATUS_COLORS[p.status] }}
                    >
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/property/edit/${p.id}`);
                      }}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtnSecondary}
                      onClick={(e) => handleDuplicate(e, p.id)}
                    >
                      복제
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtnDanger}
                      onClick={(e) => handleDelete(e, p.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.footer}>
        총 {filtered.length}건
        {filtered.length !== properties.length && ` (전체 ${properties.length}건)`}
      </div>
    </div>
  );
};

export default PropertyListPage;
