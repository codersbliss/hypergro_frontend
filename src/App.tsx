import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FormBuilder from './pages/FormBuilder';
import FormView from './pages/FormView';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/builder" element={<FormBuilder />} />
        <Route path="/builder/:formId" element={<FormBuilder />} />
        <Route path="/view/:formId" element={<FormView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;