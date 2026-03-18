import type {
  PropertyType,
  TransactionType,
  Direction,
  PropertyStatus,
  AdPlatform,
  Facility,
} from '../types/property';

export interface LabelValue<T extends string> {
  label: string;
  value: T;
}

export const PROPERTY_TYPE_OPTIONS: LabelValue<PropertyType>[] = [
  { label: '상가/사무실', value: 'STORE_OFFICE' },
  { label: '아파트', value: 'APARTMENT' },
  { label: '오피스텔', value: 'OFFICETEL' },
  { label: '빌라/연립', value: 'VILLA' },
  { label: '주택', value: 'HOUSE' },
  { label: '원룸', value: 'ONE_ROOM' },
];

export const TRANSACTION_TYPE_OPTIONS: LabelValue<TransactionType>[] = [
  { label: '매매', value: 'SALE' },
  { label: '전세', value: 'JEONSE' },
  { label: '월세', value: 'MONTHLY' },
  { label: '교환', value: 'EXCHANGE' },
];

export const DIRECTION_OPTIONS: LabelValue<Direction>[] = [
  { label: '동', value: 'E' },
  { label: '서', value: 'W' },
  { label: '남', value: 'S' },
  { label: '북', value: 'N' },
  { label: '남동', value: 'SE' },
  { label: '남서', value: 'SW' },
  { label: '북동', value: 'NE' },
  { label: '북서', value: 'NW' },
];

export const STATUS_OPTIONS: LabelValue<PropertyStatus>[] = [
  { label: '급매', value: 'URGENT' },
  { label: '일반', value: 'NORMAL' },
  { label: '여유', value: 'FLEXIBLE' },
  { label: '미정', value: 'UNDECIDED' },
  { label: '유찰', value: 'FAILED' },
];

export const AD_PLATFORM_OPTIONS: LabelValue<AdPlatform>[] = [
  { label: '교차로', value: 'KYOCHARO' },
  { label: '네이버', value: 'NAVER' },
  { label: '직방', value: 'ZIGBANG' },
  { label: '다방', value: 'DABANG' },
  { label: '기타', value: 'ETC' },
];

export const FACILITY_OPTIONS: LabelValue<Facility>[] = [
  { label: '벽걸이 에어컨', value: 'WALL_AC' },
  { label: '스탠드 에어컨', value: 'STAND_AC' },
  { label: '천장형 에어컨', value: 'CEILING_AC' },
  { label: '세탁기', value: 'WASHING_MACHINE' },
  { label: '냉장고', value: 'REFRIGERATOR' },
  { label: '가스레인지', value: 'GAS_RANGE' },
  { label: '인덕션', value: 'INDUCTION' },
  { label: '전자레인지', value: 'MICROWAVE' },
  { label: '없음', value: 'NONE' },
];

export const PROPERTY_SUB_TYPE_OPTIONS: Record<PropertyType, string[]> = {
  STORE_OFFICE: ['상가', '사무실', '점포', '공장', '창고', '토지'],
  APARTMENT: ['아파트', '주상복합'],
  OFFICETEL: ['오피스텔'],
  VILLA: ['빌라', '연립', '다세대'],
  HOUSE: ['단독주택', '다가구', '전원주택', '타운하우스'],
  ONE_ROOM: ['원룸', '투룸', '쓰리룸'],
};

export const BUILDING_STRUCTURE_OPTIONS: string[] = [
  '철근콘크리트',
  '철골조',
  '조적조',
  '목조',
  '경량철골조',
  '기타',
];

export const BUILDING_TYPE_OPTIONS: string[] = [
  '단독건물',
  '상가건물',
  '아파트',
  '오피스텔',
  '빌라/연립',
  '주상복합',
  '기타',
];
