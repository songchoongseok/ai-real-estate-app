export type PropertyType = 'STORE_OFFICE' | 'APARTMENT' | 'OFFICETEL' | 'VILLA' | 'HOUSE' | 'ONE_ROOM';
export type TransactionType = 'SALE' | 'JEONSE' | 'MONTHLY' | 'EXCHANGE';
export type Direction = 'E' | 'W' | 'S' | 'N' | 'SE' | 'SW' | 'NE' | 'NW';
export type PropertyStatus = 'URGENT' | 'NORMAL' | 'FLEXIBLE' | 'UNDECIDED' | 'FAILED';
export type AdPlatform = 'KYOCHARO' | 'NAVER' | 'ZIGBANG' | 'DABANG' | 'ETC';
export type Facility =
  | 'WALL_AC'
  | 'STAND_AC'
  | 'CEILING_AC'
  | 'WASHING_MACHINE'
  | 'REFRIGERATOR'
  | 'GAS_RANGE'
  | 'INDUCTION'
  | 'MICROWAVE'
  | 'NONE';

export interface OwnerContact {
  name: string;
  phone1: string;
  phone2?: string;
}

export interface Address {
  region1: string;
  region2: string;
  region3: string;
  detail: string;
}

export interface AreaInfo {
  landArea?: number;
  supplyArea?: number;
  exclusiveArea?: number;
}

export interface PriceInfo {
  salePrice?: number;
  deposit?: number;
  monthlyRent?: number;
  maintenanceFee?: number;
}

export interface FloorInfo {
  currentFloor?: number;
  totalFloors?: number;
}

export interface RoomUnit {
  floor: number;
  roomNumber: string;
  area?: number;
  structure?: string;
}

export interface MoveInDate {
  date?: string;
  immediate: boolean;
  negotiable: boolean;
}

export interface Property {
  id: string;
  propertyType: PropertyType;
  propertySubType?: string;
  isDirect: boolean;
  owner: OwnerContact;
  receivedDate: string;
  address: Address;
  transactionType: TransactionType;
  price: PriceInfo;
  moveInDate: MoveInDate;
  area: AreaInfo;
  buildingStructure?: string;
  floor: FloorInfo;
  direction?: Direction;
  completionDate?: string;
  recommendedUse?: string;
  buildingName?: string;
  buildingType?: string;
  rooms: RoomUnit[];
  facilities: Facility[];
  memo?: string;
  adPlatforms: AdPlatform[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export type PropertyFormData = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
