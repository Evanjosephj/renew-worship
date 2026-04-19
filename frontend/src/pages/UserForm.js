import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const glitter = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 6 + 2,
  delay: Math.random() * 3,
}));

export default function UserForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', gender: '', phone: '', updatePreference: '',
    whatsapp: '', email: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const next = () => { setError(''); setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  const validate = () => {
    if (step === 1 && !form.name.trim()) return 'Please enter your name';
    if (step === 2 && !form.gender) return 'Please select your gender';
    if (step === 3 && !form.phone.trim()) return 'Please enter your phone number';
    if (step === 4 && !form.updatePreference) return 'Please select an option';
    if (step === 5) {
      if ((form.updatePreference === 'whatsapp' || form.updatePreference === 'both') && !form.whatsapp.trim())
        return 'Please enter your WhatsApp number';
      if ((form.updatePreference === 'email' || form.updatePreference === 'both') && !form.email.trim())
        return 'Please enter your email';
      if ((form.updatePreference === 'email' || form.updatePreference === 'both') && !form.email.endsWith('@gmail.com'))
        return 'Email must be a @gmail.com address';
    }
    return '';
  };

  const handleNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    next();
  };

  const handleSubmit = async () => {
    try {
await axios.post('https://renew-worship-backend.onrender.com/api/registration/submit', form);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  const steps = [0, 1, 2, 3, 4, 5, 6, 7];
  const totalSteps = 6;

  return (
    <div style={styles.bg}>
      {/* Glitters */}
      {glitter.map(g => (
        <motion.div key={g.id} style={{
          position: 'fixed', left: `${g.left}%`, top: `${g.top}%`,
          width: g.size, height: g.size, borderRadius: '50%',
          background: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
          pointerEvents: 'none', zIndex: 0
        }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2 + g.delay, repeat: Infinity, delay: g.delay }}
        />
      ))}

      <div style={styles.card}>
        {/* Progress bar */}
        {!submitted && step > 0 && (
          <div style={styles.progressBar}>
            <motion.div style={{ ...styles.progressFill, width: `${(step / totalSteps) * 100}%` }}
              animate={{ width: `${(step / totalSteps) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* Step 0 - Welcome */}
          {step === 0 && (
            <motion.div key="welcome" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.cross}>✝</div>
              <h1 style={styles.title}>Renew Worship</h1>
              <p style={styles.subtitle}>🙏 Welcome! Please register for the Prayer Meeting</p>
              <p style={styles.desc}>We are glad you are joining us. Click below to begin your registration.</p>
              <button style={styles.btn} onClick={next}>Begin Registration ✨</button>
            </motion.div>
          )}

          {/* Step 1 - Name */}
          {step === 1 && (
            <motion.div key="name" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.stepIcon}>👤</div>
              <h2 style={styles.label}>What is your name?</h2>
              <input style={styles.input} placeholder="Enter your full name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button style={styles.backBtn} onClick={back}>← Back</button>
                <button style={styles.btn} onClick={handleNext}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* Step 2 - Gender */}
          {step === 2 && (
            <motion.div key="gender" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.stepIcon}>⚧</div>
              <h2 style={styles.label}>Select your gender</h2>
              <div style={styles.optionRow}>
                {['Male', 'Female'].map(g => (
                  <button key={g} style={form.gender === g ? styles.optionActive : styles.option}
                    onClick={() => setForm({ ...form, gender: g })}>{g}</button>
                ))}
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button style={styles.backBtn} onClick={back}>← Back</button>
                <button style={styles.btn} onClick={handleNext}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* Step 3 - Phone */}
          {step === 3 && (
            <motion.div key="phone" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.stepIcon}>📱</div>
              <h2 style={styles.label}>Your phone number?</h2>
              <input style={styles.input} placeholder="Enter phone number" type="tel"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button style={styles.backBtn} onClick={back}>← Back</button>
                <button style={styles.btn} onClick={handleNext}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* Step 4 - Update Preference */}
          {step === 4 && (
            <motion.div key="pref" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.stepIcon}>📣</div>
              <h2 style={styles.label}>How do you want updates?</h2>
              <div style={styles.optionCol}>
                {[{ val: 'whatsapp', label: '💬 WhatsApp' }, { val: 'email', label: '📧 Email' }, { val: 'both', label: '✅ Both' }].map(o => (
                  <button key={o.val} style={form.updatePreference === o.val ? styles.optionActive : styles.option}
                    onClick={() => setForm({ ...form, updatePreference: o.val, whatsapp: '', email: '' })}>{o.label}</button>
                ))}
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button style={styles.backBtn} onClick={back}>← Back</button>
                <button style={styles.btn} onClick={handleNext}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* Step 5 - WhatsApp / Email */}
          {step === 5 && (
            <motion.div key="contact" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.stepIcon}>📋</div>
              <h2 style={styles.label}>Enter your contact details</h2>
              {(form.updatePreference === 'whatsapp' || form.updatePreference === 'both') && (
                <input style={styles.input} placeholder="WhatsApp number" type="tel"
                  value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
              )}
              {(form.updatePreference === 'email' || form.updatePreference === 'both') && (
                <input style={{ ...styles.input, marginTop: 12 }} placeholder="Email (@gmail.com)" type="email"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              )}
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button style={styles.backBtn} onClick={back}>← Back</button>
                <button style={styles.btn} onClick={handleNext}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* Step 6 - Message */}
          {step === 6 && (
            <motion.div key="message" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.stepIcon}>💬</div>
              <h2 style={styles.label}>Do you want to convey anything?</h2>
              <textarea style={styles.textarea} placeholder="Your message (optional)"
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button style={styles.backBtn} onClick={back}>← Back</button>
                <button style={styles.btn} onClick={handleNext}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* Step 7 - Submit */}
          {step === 7 && !submitted && (
            <motion.div key="submit" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <div style={styles.stepIcon}>🙌</div>
              <h2 style={styles.label}>Almost done!</h2>
              <p style={styles.desc}>Thank you for your cooperation. Click below to complete your registration.</p>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button style={styles.backBtn} onClick={back}>← Back</button>
                <button style={styles.btn} onClick={handleSubmit}>Submit 🎉</button>
              </div>
            </motion.div>
          )}

          {/* Thank You */}
          {submitted && (
            <motion.div key="thanks" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <div style={{ fontSize: 64 }}>🎊</div>
              </motion.div>
              <h2 style={{ ...styles.title, fontSize: 24 }}>Thank You!</h2>
              <p style={styles.desc}>Your details have been saved successfully. God bless you! 🙏</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a2e 0%, #0d2137 50%, #0a1a3e 100%)',
    position: 'relative', overflow: 'hidden', padding: 16
  },
  card: {
    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
    border: '1.5px solid rgba(0,255,255,0.3)', borderRadius: 24,
    padding: '40px 32px', width: '100%', maxWidth: 440,
    boxShadow: '0 0 40px rgba(0,255,255,0.15), 0 0 80px rgba(0,100,255,0.1)',
    position: 'relative', zIndex: 1, overflow: 'hidden'
  },
  progressBar: {
    height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4,
    marginBottom: 28, overflow: 'hidden'
  },
  progressFill: {
    height: '100%', background: 'linear-gradient(90deg, #00ffff, #0080ff)',
    borderRadius: 4, transition: 'width 0.4s ease'
  },
  stepBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  cross: { fontSize: 48, color: '#00ffff', textShadow: '0 0 20px #00ffff' },
  stepIcon: { fontSize: 48 },
  title: {
    fontSize: 28, fontWeight: 800, color: '#fff',
    textAlign: 'center', textShadow: '0 0 20px rgba(0,255,255,0.5)'
  },
  subtitle: { color: '#00ffff', fontSize: 16, textAlign: 'center' },
  desc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', lineHeight: 1.6 },
  label: { color: '#fff', fontSize: 20, fontWeight: 700, textAlign: 'center' },
  input: {
    width: '100%', padding: '14px 18px', borderRadius: 12, border: '1.5px solid rgba(0,255,255,0.4)',
    background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 16, outline: 'none',
    boxShadow: '0 0 10px rgba(0,255,255,0.1)', transition: 'all 0.3s'
  },
  textarea: {
    width: '100%', padding: '14px 18px', borderRadius: 12, border: '1.5px solid rgba(0,255,255,0.4)',
    background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 16, outline: 'none',
    minHeight: 100, resize: 'vertical', boxShadow: '0 0 10px rgba(0,255,255,0.1)'
  },
  btn: {
    padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #00ffff, #0066ff)',
    color: '#000', fontWeight: 700, fontSize: 16,
    boxShadow: '0 0 20px rgba(0,255,255,0.4)', transition: 'all 0.3s'
  },
  backBtn: {
    padding: '12px 28px', borderRadius: 12, border: '1.5px solid rgba(0,255,255,0.4)',
    cursor: 'pointer', background: 'transparent', color: '#00ffff', fontWeight: 600, fontSize: 16
  },
  optionRow: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  optionCol: { display: 'flex', flexDirection: 'column', gap: 12, width: '100%' },
  option: {
    padding: '12px 24px', borderRadius: 12, border: '1.5px solid rgba(0,255,255,0.3)',
    background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 16, cursor: 'pointer', width: '100%'
  },
  optionActive: {
    padding: '12px 24px', borderRadius: 12, border: '1.5px solid #00ffff',
    background: 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(0,100,255,0.2))',
    color: '#00ffff', fontSize: 16, cursor: 'pointer', fontWeight: 700, width: '100%',
    boxShadow: '0 0 15px rgba(0,255,255,0.3)'
  },
  row: { display: 'flex', gap: 12, justifyContent: 'center', width: '100%', marginTop: 8 },
  error: { color: '#ff6b6b', fontSize: 13, textAlign: 'center' }
};