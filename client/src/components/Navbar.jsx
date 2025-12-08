import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Hide Navbar on specific pages if needed, though requirement is "every page"
    // kept logic extensible just in case.

    return (
        <nav className="landing-nav">
            <Link to="/" className="logo">
                <img src={logo} alt="ScrapSaver Logo" style={{ height: '38px' }} />
                ScrapSaver
            </Link>

            <div className="nav-links">
                <Link to="/" className={location.pathname === '/' ? 'text-primary' : ''}>Home</Link>
                <Link to="/process" className={location.pathname === '/process' ? 'text-primary' : ''}>How it Works</Link>
                <Link to="/about" className={location.pathname === '/about' ? 'text-primary' : ''}>About</Link>
                <Link to="/incentives" className={location.pathname === '/incentives' ? 'text-primary' : ''}>Incentives</Link>

                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <Link to="/admin" className={location.pathname === '/admin' ? 'text-primary' : ''}>Admin</Link>
                        ) : user.role === 'recycler' ? (
                            <Link to="/auctions" className={location.pathname === '/auctions' ? 'text-primary' : ''}>Auctions</Link>
                        ) : (
                            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'text-primary' : ''}>Dashboard</Link>
                        )}

                        <button
                            onClick={logout}
                            className="ghost-btn"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="primary-btn">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
