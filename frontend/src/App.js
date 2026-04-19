import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './pages/UserForm';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Anandhkumarwc/user" element={<UserForm />} />
        <Route path="/Anandhkumarwc/admin" element={<AdminPanel />} />
        <Route path="/" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;