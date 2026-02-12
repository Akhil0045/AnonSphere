import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserSecret, FaShieldAlt, FaBolt, FaGlobe, FaCode, FaPalette } from 'react-icons/fa';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="container">
            <section className="landing-hero">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>

                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-title"
                    >
                        Speak Freely. <br />
                        <span className="text-gradient">No Traces Left Behind.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        Experience the ultimate anonymous chat platform. No sign-ups, no logs, just pure connection. Join a room and start chatting instantly.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link to="/chat?tab=public" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            Join Public Room
                        </Link>
                        <Link to="/chat?tab=private" className="btn-secondary" style={{
                            fontSize: '1.1rem',
                            padding: '1rem 2rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '50px',
                            transition: 'all 0.3s ease'
                        }}>
                            Join Private Room
                        </Link>
                    </motion.div>
                </div>
            </section>

            <section className="features">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center"
                    style={{ fontSize: '2.5rem', marginBottom: '3rem' }}
                >
                    Why Choose AnonSphere?
                </motion.h2>

                <div className="feature-grid">
                    <FeatureCard
                        icon={<FaUserSecret />}
                        title="Total Anonymity"
                        desc="No accounts, no email, no phone numbers. Just pick a nickname and go."
                    />
                    <FeatureCard
                        icon={<FaShieldAlt />}
                        title="Secure & Private"
                        desc="Messages are ephemeral and never stored on our servers once delivered."
                    />
                    <FeatureCard
                        icon={<FaBolt />}
                        title="Lightning Fast"
                        desc="Real-time WebSocket connection ensures your messages fly instantly."
                    />
                    <FeatureCard
                        icon={<FaGlobe />}
                        title="Global Rooms"
                        desc="Connect with people from anywhere in the world in open channels."
                    />
                    <FeatureCard
                        icon={<FaCode />}
                        title="Open Source"
                        desc="Built with transparency in mind. Our code is open for community audit."
                    />
                    <FeatureCard
                        icon={<FaPalette />}
                        title="Premium Design"
                        desc="A sleek, modern interface designed for the best possible user experience."
                    />
                </div>
            </section>


            <section className="cta-section">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to dive in?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Join thousands of users enjoying secure, anonymous conversations right now.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/chat?tab=public" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        Join Public Room
                    </Link>
                    <Link to="/chat?tab=private" className="btn-secondary" style={{
                        fontSize: '1.1rem',
                        padding: '1rem 2rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        transition: 'all 0.3s ease'
                    }}>
                        Join Private Room
                    </Link>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="feature-card"
    >
        <div className="feature-icon">{icon}</div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    </motion.div>
);

export default LandingPage;
