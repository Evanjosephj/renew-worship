import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PiCrossBold } from 'react-icons/pi';
import { RiWhatsappLine, RiMailLine, RiCheckboxCircleLine, RiLoader4Line } from 'react-icons/ri';

export default function UserForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', gender: '', phone: '', updatePreference: '',
    whatsapp: '', email: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // NEW

  const next = () => { setError(''); setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  const validate = () => {
    if (step === 1 && !form.name.trim()) return 'Please enter your name';
    if (step === 1 && /[0-9]/.test(form.name)) return 'Name should contain letters only';
    if (step === 2 && !form.gender) return 'Please select your gender';
    if (step === 3 && !form.phone.trim()) return 'Please enter your phone number';
    if (step === 3 && form.phone.length < 10) return 'Please enter a valid 10 digit phone number';
    if (step === 4 && !form.updatePreference) return 'Please select an option';
    if (step === 5) {
      if ((form.updatePreference === 'whatsapp' || form.updatePreference === 'both') && !form.whatsapp.trim())
        return 'Please enter your WhatsApp number';
      if ((form.updatePreference === 'whatsapp' || form.updatePreference === 'both') && form.whatsapp.length < 10)
        return 'Please enter a valid 10 digit WhatsApp number';
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
    if (loading) return; // prevent multiple clicks
    try {
      setLoading(true);
      setError('');
      await axios.post('https://renew-worship-backend.onrender.com/api/registration/submit', form);
      setSubmitted(true);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 }
  };

  const totalSteps = 6;

  return (
    <div style={styles.bg}>
      <style>{`
        * { box-sizing: border-box; }
        input, textarea, button { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
        input:focus, textarea:focus { border-color: #a855f7 !important; outline: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; display: inline-flex; }
        @media (max-width: 480px) {
          .form-bigtitle { font-size: 32px !important; }
          .form-title { font-size: 26px !important; }
          .form-btn { font-size: 15px !important; padding: 13px 20px !important; }
          .form-option { font-size: 15px !important; padding: 12px 14px !important; }
          .form-input { font-size: 16px !important; }
        }
        @media (min-width: 768px) {
          .form-bigtitle { font-size: 52px !important; }
          .form-title { font-size: 38px !important; }
        }
      `}</style>

      <div style={styles.inner}>
        <AnimatePresence mode="wait">

          {/* Step 0 - Welcome */}
          {step === 0 && (
            <motion.div key="welcome" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <PiCrossBold size={52} color="#a855f7" />
              <h1 className="form-bigtitle" style={styles.bigTitle}>
                Renew <span style={styles.grad}>Worship</span>
              </h1>
              <p style={styles.subtitle}>Welcome! Please register for the Prayer Meeting</p>
              <p style={styles.desc}>We are glad you are joining us. Click below to begin your registration.</p>
              <button className="form-btn" style={styles.btn} onClick={next}>
                Begin Registration
              </button>
            </motion.div>
          )}

          {/* Step 1 - Name */}
          {step === 1 && (
            <motion.div key="name" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <h2 className="form-title" style={styles.title}>
                What is your <span style={styles.grad}>name?</span>
              </h2>
              <input
                className="form-input"
                style={styles.input}
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => {
                  const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setForm({ ...form, name: val });
                }}
              />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button className="form-btn" style={styles.backBtn} onClick={back}>Back</button>
                <button className="form-btn" style={styles.btn} onClick={handleNext}>Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 2 - Gender */}
          {step === 2 && (
            <motion.div key="gender" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <h2 className="form-title" style={styles.title}>
                Select your <span style={styles.grad}>gender</span>
              </h2>
              <div style={styles.optionRow}>
                <button
                  className="form-option"
                  style={form.gender === 'Male' ? styles.optionActive : styles.option}
                  onClick={() => setForm({ ...form, gender: 'Male' })}>
                  Male
                </button>
                <button
                  className="form-option"
                  style={form.gender === 'Female' ? styles.optionActive : styles.option}
                  onClick={() => setForm({ ...form, gender: 'Female' })}>
                  Female
                </button>
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button className="form-btn" style={styles.backBtn} onClick={back}>Back</button>
                <button className="form-btn" style={styles.btn} onClick={handleNext}>Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 3 - Phone */}
          {step === 3 && (
            <motion.div key="phone" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <h2 className="form-title" style={styles.title}>
                Your <span style={styles.grad}>phone number?</span>
              </h2>
              <input
                className="form-input"
                style={styles.input}
                placeholder="Enter 10 digit phone number"
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '') })}
              />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button className="form-btn" style={styles.backBtn} onClick={back}>Back</button>
                <button className="form-btn" style={styles.btn} onClick={handleNext}>Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 4 - Update Preference */}
          {step === 4 && (
            <motion.div key="pref" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <h2 className="form-title" style={styles.title}>
                How do you want <span style={styles.grad}>updates?</span>
              </h2>
              <div style={styles.optionCol}>
                <button
                  className="form-option"
                  style={form.updatePreference === 'whatsapp' ? styles.optionActive : styles.option}
                  onClick={() => setForm({ ...form, updatePreference: 'whatsapp', whatsapp: '', email: '' })}>
                  <RiWhatsappLine size={22} color={form.updatePreference === 'whatsapp' ? '#fff' : '#25D366'} />
                  WhatsApp
                </button>
                <button
                  className="form-option"
                  style={form.updatePreference === 'email' ? styles.optionActive : styles.option}
                  onClick={() => setForm({ ...form, updatePreference: 'email', whatsapp: '', email: '' })}>
                  <RiMailLine size={22} color={form.updatePreference === 'email' ? '#fff' : '#a855f7'} />
                  Email
                </button>
                <button
                  className="form-option"
                  style={form.updatePreference === 'both' ? styles.optionActive : styles.option}
                  onClick={() => setForm({ ...form, updatePreference: 'both', whatsapp: '', email: '' })}>
                  <RiCheckboxCircleLine size={22} color={form.updatePreference === 'both' ? '#fff' : '#ec4899'} />
                  Both
                </button>
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button className="form-btn" style={styles.backBtn} onClick={back}>Back</button>
                <button className="form-btn" style={styles.btn} onClick={handleNext}>Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 5 - Contact Details */}
          {step === 5 && (
            <motion.div key="contact" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <h2 className="form-title" style={styles.title}>
                Enter your <span style={styles.grad}>contact details</span>
              </h2>
              {(form.updatePreference === 'whatsapp' || form.updatePreference === 'both') && (
                <input
                  className="form-input"
                  style={styles.input}
                  placeholder="WhatsApp number (10 digits)"
                  type="tel"
                  maxLength={10}
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                />
              )}
              {(form.updatePreference === 'email' || form.updatePreference === 'both') && (
                <input
                  className="form-input"
                  style={styles.input}
                  placeholder="Email (@gmail.com)"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              )}
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button className="form-btn" style={styles.backBtn} onClick={back}>Back</button>
                <button className="form-btn" style={styles.btn} onClick={handleNext}>Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 6 - Message */}
          {step === 6 && (
            <motion.div key="message" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <h2 className="form-title" style={styles.title}>
                Anything to <span style={styles.grad}>convey?</span>
              </h2>
              <textarea
                className="form-input"
                style={{ ...styles.input, minHeight: 120, resize: 'vertical', paddingTop: 14 }}
                placeholder="Your message (optional)"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button className="form-btn" style={styles.backBtn} onClick={back}>Back</button>
                <button className="form-btn" style={styles.btn} onClick={handleNext}>Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 7 - Submit */}
          {step === 7 && !submitted && (
            <motion.div key="submit" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <PiCrossBold size={52} color="#a855f7" />
              <h2 className="form-title" style={styles.title}>
                Almost <span style={styles.grad}>done!</span>
              </h2>
              <p style={styles.desc}>Thank you for your cooperation. Click below to complete your registration.</p>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.row}>
                <button className="form-btn" style={styles.backBtn} onClick={back} disabled={loading}>Back</button>
                <button
                  className="form-btn"
                  style={{
                    ...styles.btn,
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spin"><RiLoader4Line size={20} /></span>
                      Submitting...
                    </>
                  ) : 'Submit'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Thank You */}
          {submitted && (
            <motion.div key="thanks" variants={slideVariants} initial="initial" animate="animate" exit="exit" style={styles.stepBox}>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <RiCheckboxCircleLine size={80} color="#a855f7" />
              </motion.div>
              <h2 className="form-bigtitle" style={styles.bigTitle}>
                Thank <span style={styles.grad}>You!</span>
              </h2>
              <p style={styles.desc}>Your details have been saved successfully. God bless you!</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar */}
      {!submitted && step > 0 && (
        <div style={styles.bottomBar}>
          <div style={styles.stepText}>Step {step} of {totalSteps}</div>
          <div style={styles.dotsRow}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  ...styles.dot,
                  background: i < step
                    ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                    : 'rgba(168,85,247,0.2)',
                }}
                animate={{ width: i + 1 === step ? 24 : 8 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f1a',
    padding: '24px 20px 110px 20px',
    position: 'relative',
  },
  inner: {
    width: '100%',
    maxWidth: 500,
  },
  stepBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20,
    width: '100%',
  },
  bigTitle: {
    fontSize: 40,
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.1,
    margin: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    color: '#fff',
    margin: 0,
    lineHeight: 1.2,
  },
  grad: {
    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#a855f7',
    fontSize: 16,
    margin: 0,
  },
  desc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0,
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
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
  },
  btn: {
    padding: '14px 32px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    flex: 1,
  },
  backBtn: {
    padding: '14px 24px',
    borderRadius: 12,
    border: '1px solid rgba(168,85,247,0.3)',
    cursor: 'pointer',
    background: 'transparent',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 600,
    fontSize: 16,
  },
  optionRow: {
    display: 'flex',
    gap: 12,
    width: '100%',
    flexWrap: 'wrap',
  },
  optionCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  option: {
    padding: '14px 20px',
    borderRadius: 12,
    border: '1px solid rgba(168,85,247,0.25)',
    background: 'rgba(168,85,247,0.06)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 500,
    textAlign: 'left',
  },
  optionActive: {
    padding: '14px 20px',
    borderRadius: 12,
    border: '1px solid #a855f7',
    background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.15))',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 700,
    textAlign: 'left',
  },
  row: {
    display: 'flex',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  error: {
    color: '#f87171',
    fontSize: 13,
    margin: 0,
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 24px',
    background: 'rgba(15,15,26,0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(168,85,247,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  stepText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: 500,
  },
  dotsRow: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    width: 8,
  },
};