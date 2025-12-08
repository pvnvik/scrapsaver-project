import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import './incentives.css';

export default function IncentivesPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="page-root" style={{ flex: 1 }}>
                <div className="about-hero" style={{ paddingBottom: '2rem' }}>
                    <h1 className="text-gradient">Rewards for Impact</h1>
                    <p className="hero-subtitle" style={{ margin: '0 auto' }}>
                        Your recycling efforts don't just help the planet—they earn you exclusive perks, discounts, and recognition. Climb the tiers to unlock more!
                    </p>
                </div>

                <section className="incentives-section">
                    <div className="incentives-grid">
                        {/* TIER 1 */}
                        <div className="tier-card tier-starter">
                            <div className="tier-icon">🌱</div>
                            <h2 className="tier-name">Eco Starter</h2>
                            <span className="tier-requirement">&lt; 20 KG Recycled</span>
                            <ul className="tier-features">
                                <li><span className="check-icon">✓</span> Start your journey</li>
                                <li><span className="check-icon">✓</span> Carbon Impact Tracking</li>
                                <li><span className="check-icon">✓</span> Digital Green Badge</li>
                                <li><span className="check-icon">✓</span> Access to Recycling Guide</li>
                            </ul>
                            <Link to="/register" className="ghost-btn tier-cta">Start Now</Link>
                        </div>

                        {/* TIER 2 - Highlighted */}
                        <div className="tier-card tier-guardian">
                            <div className="tier-icon">🌍</div>
                            <h2 className="tier-name">Earth Guardian</h2>
                            <span className="tier-requirement">20 - 100 KG Recycled</span>
                            <ul className="tier-features">
                                <li><span className="check-icon">✓</span> <strong>Everything in Starter</strong></li>
                                <li><span className="check-icon">✓</span> Priority Pickup Scheduling</li>
                                <li><span className="check-icon">✓</span> <strong>5% Discount</strong> at Partner Stores</li>
                                <li><span className="check-icon">✓</span> Quarter-Yearly Impact Report</li>
                                <li><span className="check-icon">✓</span> "Guardian" Profile Badge</li>
                            </ul>
                            <Link to="/register" className="primary-btn tier-cta">Get Guardian Status</Link>
                        </div>

                        {/* TIER 3 */}
                        <div className="tier-card tier-hero">
                            <div className="tier-icon">🎗️</div>
                            <h2 className="tier-name">Planet Hero</h2>
                            <span className="tier-requirement">100+ KG Recycled</span>
                            <ul className="tier-features">
                                <li><span className="check-icon">✓</span> <strong>Everything in Guardian</strong></li>
                                <li><span className="check-icon">✓</span> <strong>Tree Planted</strong> in Your Name</li>
                                <li><span className="check-icon">✓</span> <strong>10% Discount</strong> at Partner Stores</li>
                                <li><span className="check-icon">✓</span> Exclusive ScrapSaver Swag Kit</li>
                                <li><span className="check-icon">✓</span> Feature on our Hall of Fame</li>
                            </ul>
                            <Link to="/register" className="ghost-btn tier-cta">Aim for Hero</Link>
                        </div>
                    </div>
                </section>

                {/* Motivational Banner */}
                <div className="panel glass-panel" style={{
                    maxWidth: '900px',
                    margin: '0 auto 6rem',
                    textAlign: 'center',
                    padding: '4rem',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255,255,255,0.8))'
                }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--dark)' }}>Every gram counts.</h2>
                    <p className="text-dim" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Whether it's a single phone or an entire office cleanout, your contribution creates ripples of positive change.
                    </p>
                    <Link to="/dashboard" className="primary-btn" style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem' }}>
                        Check My Progress
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
