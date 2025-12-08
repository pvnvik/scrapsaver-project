import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './landing.css';
import logo from '../assets/logo.png';

import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

export default function LandingPage() {
  return (
    <div className="landing-root">
      <Navbar />
      <main className="landing-hero">
        <section className="hero-text">
          <h1 className="hero-title">Give your e-waste a second life</h1>
          <p className="hero-subtitle">
            Donate electronics, schedule pickups, and connect with certified recyclers while tracking your real
            environmental impact
          </p>
          <div className="hero-actions">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>
            <Link to="/about" className="ghost-btn">
              Learn More
            </Link>
          </div>
        </section>
        <section className="hero-visual">
          <div className="floating-card card-1">Track CO₂ saved</div>
          <div className="floating-card card-2">Smart pickups</div>
          <div className="floating-card card-3">Recycler auctions</div>
        </section>
      </main>
      <MythBusterSection />
      <Footer />
    </div>
  );
}



const MYTHS = [
  {
    myth: "E-waste isn't a big deal.",
    fact: "E-waste is the fastest-growing waste stream in the world, producing 50 million tonnes yearly."
  },
  {
    myth: "My old phone is worthless.",
    fact: "One ton of mobile phones contains more gold than one ton of gold ore."
  },
  {
    myth: "Recycling is too hard.",
    fact: "ScrapSaver makes it easy! We pick up your e-waste directly from your doorstep."
  },
  {
    myth: "Deleting data is enough.",
    fact: "Simply deleting files doesn't permanently erase them. Certified recyclers ensure secure data destruction."
  },
  {
    myth: "It just goes to a landfill anyway.",
    fact: "Certified e-waste recyclers recover valuable materials like copper, silver, and gold for reuse."
  }
];

function MythBusterSection() {
  // Triple the array to ensure smooth infinite scrolling
  const infiniteMyths = [...MYTHS, ...MYTHS, ...MYTHS];

  return (
    <section className="mythbuster-section">
      <h2 className="section-title">Myth vs. Fact</h2>

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {infiniteMyths.map((item, index) => (
            <div key={index} className="marquee-card glass-panel">
              <div className="marquee-myth">
                <span className="card-emoji"></span>
                <h3 className="text-secondary">MYTH</h3>
                <p>"{item.myth}"</p>
              </div>
              <div className="marquee-divider"></div>
              <div className="marquee-fact">
                <span className="card-emoji">💡</span>
                <h3 className="text-primary">FACT</h3>
                <p>{item.fact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
