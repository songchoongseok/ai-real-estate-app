import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from '../components/property/PropertyForm';
import { propertyStorage } from '../services/property-storage';
import type { Property } from '../types/property';

const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [existingProperty, setExistingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(!!id);

  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      propertyStorage.getById(id).then((property) => {
        if (property) {
          setExistingProperty(property);
        } else {
          alert('매물을 찾을 수 없습니다.');
          navigate('/');
        }
        setLoading(false);
      });
    }
  }, [id, navigate]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#718096' }}>로딩 중...</div>;
  }

  return (
    <PropertyForm
      mode={isEditMode ? 'edit' : 'create'}
      initialProperty={existingProperty ?? undefined}
      onSaveComplete={() => navigate('/')}
      onCancel={() => navigate('/')}
    />
  );
};

export default PropertyFormPage;
