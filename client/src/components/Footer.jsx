import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
    return (
        <footer style={{
            background: 'white',
            padding: '4rem 5vw 2rem',
            marginTop: 'auto',
            borderTop: '1px solid var(--border-color, #e5e7eb)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '3rem'
            }}>
                {/* Brand */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>
                        <img src={logo} alt="ScrapSaver" style={{ height: '32px' }} />
                        ScrapSaver
                    </div>
                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        Empowering responsible e-waste recycling through technology and community action.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>Quick Links</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <Link to="/" style={{ color: 'var(--text-dim)' }}>Home</Link>
                        <Link to="/process" style={{ color: 'var(--text-dim)' }}>How it Works</Link>
                        <Link to="/about" style={{ color: 'var(--text-dim)' }}>About Us</Link>
                        <Link to="/incentives" style={{ color: 'var(--text-dim)' }}>Incentives</Link>

                    </div>
                </div>

                {/* Action */}
                <div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>Join the Mission</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <Link to="/register" style={{ color: 'var(--text-dim)' }}>Register as Donor</Link>
                        <Link to="/register?role=recycler" style={{ color: 'var(--text-dim)' }}>Register as Recycler</Link>
                        <Link to="/login" style={{ color: 'var(--text-dim)' }}>Login</Link>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid #f3f4f6',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.9rem'
            }}>
                © {new Date().getFullYear()} ScrapSaver. All rights reserved.
            </div>
        </footer>
    );
}
