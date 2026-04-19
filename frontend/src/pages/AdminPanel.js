import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PiCrossBold } from 'react-icons/pi';
import { RiSearchLine, RiLogoutBoxLine, RiRefreshLine, RiUserLine, RiMenLine, RiWomenLine, RiWhatsappLine, RiMailLine } from 'react-icons/ri';

export default function AdminPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
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

  const filtered = data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search)
  );

  const totalMale = data.filter(r => r.gender === 'Male').length;
  const totalFemale = data.filter(r => r.gender === 'Female').length;
  const totalWhatsapp = data.filter(r => r.updatePreference === 'whatsapp' || r.updatePreference === 'both').length;
  const totalEmail = data.filter(r => r.updatePreference === 'email' || r.updatePreference === 'both').length;

  // LOGIN PAGE
  if (!token) return (
    <div style={styles.bg}>
      <style>{`
        * { box-sizing: border-box; }
        input, button { font-family: inherit; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: #a855f7 !important; outline: none; }
        @media (max-width: 480px) {
          .login-title { font-size: 28px !important; }
        }
      `}</style>
      <div style={styles.loginCard}>
        <PiCrossBold size={48} color="#a855f7" />
        <h1 className="login-title" style={styles.loginTitle}>
          Admin <span style={styles.grad}>Login</span>
        </h1>
        <p style={styles.loginSub}>Renew Worship Dashboard</p>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btn} onClick={handleLogin}>Login</button>
      </div>
    </div>
  );

  // DASHBOARD
  return (
    <div style={styles.bg}>
      <style>{`
        * { box-sizing: border-box; }
        input, button { font-family: inherit; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: #a855f7 !important; outline: none; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(168,85,247,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 4px; }
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-title { font-size: 22px !important; }
          .top-bar { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={styles.dashboard}>

        {/* Header */}
        <div className="top-bar" style={styles.topBar}>
          <div style={styles.topLeft}>
            <PiCrossBold size={28} color="#a855f7" />
            <div>
              <h1 className="dash-title" style={styles.dashTitle}>
                Renew <span style={styles.grad}>Worship</span>
              </h1>
              <p style={styles.dashSub}>Registration Dashboard</p>
            </div>
          </div>
          <div style={styles.topRight}>
            <button style={styles.refreshBtn} onClick={fetchData}>
              <RiRefreshLine size={18} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              <RiLogoutBoxLine size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid" style={styles.statGrid}>
          <div style={styles.statCard}>
            <RiUserLine size={24} color="#a855f7" />
            <div style={styles.statNum}>{data.length}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          <div style={styles.statCard}>
            <RiMenLine size={24} color="#60a5fa" />
            <div style={styles.statNum}>{totalMale}</div>
            <div style={styles.statLabel}>Male</div>
          </div>
          <div style={styles.statCard}>
            <RiWomenLine size={24} color="#ec4899" />
            <div style={styles.statNum}>{totalFemale}</div>
            <div style={styles.statLabel}>Female</div>
          </div>
          <div style={styles.statCard}>
            <RiWhatsappLine size={24} color="#25D366" />
            <div style={styles.statNum}>{totalWhatsapp}</div>
            <div style={styles.statLabel}>WhatsApp</div>
          </div>
          <div style={styles.statCard}>
            <RiMailLine size={24} color="#f59e0b" />
            <div style={styles.statNum}>{totalEmail}</div>
            <div style={styles.statLabel}>Email</div>
          </div>
        </div>

        {/* Search */}
        <div style={styles.searchWrap}>
          <RiSearchLine size={18} color="#a855f7" style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* Results count */}
        <p style={styles.resultCount}>
          Showing <span style={{ color: '#a855f7', fontWeight: 700 }}>{filtered.length}</span> of {data.length} registrations
        </p>

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ ...styles.td, textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px' }}>
                    No registrations found
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row._id}
                    style={{ background: i % 2 === 0 ? 'rgba(168,85,247,0.03)' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'rgba(168,85,247,0.03)' : 'transparent'}
                  >
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{row.name}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: row.gender === 'Male' ? 'rgba(96,165,250,0.15)' : 'rgba(236,72,153,0.15)',
                        color: row.gender === 'Male' ? '#60a5fa' : '#ec4899',
                        border: `1px solid ${row.gender === 'Male' ? 'rgba(96,165,250,0.3)' : 'rgba(236,72,153,0.3)'}`,
                      }}>
                        {row.gender}
                      </span>
                    </td>
                    <td style={styles.td}>{row.phone}</td>
                    <td style={styles.td}>
                      {row.whatsapp
                        ? <span style={{ color: '#25D366', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <RiWhatsappLine size={14} /> {row.whatsapp}
                          </span>
                        : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                      }
                    </td>
                    <td style={styles.td}>
                      {row.email
                        ? <span style={{ color: '#f59e0b', fontSize: 12 }}>{row.email}</span>
                        : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                      }
                    </td>
                    <td style={styles.td}>
                      <span style={styles.prefBadge}>{row.updatePreference}</span>
                    </td>
                    <td style={{ ...styles.td, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.message || <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                    </td>
                    <td style={{ ...styles.td, whiteSpace: 'nowrap', fontSize: 12 }}>{formatDate(row.registeredDate)}</td>
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
    background: '#0f0f1a',
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  loginCard: {
    marginTop: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    width: '100%',
    maxWidth: 420,
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 800,
    color: '#fff',
    margin: 0,
  },
  loginSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    margin: 0,
  },
  grad: {
    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  input: {
    width: '100%',
    padding: '15px 18px',
    borderRadius: 12,
    border: '1px solid rgba(168,85,247,0.3)',
    background: 'rgba(168,85,247,0.08)',
    color: '#fff',
    fontSize: 16,
    outline: 'none',
  },
  btn: {
    width: '100%',
    padding: '15px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
  },
  error: {
    color: '#f87171',
    fontSize: 13,
    margin: 0,
  },
  dashboard: {
    width: '100%',
    maxWidth: 1300,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    gap: 16,
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  dashTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    margin: 0,
  },
  dashSub: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    margin: 0,
  },
  topRight: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  refreshBtn: {
    padding: '10px 18px',
    borderRadius: 10,
    border: '1px solid rgba(168,85,247,0.3)',
    cursor: 'pointer',
    background: 'rgba(168,85,247,0.08)',
    color: '#a855f7',
    fontWeight: 600,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  logoutBtn: {
    padding: '10px 18px',
    borderRadius: 10,
    border: '1px solid rgba(236,72,153,0.3)',
    cursor: 'pointer',
    background: 'rgba(236,72,153,0.08)',
    color: '#ec4899',
    fontWeight: 600,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 14,
    marginBottom: 24,
  },
  statCard: {
    padding: '20px 16px',
    borderRadius: 14,
    border: '1px solid rgba(168,85,247,0.2)',
    background: 'rgba(168,85,247,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  statNum: {
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 500,
  },
  searchWrap: {
    position: 'relative',
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '12px 18px 12px 42px',
    borderRadius: 10,
    border: '1px solid rgba(168,85,247,0.3)',
    background: 'rgba(168,85,247,0.08)',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  },
  resultCount: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    marginBottom: 14,
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: 14,
    border: '1px solid rgba(168,85,247,0.15)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 900,
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    background: 'rgba(168,85,247,0.08)',
    borderBottom: '1px solid rgba(168,85,247,0.15)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  prefBadge: {
    background: 'rgba(168,85,247,0.15)',
    color: '#a855f7',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid rgba(168,85,247,0.25)',
  },
};