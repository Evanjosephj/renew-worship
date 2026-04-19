import React, { useState, useEffect, useCallback  } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError('');
      const res = await axios.post('https://renew-worship-backend.onrender.com/api/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      setToken(res.data.token);
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  const fetchData = useCallback(async () => { 
    try {
      setLoading(true);
      const res = await axios.get('https://renew-worship-backend.onrender.com/api/admin/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data);
    } catch {
      setError('Session expired. Please login again.');
      setToken('');
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setData([]);
  };

  const formatDate = (date) => new Date(date).toLocaleString('en-IN');

  // LOGIN PAGE
  if (!token) return (
    <div style={styles.bg}>
      <div style={styles.loginCard}>
        <div style={styles.cross}>✝</div>
        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.subtitle}>Renew Worship</p>
        <input style={styles.input} placeholder="Username"
          value={username} onChange={e => setUsername(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btn} onClick={handleLogin}>Login →</button>
      </div>
    </div>
  );

  // ADMIN DASHBOARD
  return (
    <div style={styles.bg}>
      <div style={styles.dashboard}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>✝ Renew Worship</h1>
            <p style={styles.subtitle}>Registration Dashboard</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.badge}>{data.length} Registered</div>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Refresh Button */}
        <button style={styles.refreshBtn} onClick={fetchData}>
          🔄 Refresh Data
        </button>

        {loading && <p style={styles.subtitle}>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['No', 'Name', 'Gender', 'Phone No', 'WhatsApp', 'Email', 'Preference', 'Message', 'Registered Date'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ ...styles.td, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    No registrations yet
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row._id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{row.name}</td>
                    <td style={styles.td}>{row.gender}</td>
                    <td style={styles.td}>{row.phone}</td>
                    <td style={styles.td}>
                      <span style={row.whatsapp ? styles.yes : styles.no}>
                        {row.whatsapp ? '✅ ' + row.whatsapp : '❌ No'}
                      </span>
                    </td>
                    <td style={styles.td}>{row.email || '—'}</td>
                    <td style={styles.td}>
                      <span style={styles.prefBadge}>{row.updatePreference}</span>
                    </td>
                    <td style={styles.td}>{row.message || '—'}</td>
                    <td style={styles.td}>{formatDate(row.registeredDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a2e 0%, #0d2137 50%, #0a1a3e 100%)',
    padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'center'
  },
  loginCard: {
    marginTop: 80, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
    border: '1.5px solid rgba(0,255,255,0.3)', borderRadius: 24,
    padding: '40px 32px', width: '100%', maxWidth: 400,
    display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
    boxShadow: '0 0 40px rgba(0,255,255,0.15)'
  },
  dashboard: { width: '100%', maxWidth: 1200 },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24, flexWrap: 'wrap', gap: 12
  },
  headerRight: { display: 'flex', gap: 12, alignItems: 'center' },
  cross: { fontSize: 40, color: '#00ffff', textShadow: '0 0 20px #00ffff' },
  title: {
    fontSize: 26, fontWeight: 800, color: '#fff',
    textShadow: '0 0 20px rgba(0,255,255,0.5)'
  },
  subtitle: { color: '#00ffff', fontSize: 14 },
  badge: {
    background: 'linear-gradient(135deg, #00ffff, #0066ff)',
    color: '#000', fontWeight: 700, padding: '6px 16px',
    borderRadius: 20, fontSize: 14
  },
  input: {
    width: '100%', padding: '14px 18px', borderRadius: 12,
    border: '1.5px solid rgba(0,255,255,0.4)',
    background: 'rgba(255,255,255,0.07)', color: '#fff',
    fontSize: 16, outline: 'none'
  },
  btn: {
    width: '100%', padding: '14px', borderRadius: 12, border: 'none',
    cursor: 'pointer', background: 'linear-gradient(135deg, #00ffff, #0066ff)',
    color: '#000', fontWeight: 700, fontSize: 16,
    boxShadow: '0 0 20px rgba(0,255,255,0.4)'
  },
  logoutBtn: {
    padding: '8px 20px', borderRadius: 10, border: '1.5px solid rgba(0,255,255,0.4)',
    cursor: 'pointer', background: 'transparent', color: '#00ffff', fontWeight: 600
  },
  refreshBtn: {
    marginBottom: 16, padding: '10px 24px', borderRadius: 10,
    border: '1.5px solid rgba(0,255,255,0.4)',
    cursor: 'pointer', background: 'rgba(0,255,255,0.1)',
    color: '#00ffff', fontWeight: 600, fontSize: 14
  },
  tableWrapper: {
    overflowX: 'auto', borderRadius: 16,
    border: '1.5px solid rgba(0,255,255,0.2)',
    boxShadow: '0 0 30px rgba(0,255,255,0.1)'
  },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 900 },
  th: {
    padding: '14px 16px', textAlign: 'left', color: '#00ffff',
    fontWeight: 700, fontSize: 13,
    background: 'rgba(0,255,255,0.1)',
    borderBottom: '1.5px solid rgba(0,255,255,0.2)'
  },
  td: {
    padding: '12px 16px', color: 'rgba(255,255,255,0.85)',
    fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  trEven: { background: 'rgba(255,255,255,0.02)' },
  trOdd: { background: 'rgba(0,255,255,0.03)' },
  yes: { color: '#00ffcc', fontWeight: 600 },
  no: { color: 'rgba(255,255,255,0.3)' },
  prefBadge: {
    background: 'rgba(0,255,255,0.15)', color: '#00ffff',
    padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600
  },
  error: { color: '#ff6b6b', fontSize: 13, textAlign: 'center' }
};