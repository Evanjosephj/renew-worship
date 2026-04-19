import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './pages/UserForm';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;