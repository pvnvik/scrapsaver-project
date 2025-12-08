import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const COLORS = ['#047857', '#10B981', '#F59E0B', '#FCD34D', '#A7F3D0'];

export default function AdminDashboardPage() {
    const { user, logout, token } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecyclers: 0,
        totalWeightKg: 0,
        co2SavedKg: 0,
        resourcesConservedKg: 0
    });
    const [analyticsData, setAnalyticsData] = useState([]);
    const [pickups, setPickups] = useState([]);
    const [unassigned, setUnassigned] = useState([]);
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes, pickupsRes, unassignedRes, auctionsRes] = await Promise.all([
                    axios.get('/api/admin/stats', { headers }),
                    axios.get('/api/admin/analytics', { headers }),
                    axios.get('/api/pickups', { headers }),
                    axios.get('/api/donations/unassigned', { headers }),
                    axios.get('/api/auctions', { headers })
                ]);

                setStats(statsRes.data);
                setAnalyticsData(analyticsRes.data);
                setPickups(pickupsRes.data);
                setUnassigned(unassignedRes.data);
                setAuctions(auctionsRes.data);
            } catch (err) {
                console.error('Failed to fetch admin data', err);
            }
        };
        fetchData();
    }, [token]);

    const updatePickupStatus = async (id, status) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.patch(`/api/pickups/${id}/status`, { status }, { headers });
            setPickups(prev => prev.map(p => p._id === id ? res.data : p));
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const createAuction = async (donationId) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post('/api/auctions', { donationId }, { headers });
            // Remove from list
            setUnassigned(prev => prev.filter(d => d._id !== donationId));
            alert('Auction created successfully');
            // Refresh auctions list
            const res = await axios.get('/api/auctions', { headers });
            setAuctions(res.data);
        } catch (err) {
            console.error('Failed to create auction', err);
            alert('Failed to create auction');
        }
    };

    const closeAuction = async (auctionId) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.post(`/api/auctions/${auctionId}/close`, {}, { headers });
            setAuctions(prev => prev.map(a => a._id === auctionId ? res.data : a));
            alert('Auction closed successfully');
        } catch (err) {
            console.error('Failed to close auction', err);
            alert('Failed to close auction');
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="page-root" style={{ flex: 1, paddingBottom: '4rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <div>
                        <h1 className="text-gradient" style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>Admin Dashboard</h1>
                        <p className="hero-subtitle" style={{ fontSize: '1.1rem', margin: 0 }}>
                            Overview of system performance and logistics.
                        </p>
                    </div>
                </header>

                <section className="stats-grid">
                    <div className="stat-card glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                        <h3>Users</h3>
                        <div className="value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-card glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏗️</div>
                        <h3>Recyclers</h3>
                        <div className="value">{stats.totalRecyclers}</div>
                    </div>
                    <div className="stat-card glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚖️</div>
                        <h3>E-Waste</h3>
                        <div className="value">{stats.totalWeightKg.toFixed(1)} kg</div>
                    </div>
                    <div className="stat-card glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌳</div>
                        <h3>CO₂ Saved</h3>
                        <div className="value">{stats.co2SavedKg.toFixed(1)} kg</div>
                    </div>
                </section>

                <div className="forms-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', margin: '3rem 0', gap: '3rem' }}>

                    {/* Charts Panel */}
                    <section className="panel glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginTop: 0, color: 'var(--dark)' }}>Waste Distribution</h2>
                        <p className="text-dim">Breakdown by e-waste category.</p>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={analyticsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analyticsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Create Auctions Panel */}
                    <section className="panel glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginTop: 0 }}>Create Auctions</h2>
                        <p className="text-dim">Assign unallocated donations to auctions.</p>
                        {unassigned.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '1rem' }}>
                                <p>All donations are assigned! 🎉</p>
                            </div>
                        ) : (
                            <ul style={{ padding: 0, listStyle: 'none', maxHeight: '350px', overflowY: 'auto' }}>
                                {unassigned.map(d => (
                                    <li key={d._id} style={{
                                        marginBottom: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.6)',
                                        borderRadius: '0.8rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{d.wasteType}</strong>
                                            <div className="text-dim" style={{ fontSize: '0.9rem' }}>{d.quantityKg} kg</div>
                                        </div>
                                        <button
                                            className="primary-btn"
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                            onClick={() => createAuction(d._id)}
                                        >
                                            Create
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                {/* Manage Auctions */}
                <section className="panel glass-panel" style={{ marginBottom: '3rem', padding: '2rem' }}>
                    <h2 style={{ marginTop: 0 }}>Active Auctions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {auctions.map(auction => (
                            <div key={auction._id} style={{
                                background: 'rgba(255,255,255,0.6)',
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                border: '1px solid rgba(255,255,255,0.5)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{auction.donation?.wasteType}</h3>
                                        <div className="text-dim">{auction.donation?.quantityKg} kg</div>
                                    </div>
                                    <span className={`status-badge`} style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        background: auction.status === 'open' ? '#dcfce7' : '#fee2e2',
                                        color: auction.status === 'open' ? '#166534' : '#991b1b'
                                    }}>
                                        {auction.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    Highest Bid: <strong style={{ color: 'var(--primary)' }}>₹{auction.highestBid || 0}</strong>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {auction.status === 'open' && (
                                        <button className="primary-btn full-width" onClick={() => closeAuction(auction._id)} style={{ padding: '0.5rem' }}>
                                            Close
                                        </button>
                                    )}
                                </div>

                                <details style={{ marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                                    <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Show {auction.bids.length} Bids</summary>
                                    <ul style={{ marginTop: '0.5rem', paddingLeft: 0, listStyle: 'none' }}>
                                        {auction.bids.length === 0 ? <li style={{ fontSize: '0.85rem', color: '#999' }}>No bids placed</li> : auction.bids.map((bid, i) => (
                                            <li key={i} style={{ fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{bid.recycler?.name || 'Recycler'}</span>
                                                <strong>₹{bid.amount}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        ))}
                        {auctions.length === 0 && <p className="text-dim">No auctions found.</p>}
                    </div>
                </section>

                {/* Pickup Requests Table */}
                <section className="panel glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginTop: 0 }}>Manage Logistics</h2>
                    <p className="text-dim" style={{ marginBottom: '1.5rem' }}>Update status of pickup requests.</p>
                    <div style={{ overflowX: 'auto', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.5)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(4, 120, 87, 0.1)', color: 'var(--primary)' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>User</th>
                                    <th style={{ padding: '1rem' }}>Address</th>
                                    <th style={{ padding: '1rem' }}>Content</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pickups.map((p, i) => (
                                    <tr key={p._id} style={{
                                        borderBottom: i !== pickups.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                        background: i % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'transparent'
                                    }}>
                                        <td style={{ padding: '1rem' }}>{new Date(p.preferredTime).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}><strong>{p.user?.name || 'Unknown'}</strong></td>
                                        <td style={{ padding: '1rem' }}>{p.address}</td>
                                        <td style={{ padding: '1rem' }}>{p.quantityKg}kg {p.wasteType}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '99px',
                                                fontSize: '0.8rem',
                                                background: p.status === 'completed' ? '#dcfce7' : '#fef9c3',
                                                color: p.status === 'completed' ? '#166534' : '#854d0e'
                                            }}>{p.status}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={p.status}
                                                onChange={(e) => updatePickupStatus(p._id, e.target.value)}
                                                style={{
                                                    padding: '0.4rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: 'rgba(255,255,255,0.8)',
                                                    margin: 0
                                                }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="assigned">Assigned</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
