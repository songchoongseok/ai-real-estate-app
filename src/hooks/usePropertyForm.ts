import { useReducer, useCallback } from 'react';
import dayjs from 'dayjs';
import type {
  PropertyFormData,
  PropertyType,
  TransactionType,
  Facility,
  PropertyStatus,
  RoomUnit,
} from '../types/property';
import { validatePropertyForm } from '../utils/validators';

function createInitialFormData(): PropertyFormData {
  return {
    propertyType: 'STORE_OFFICE' as PropertyType,
    propertySubType: '',
    isDirect: false,
    owner: { name: '', phone1: '', phone2: '' },
    receivedDate: dayjs().format('YYYY-MM-DD'),
    address: { region1: '', region2: '', region3: '', detail: '' },
    transactionType: 'SALE' as TransactionType,
    price: {},
    moveInDate: { immediate: false, negotiable: false },
    area: {},
    buildingStructure: '',
    floor: {},
    direction: undefined,
    completionDate: '',
    recommendedUse: '',
    buildingName: '',
    buildingType: '',
    rooms: [],
    facilities: [],
    memo: '',
    adPlatforms: [],
    status: 'NORMAL' as PropertyStatus,
  };
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_NESTED_FIELD'; parent: string; field: string; value: unknown }
  | { type: 'ADD_ROOM'; room: RoomUnit }
  | { type: 'REMOVE_ROOM'; index: number }
  | { type: 'TOGGLE_FACILITY'; facility: Facility }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'LOAD_DATA'; data: PropertyFormData }
  | { type: 'RESET' };

interface FormState {
  formData: PropertyFormData;
  errors: Record<string, string>;
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
        errors: { ...state.errors, [action.field]: '' },
      };

    case 'SET_NESTED_FIELD': {
      const parent = state.formData[action.parent as keyof PropertyFormData];
      if (typeof parent !== 'object' || parent === null || Array.isArray(parent)) {
        return state;
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.parent]: {
            ...(parent as Record<string, unknown>),
            [action.field]: action.value,
          },
        },
        errors: { ...state.errors, [`${action.parent}.${action.field}`]: '' },
      };
    }

    case 'ADD_ROOM':
      return {
        ...state,
        formData: {
          ...state.formData,
          rooms: [...state.formData.rooms, action.room],
        },
      };

    case 'REMOVE_ROOM':
      return {
        ...state,
        formData: {
          ...state.formData,
          rooms: state.formData.rooms.filter((_, i) => i !== action.index),
        },
      };

    case 'TOGGLE_FACILITY': {
      const facilities = state.formData.facilities.includes(action.facility)
        ? state.formData.facilities.filter((f) => f !== action.facility)
        : [...state.formData.facilities, action.facility];
      return {
        ...state,
        formData: { ...state.formData, facilities },
      };
    }

    case 'SET_ERRORS':
      return { ...state, errors: action.errors };

    case 'LOAD_DATA':
      return { formData: action.data, errors: {} };

    case 'RESET':
      return { formData: createInitialFormData(), errors: {} };

    default:
      return state;
  }
}

export function usePropertyForm(initialData?: PropertyFormData) {
  const [state, dispatch] = useReducer(formReducer, {
    formData: initialData || createInitialFormData(),
    errors: {},
  });

  const updateField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const updateNestedField = useCallback(
    (parent: string, field: string, value: unknown) => {
      dispatch({ type: 'SET_NESTED_FIELD', parent, field, value });
    },
    []
  );

  const addRoom = useCallback((room: RoomUnit) => {
    dispatch({ type: 'ADD_ROOM', room });
  }, []);

  const removeRoom = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_ROOM', index });
  }, []);

  const toggleFacility = useCallback((facility: Facility) => {
    dispatch({ type: 'TOGGLE_FACILITY', facility });
  }, []);

  const validate = useCallback((): boolean => {
    const errors = validatePropertyForm(state.formData);
    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  }, [state.formData]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const loadData = useCallback((data: PropertyFormData) => {
    dispatch({ type: 'LOAD_DATA', data });
  }, []);

  return {
    formData: state.formData,
    errors: state.errors,
    updateField,
    updateNestedField,
    addRoom,
    removeRoom,
    toggleFacility,
    validate,
    resetForm,
    loadData,
  };
}
