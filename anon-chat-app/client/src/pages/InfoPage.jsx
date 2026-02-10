import React from 'react';
import { motion } from 'framer-motion';

const InfoPage = ({ title, content }) => {
    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '2rem' }}>{title}</h1>
                <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    {content}
                </div>
            </motion.div>
        </div>
    );
};

export default InfoPage;
