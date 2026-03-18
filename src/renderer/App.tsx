import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PropertyListPage from './pages/PropertyListPage';
import PropertyFormPage from './pages/PropertyFormPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<PropertyListPage />} />
          <Route path="/property/new" element={<PropertyFormPage />} />
          <Route path="/property/edit/:id" element={<PropertyFormPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
