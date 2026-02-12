import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { UserProvider, useUser } from './context/UserContext';
import { ChatProvider } from './context/ChatContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import InfoPage from './pages/InfoPage';
import JoinScreen from './components/JoinScreen';
import ChatRoom from './components/ChatRoom';

const ChatRoute = () => {
  const { user } = useUser();
  return user.nickname ? <ChatRoom /> : <JoinScreen />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<InfoPage title="About Us" content="AnonSphere is dedicated to providing a secure, anonymous platform for communication. We believe in the right to privacy and the freedom of speech. Our servers do not log your messages, and we do not require any personal information." />} />
          <Route path="features" element={<InfoPage title="Features" content={
            <ul>
              <li><strong>Zero Logging:</strong> We don't know who you are, and neither does anyone else.</li>
              <li><strong>Ephemeral Messaging:</strong> Messages are gone once the session ends.</li>
              <li><strong>Global Reach:</strong> Connect with anyone, anywhere.</li>
              <li><strong>Dark Mode:</strong> Easy on the eyes for late-night chats.</li>
            </ul>
          } />} />
          <Route path="privacy" element={<InfoPage title="Privacy Policy" content={
            <div>
              <p>At AnonSphere, privacy is our core value. We do not collect any personal data.</p>
              <h3>Data Collection</h3>
              <p>We do not store IP addresses, device IDs, or message history persistently. Messages are stored in volatile memory (RAM) or with a short TTL (Time To Live) and are deleted automatically.</p>
              <h3>Cookies</h3>
              <p>We use local storage only to remember your preferred settings (like theme color). We do not use tracking cookies.</p>
            </div>
          } />} />
          <Route path="terms" element={<InfoPage title="Terms of Service" content={
            <div>
              <p>By using AnonSphere, you agree to treat others with respect.</p>
              <h3>Prohibited Conduct</h3>
              <p>You may not use this service to:</p>
              <ul>
                <li>Harass, abuse, or threaten others.</li>
                <li>Distribute illegal content.</li>
                <li>Spam public rooms.</li>
              </ul>
              <p>We reserve the right to ban users who violate these rules.</p>
            </div>
          } />} />
          <Route path="guidelines" element={<InfoPage title="Community Guidelines" content={
            <div>
              <h3>Be Kind</h3>
              <p>Behind every nickname is a real person. Treat them with kindness.</p>
              <h3>Stay Safe</h3>
              <p>Do not share personal information (real name, address, phone number) with strangers.</p>
            </div>
          } />} />
          <Route path="cookies" element={<InfoPage title="Cookie Policy" content="We do not use 3rd party tracking cookies. We only use LocalStorage to save your nickname and color preference locally on your device." />} />
          <Route path="*" element={<div style={{ textAlign: 'center', padding: '5rem' }}><h1>404 Not Found</h1></div>} />
        </Route>
        <Route path="/chat" element={<ChatRoute />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <ChatProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid rgba(255,255,255,0.1)'
                }
              }}
            />
            <AnimatedRoutes />
          </BrowserRouter>
        </ChatProvider>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;

