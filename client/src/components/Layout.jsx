import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaGhost, FaGithub, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Layout.css';

const Layout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';
    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar">
                <div className="container navbar-content">
                    <Link to="/" className="logo-container" onClick={closeMenu}>
                        <FaGhost className="text-gradient" />
                        <span className="text-gradient">AnonSphere</span>
                    </Link>

                    <div className="mobile-menu-btn" onClick={toggleMenu}>
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>

                    <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={closeMenu}>About</Link></li>
                        <li><Link to="/features" className={`nav-link ${isActive('/features')}`} onClick={closeMenu}>Features</Link></li>
                        <li>
                            <Link to="/chat" className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={closeMenu}>
                                Launch App
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <main style={{ flex: 1 }}>

                <Outlet />
            </main>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div>
                            <h3>AnonSphere</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Secure, anonymous, real-time messaging for everyone. No logs, no tracking.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
                                <FaGithub style={{ cursor: 'pointer' }} />
                                <FaTwitter style={{ cursor: 'pointer' }} />
                            </div>
                        </div>

                        <div>
                            <h3>Product</h3>
                            <ul className="footer-links">
                                <li><Link to="/chat">Start Chatting</Link></li>
                                <li><Link to="/features">Features</Link></li>
                                <li><Link to="/">Download App</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3>Resources</h3>
                            <ul className="footer-links">
                                <li><Link to="/guidelines">Community Guidelines</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/blog">Blog</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3>Legal</h3>
                            <ul className="footer-links">
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                                <li><Link to="/cookies">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="copyright">
                        © 2026 AnonSphere. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
