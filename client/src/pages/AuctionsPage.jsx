import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

let socket;

export default function AuctionsPage() {
  const { token, user } = useAuth();
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    axios.get('/api/auctions', { headers }).then(res => setAuctions(res.data));

    socket = io();
    socket.on('auction:bid', updated => {
      setAuctions(prev => prev.map(a => (a._id === updated._id ? updated : a)));
    });
    socket.on('auction:created', created => {
      setAuctions(prev => [created, ...prev]);
    });
    socket.on('auction:closed', closed => {
      setAuctions(prev => prev.map(a => (a._id === closed._id ? closed : a)));
    });
    return () => {
      socket.disconnect();
    };
  }, [token]);

  const placeBid = async (id, amount, currentHighest, clearInput) => {
    const numeric = Number(amount);
    if (!numeric || Number.isNaN(numeric)) {
      alert('Please enter a valid bid amount.');
      return;
    }
    if (numeric <= currentHighest) {
      alert(`Your bid must be higher than the current highest bid (${currentHighest}).`);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.post(`/api/auctions/${id}/bids`, { amount: numeric }, { headers });
      const updated = res.data;
      // Ensure UI updates immediately even if socket event is delayed
      setAuctions(prev => prev.map(a => (a._id === updated._id ? updated : a)));
      if (clearInput) clearInput();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place bid');
    }
  };

  if (user?.role !== 'recycler' && user?.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div className="page-root" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="info-text">Auctions are only available to registered recyclers.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page-root" style={{ flex: 1, paddingBottom: '4rem' }}>
        <header className="dashboard-header" style={{ marginBottom: '3rem' }}>
          <div>
            <h1 className="text-gradient" style={{ margin: '0 0 0.5rem 0' }}>Live Auctions</h1>
            <p className="hero-subtitle" style={{ fontSize: '1.1rem', margin: 0 }}>
              Bid on verified e-waste lots from responsible donors.
            </p>
          </div>
        </header>

        <section className="panel" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
          {auctions.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p className="info-text" style={{ fontSize: '1.2rem' }}>
                No auctions are currently active. <br />
                <span className="text-dim" style={{ fontSize: '1rem' }}>Check back later for new listings!</span>
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
              {auctions.map(a => <AuctionCard key={a._id} auction={a} onBid={placeBid} />)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

function AuctionCard({ auction, onBid }) {
  const [amount, setAmount] = useState('');
  const donation = auction.donation || {};
  const isOpen = auction.status === 'open';

  return (
    <div className="glass-panel" style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Waste Type Icon/Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>
            {donation.quantityKg} kg
          </h3>
          <span className="text-dim" style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em' }}>
            {donation.wasteType}
          </span>
        </div>
        <span style={{
          padding: '0.3rem 0.8rem',
          borderRadius: '99px',
          background: isOpen ? '#dcfce7' : '#fee2e2',
          color: isOpen ? '#166534' : '#991b1b',
          fontWeight: '700',
          fontSize: '0.75rem',
          textTransform: 'uppercase'
        }}>
          {auction.status}
        </span>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '1rem', padding: '1rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>Current Highest Bid</div>
        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>
          ₹{auction.highestBid || 0}
        </div>
      </div>

      {isOpen && (
        <div className="auction-actions" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount"
              style={{ marginBottom: 0 }}
            />
            <button
              className="primary-btn"
              style={{ padding: '0.8rem 1.2rem', minWidth: '100px' }}
              onClick={() => onBid(auction._id, amount, auction.highestBid, () => setAmount(''))}
            >
              Bid
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            *Bids are final and binding.
          </p>
        </div>
      )}
    </div>
  );
}
