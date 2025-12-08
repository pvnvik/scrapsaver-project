import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

export default function ProcessPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="page-root" style={{ flex: 1, paddingTop: '2rem' }}>
                <div className="about-hero" style={{ marginBottom: '3rem' }}>
                    <h1 className="text-gradient">From Old to Gold</h1>
                    <p className="hero-subtitle" style={{ margin: '0 auto' }}>
                        Discover how your discarded electronics journey from your doorstep to becoming valuable resources for a sustainable future.
                    </p>
                </div>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>The Journey</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        <div className="feature-card glass-panel" style={{ position: 'relative' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                            <h3>1. Schedule</h3>
                            <p>
                                Login to ScrapSaver and book a pickup slot. Tell us what you have, and we'll handle the logistics.
                            </p>
                        </div>

                        <div className="feature-card glass-panel">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
                            <h3>2. Pickup</h3>
                            <p>
                                Our verified logistics partners arrive at your doorstep to collect your e-waste safely and securely.
                            </p>
                        </div>

                        <div className="feature-card glass-panel">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</div>
                            <h3>3. Processing</h3>
                            <p>
                                Waste is transported to certified sorting centers where it is categorized by type and potential reusable material.
                            </p>
                        </div>

                        <div className="feature-card glass-panel">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♻️</div>
                            <h3>4. Recycling</h3>
                            <p>
                                Authorized recyclers extract precious metals (Gold, Silver, Copper) and properly dispose of hazardous materials.
                            </p>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Everyone Wins</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        <div className="panel glass-panel">
                            <h3 className="text-primary">For You</h3>
                            <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li>Declutter your home responsibly</li>
                                <li>Get immediate impact certificates</li>
                                <li>Track your personal carbon savings</li>
                                <li>peace of mind knowing data handled securely</li>
                            </ul>
                        </div>

                        <div className="panel glass-panel">
                            <h3 className="text-primary">For The Planet</h3>
                            <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li>Reduces toxic landfill waste</li>
                                <li>Conserves energy compared to mining</li>
                                <li>Lowers greenhouse gas emissions</li>
                                <li>Keeps hazardous chemicals out of soil</li>
                            </ul>
                        </div>

                        <div className="panel glass-panel">
                            <h3 className="text-primary">For The Economy</h3>
                            <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li>Creates green jobs in recycling</li>
                                <li>Recovers valuable precious metals</li>
                                <li>Supports a circular economy</li>
                                <li>Reduces import dependency for raw materials</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="panel glass-panel" style={{ textAlign: 'center', padding: '3rem', maxWidth: '800px', margin: '0 auto 4rem' }}>
                    <h2 style={{ marginTop: 0 }}>Ready to make an impact?</h2>
                    <p className="text-dim" style={{ marginBottom: '2rem' }}>
                        Join thousands of responsible citizens making a difference today.
                    </p>
                    <a href="/register" className="primary-btn">Start Recycling Now</a>
                </div>
            </div>
            <Footer />
        </div>
    );
}
