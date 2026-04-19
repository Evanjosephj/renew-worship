import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PiCrossBold } from 'react-icons/pi';
import { RiSearchLine, RiLogoutBoxLine, RiRefreshLine, RiUserLine, RiMenLine, RiWomenLine, RiWhatsappLine, RiMailLine, RiDownload2Line } from 'react-icons/ri';

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

  // --- CSV DOWNLOAD FEATURE ---
  const downloadCSV = () => {
    const headers = ['No', 'Name', 'Gender', 'Phone No', 'WhatsApp', 'Email', 'Preference', 'Message', 'Registered Date'];
    const rows = filtered.map((row, i) => [
      i + 1,
      row.name,
      row.gender,
      row.phone,
      row.whatsapp || '',
      row.email || '',
      row.updatePreference,
      (row.message || '').replace(/,/g, ';'),
      formatDate(row.registeredDate)
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `renew-worship-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // LOGIN PAGE
  if (!token) return (
    <div style={s.bg}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, button { font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(168,85,247,0.7) !important; outline: none; box-shadow: 0 0 0 3px rgba(168,85,247,0.12); }
        .login-wrap { animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <div className="login-wrap" style={s.loginWrap}>
        <div style={s.loginLogo}>
          <PiCrossBold size={22} color="#a855f7" />
          <span style={s.loginBrand}>Renew <span style={s.grad}>Worship</span></span>
        </div>
        <h2 style={s.loginHeading}>Welcome back</h2>
        <p style={s.loginSub}>Sign in to the admin dashboard</p>
        <div style={s.fieldGroup}>
          <label style={s.label}>Username</label>
          <input style={s.input} placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Password</label>
          <input style={s.input} placeholder="Enter password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        {error && <p style={s.error}>{error}</p>}
        <button style={s.loginBtn} onClick={handleLogin}>Sign In →</button>
      </div>
    </div>
  );

  // DASHBOARD
  return (
    <div style={s.bg}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, button { font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(168,85,247,0.6) !important; outline: none; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.25); border-radius: 4px; }
        .stat-pill:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
        tr:hover td { background: rgba(168,85,247,0.06) !important; }
        .dl-btn:hover { background: rgba(168,85,247,0.2) !important; }
        .ref-btn:hover { background: rgba(168,85,247,0.15) !important; }
        .out-btn:hover { background: rgba(236,72,153,0.15) !important; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .dash-body { animation: fadeIn 0.4s ease; }
      `}</style>

      <div className="dash-body" style={s.dash}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.crossWrap}><PiCrossBold size={16} color="#a855f7" /></div>
            <div>
              <div style={s.brandName}>Renew <span style={s.grad}>Worship</span></div>
              <div style={s.brandSub}>Registration Dashboard</div>
            </div>
          </div>
          <div style={s.headerRight}>
            <button className="ref-btn" style={s.iconBtn} onClick={fetchData} title="Refresh">
              <RiRefreshLine size={16} color="#a855f7" />
              <span style={s.btnLabel}>{loading ? '...' : 'Refresh'}</span>
            </button>
            <button className="out-btn" style={{ ...s.iconBtn, borderColor: 'rgba(236,72,153,0.3)' }} onClick={handleLogout} title="Logout">
              <RiLogoutBoxLine size={16} color="#ec4899" />
              <span style={{ ...s.btnLabel, color: '#ec4899' }}>Logout</span>
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={s.statsRow}>
          {[
            { icon: <RiUserLine size={14} color="#a855f7" />, val: data.length, label: 'Total', accent: '#a855f7' },
            { icon: <RiMenLine size={14} color="#60a5fa" />, val: totalMale, label: 'Male', accent: '#60a5fa' },
            { icon: <RiWomenLine size={14} color="#ec4899" />, val: totalFemale, label: 'Female', accent: '#ec4899' },
            { icon: <RiWhatsappLine size={14} color="#25D366" />, val: totalWhatsapp, label: 'WhatsApp', accent: '#25D366' },
            { icon: <RiMailLine size={14} color="#f59e0b" />, val: totalEmail, label: 'Email', accent: '#f59e0b' },
          ].map(({ icon, val, label, accent }) => (
            <div className="stat-pill" key={label} style={{ ...s.statPill, borderColor: `${accent}25` }}>
              <div style={{ ...s.statIcon, background: `${accent}18` }}>{icon}</div>
              <div style={s.statVal}>{val}</div>
              <div style={s.statLbl}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Search + Download Bar ── */}
        <div style={s.toolbar}>
          <div style={s.searchBox}>
            <RiSearchLine size={14} color="rgba(168,85,247,0.6)" style={{ flexShrink: 0 }} />
            <input
              style={s.searchInput}
              placeholder="Search name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="dl-btn" style={s.dlBtn} onClick={downloadCSV} title="Download CSV">
            <RiDownload2Line size={15} color="#a855f7" />
            <span style={s.btnLabel}>Export CSV</span>
          </button>
        </div>

        {error && <p style={s.error}>{error}</p>}

        <p style={s.countLine}>
          Showing <strong style={{ color: '#a855f7' }}>{filtered.length}</strong> of {data.length} registrations
        </p>

        {/* ── Table ── */}
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['#', 'Name', 'Gender', 'Phone', 'WhatsApp', 'Email', 'Pref', 'Message', 'Date'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ ...s.td, textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '36px' }}>
                    No registrations found
                  </td>
                </tr>
              ) : filtered.map((row, i) => (
                <tr key={row._id}>
                  <td style={{ ...s.td, color: 'rgba(255,255,255,0.3)', width: 32 }}>{i + 1}</td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{row.name}</td>
                  <td style={s.td}>
                    <span style={{
                      ...s.badge,
                      background: row.gender === 'Male' ? 'rgba(96,165,250,0.12)' : 'rgba(236,72,153,0.12)',
                      color: row.gender === 'Male' ? '#60a5fa' : '#ec4899',
                      border: `1px solid ${row.gender === 'Male' ? 'rgba(96,165,250,0.25)' : 'rgba(236,72,153,0.25)'}`,
                    }}>
                      {row.gender}
                    </span>
                  </td>
                  <td style={{ ...s.td, whiteSpace: 'nowrap' }}>{row.phone}</td>
                  <td style={s.td}>
                    {row.whatsapp
                      ? <span style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
                          <RiWhatsappLine size={12} />{row.whatsapp}
                        </span>
                      : <span style={{ color: 'rgba(255,255,255,0.15)' }}>—</span>}
                  </td>
                  <td style={s.td}>
                    {row.email
                      ? <span style={{ color: '#f59e0b', fontSize: 11 }}>{row.email}</span>
                      : <span style={{ color: 'rgba(255,255,255,0.15)' }}>—</span>}
                  </td>
                  <td style={s.td}>
                    <span style={s.prefBadge}>{row.updatePreference}</span>
                  </td>
                  <td style={{ ...s.td, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.message || <span style={{ color: 'rgba(255,255,255,0.15)' }}>—</span>}
                  </td>
                  <td style={{ ...s.td, whiteSpace: 'nowrap', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {formatDate(row.registeredDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const s = {
  bg: {
    minHeight: '100vh',
    background: '#0c0c18',
    backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(168,85,247,0.08) 0%, transparent 70%)',
    padding: '16px',
    fontFamily: "'DM Sans', sans-serif",
  },

  // LOGIN
  loginWrap: {
    maxWidth: 380,
    margin: '48px auto 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  loginLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  loginBrand: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
  },
  loginHeading: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    margin: 0,
  },
  loginSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    margin: '0 0 6px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(168,85,247,0.25)',
    background: 'rgba(168,85,247,0.07)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  loginBtn: {
    padding: '13px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // DASHBOARD
  dash: {
    maxWidth: 1280,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  crossWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 17,
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.2,
  },
  brandSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.3,
  },
  headerRight: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '7px 12px',
    borderRadius: 8,
    border: '1px solid rgba(168,85,247,0.25)',
    background: 'rgba(168,85,247,0.07)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#a855f7',
  },

  // STATS — compact horizontal pills
  statsRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statPill: {
    flex: '1 1 0',
    minWidth: 64,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '10px 8px',
    borderRadius: 10,
    border: '1px solid rgba(168,85,247,0.15)',
    background: 'rgba(255,255,255,0.03)',
    cursor: 'default',
    transition: 'transform 0.2s ease',
  },
  statIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    fontFamily: "'Syne', sans-serif",
    lineHeight: 1,
  },
  statLbl: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // TOOLBAR
  toolbar: {
    display: 'flex',
    gap: 8,
    marginBottom: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 180,
    padding: '9px 12px',
    borderRadius: 9,
    border: '1px solid rgba(168,85,247,0.22)',
    background: 'rgba(168,85,247,0.06)',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 13,
    padding: 0,
  },
  dlBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '9px 14px',
    borderRadius: 9,
    border: '1px solid rgba(168,85,247,0.3)',
    background: 'rgba(168,85,247,0.08)',
    cursor: 'pointer',
    transition: 'background 0.2s',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  countLine: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 10,
  },
  error: {
    color: '#f87171',
    fontSize: 12,
    margin: '0 0 8px',
  },

  // TABLE
  tableWrap: {
    overflowX: 'auto',
    borderRadius: 12,
    border: '1px solid rgba(168,85,247,0.12)',
    background: 'rgba(255,255,255,0.02)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 820,
  },
  th: {
    padding: '11px 14px',
    textAlign: 'left',
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    background: 'rgba(168,85,247,0.06)',
    borderBottom: '1px solid rgba(168,85,247,0.1)',
    whiteSpace: 'nowrap',
    fontFamily: "'DM Sans', sans-serif",
  },
  td: {
    padding: '11px 14px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontFamily: "'DM Sans', sans-serif",
  },
  badge: {
    padding: '3px 8px',
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  prefBadge: {
    background: 'rgba(168,85,247,0.12)',
    color: '#a855f7',
    padding: '3px 8px',
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 600,
    border: '1px solid rgba(168,85,247,0.2)',
    whiteSpace: 'nowrap',
  },
  grad: {
    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};