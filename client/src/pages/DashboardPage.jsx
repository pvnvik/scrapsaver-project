import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const TRIVIA_FACTS = [
  "E-waste represents 2% of America's trash in landfills, but it equals 70% of overall toxic waste.",
  "20 to 50 million metric tons of e-waste are disposed of worldwide every year.",
  "Only 12.5% of e-waste is currently recycled.",
  "Recycling 1 million laptops saves the energy equivalent to the electricity used by 3,657 homes in a US year.",
  "Cell phones and other electronic items contain high amounts of gold and silver.",
  "A large number of what is labeled as 'e-waste' is actually not waste at all, but rather whole electronic equipment or parts that are readily marketable for reuse or can be recycled for materials recovery.",
];

function TriviaCard() {
  const [fact, setFact] = useState('');

  useEffect(() => {
    setFact(TRIVIA_FACTS[Math.floor(Math.random() * TRIVIA_FACTS.length)]);
  }, []);

  return (
    <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-dim)' }}>
      {fact}
      <button
        className="ghost-btn"
        style={{ display: 'block', marginTop: '1rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        onClick={() => setFact(TRIVIA_FACTS[Math.floor(Math.random() * TRIVIA_FACTS.length)])}
      >
        Next Fact
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { user, setUser, token, logout } = useAuth();
  const [donations, setDonations] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [form, setForm] = useState({ address: '', wasteType: '', quantityKg: '', preferredTime: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'recycler') {
      navigate('/auctions');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    axios.get('/api/donations', { headers }).then(res => setDonations(res.data));
    axios.get('/api/pickups', { headers }).then(res => setPickups(res.data));
  }, [token]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submitPickup = async e => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.post('/api/pickups', form, { headers });
    setPickups(prev => [...prev, res.data]);
    setForm({ address: '', wasteType: '', quantityKg: '', preferredTime: '' });
    // Refresh user stats
    const me = await axios.get('/api/users/me', { headers });
    setUser(me.data.user);
  };

  const submitDonation = async e => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post(
      '/api/donations',
      { wasteType: form.wasteType, quantityKg: Number(form.quantityKg) || 0 },
      { headers }
    );
    const me = await axios.get('/api/users/me', { headers });
    setDonations(me.data.donations);
    setUser(me.data.user);

  };

  const downloadCertificate = async (donationId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`/api/donations/${donationId}/certificate`, {
        headers,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${donationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download certificate', err);
      alert('Failed to generate certificate');
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="page-root" style={{ flex: 1, paddingBottom: '4rem' }}>
        <header className="dashboard-header" style={{ marginBottom: '3rem' }}>
          <div>
            <h1 className="text-gradient" style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>
              Welcome back, {user.name}
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.1rem', margin: 0 }}>
              Your impact journey at a glance
            </p>
          </div>
        </header>

        {/* Incentive Progress Bar */}
        <div className="panel glass-panel" style={{ padding: '2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
                {(() => {
                    const totalWeight = user.impact?.totalWeightKg || 0;
                    let currentTier = 'Eco Starter';
                    let nextTier = 'Earth Guardian';
                    let target = 20;
                    let progress = 0;
                    let nextTierIcon = '🌍';

                    if (totalWeight >= 100) {
                        currentTier = 'Planet Hero';
                        nextTier = 'Legendary Status';
                        target = 1000; // Arbitrary next goal
                        progress = 100;
                        nextTierIcon = '👑';
                    } else if (totalWeight >= 20) {
                        currentTier = 'Earth Guardian';
                        nextTier = 'Planet Hero';
                        target = 100;
                        progress = ((totalWeight - 20) / (100 - 20)) * 100;
                        nextTierIcon = '🎗️';
                    } else {
                        progress = (totalWeight / 20) * 100;
                    }

                    return (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Current Tiery: <span style={{ color: 'var(--primary)' }}>{currentTier}</span></h2>
                                    <p className="text-dim" style={{ margin: '0.5rem 0 0' }}>
                                        {totalWeight.toFixed(1)} / {target} kg to reach <strong>{nextTier} {nextTierIcon}</strong>
                                    </p>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)' }}>
                                    {Math.min(100, Math.max(0, progress)).toFixed(0)}%
                                </div>
                            </div>
                            
                             <div style={{ 
                                width: '100%', 
                                height: '24px', 
                                background: 'rgba(0,0,0,0.05)', 
                                borderRadius: '99px',
                                overflow: 'hidden',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ 
                                    width: `${Math.min(100, Math.max(0, progress))}%`, 
                                    height: '100%', 
                                    background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))',
                                    borderRadius: '99px',
                                    transition: 'width 1s ease-out',
                                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                                }} />
                            </div>
                        </>
                    );
                })()}
            </div>
        </div>

        {/* Stats Section - Highlighting Impact */}
        <section className="stats-grid" style={{ marginBottom: '4rem' }}>
          <div className="stat-card glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>♻️</div>
            <h3 style={{ marginTop: 0 }}>E-Waste Donated</h3>
            <div className="value">{user.impact?.totalWeightKg?.toFixed(1) || 0} kg</div>
          </div>
          <div className="stat-card glass-panel" style={{ textAlign: 'center', padding: '2rem', borderTop: '4px solid var(--secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌱</div>
            <h3 style={{ marginTop: 0 }}>CO₂ Prevented</h3>
            <div className="value">{user.impact?.co2SavedKg?.toFixed(1) || 0} kg</div>
          </div>
          <div className="stat-card glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
            <h3 style={{ marginTop: 0 }}>Resources Saved</h3>
            <div className="value">{user.impact?.resourcesConservedKg?.toFixed(1) || 0} kg</div>
          </div>
        </section>

        {/* Actions Grid */}
        <section className="forms-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>

          <div className="panel glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: 'var(--primary)' }}>Request Pickup</h2>
              <span style={{ fontSize: '1.5rem' }}>🚚</span>
            </div>

            <form onSubmit={submitPickup} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input name="address" placeholder="Pickup Address" value={form.address} onChange={onChange} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="wasteType" placeholder="Item Type (e.g. Phone)" value={form.wasteType} onChange={onChange} required />
                <input
                  name="quantityKg"
                  type="number"
                  step="0.1"
                  placeholder="Est. Weight (kg)"
                  value={form.quantityKg}
                  onChange={onChange}
                  required
                />
              </div>

              <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--dark)', marginTop: '0.5rem' }}>
                Preferred Time
              </label>
              <input
                name="preferredTime"
                type="datetime-local"
                value={form.preferredTime}
                onChange={onChange}
                required
              />
              <button className="primary-btn full-width" type="submit" style={{ marginTop: '1rem' }}>
                Schedule Now
              </button>
            </form>
          </div>

          <div className="panel glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: 'var(--primary)' }}>Self Drop-off</h2>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
            </div>
            <p className="text-dim" style={{ marginBottom: '1.5rem' }}>
              Already dropped off e-waste at a partner center? Record it here to update your stats.
            </p>
            <form onSubmit={submitDonation} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                name="wasteType"
                placeholder="What did you drop off?"
                value={form.wasteType}
                onChange={onChange}
                required
              />
              <input
                name="quantityKg"
                type="number"
                step="0.1"
                placeholder="Weight (kg)"
                value={form.quantityKg}
                onChange={onChange}
                required
              />
              <button className="primary-btn full-width" type="submit" style={{ marginTop: 'auto' }}>
                Record Impact
              </button>
            </form>
          </div>

        </section>

        {/* History Lists */}
        <section className="lists-grid" style={{ marginTop: '4rem', gap: '3rem' }}>
          <div className="panel glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid var(--primary)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Scheduled Pickups
            </h2>
            {pickups.length === 0 ? (
              <p className="text-dim">No active pickups.</p>
            ) : (
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {pickups.map(p => (
                  <li key={p._id} style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>{new Date(p.preferredTime).toLocaleDateString()}</strong>
                      <div className="text-dim" style={{ fontSize: '0.9rem' }}>{p.address}</div>
                    </div>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '99px',
                      background: p.status === 'completed' ? '#dcfce7' : '#fef9c3',
                      color: p.status === 'completed' ? '#166534' : '#854d0e',
                      fontWeight: '600',
                      fontSize: '0.8rem'
                    }}>
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid var(--primary)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Impact History
            </h2>
            {donations.length === 0 ? (
              <p className="text-dim">No records yet. Start recycling!</p>
            ) : (
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {donations.map(d => (
                  <li key={d._id} style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{d.quantityKg} kg {d.wasteType}</div>
                      <span className="text-dim" style={{ fontSize: '0.85rem' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      className="ghost-btn"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      onClick={() => downloadCertificate(d._id)}
                    >
                      Download Cert
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="trivia-section panel glass-panel" style={{ marginTop: '2rem', textAlign: 'center', background: 'linear-gradient(to right, rgba(4, 120, 87, 0.05), rgba(101, 163, 13, 0.05))' }}>
          <h2 style={{ marginTop: 0, color: 'var(--primary)' }}>Did you know?</h2>
          <TriviaCard />
        </section>

      </main>
      <Footer />
    </div>
  );
}
