import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page-root" style={{ flex: 1, paddingTop: '2rem' }}>
        <div className="about-hero">
          <h1 className="text-gradient">About ScrapSaver</h1>
          <p className="hero-subtitle" style={{ margin: '0 auto' }}>
            We are dedicated to building a sustainable future by connecting responsible households with certified recyclers
          </p>
        </div>

        <div className="about-grid">
          <div className="feature-card glass-panel">
            <h3>Our Mission</h3>
            <p>
              To reduce electronic waste in landfills by creating a seamless, transparent, and rewarding ecosystem for responsible disposal.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <h3>How It Works</h3>
            <p>
              Donors list their e-waste, and certified recyclers certified recyclers bid for it. We ensure verified pickup and provide transparent impact metrics.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <h3>The Impact</h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              <li>Reduced carbon footprint</li>
              <li>Resource conservation</li>
              <li>Safe hazardous waste handling</li>
            </ul>
          </div>
        </div>

        <div className="panel" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--text-dim)' }}>
            Join us in making the planet greener, one device at a time.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
