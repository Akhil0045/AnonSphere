# AnonSphere-RealTime

AnonSphere is a secure, anonymous, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It creates a transient communication space where user privacy and data security are paramount.

## 🚀 Key Features

- **Anonymous Identity**: Users join with a nickname and are assigned a unique, transient color identity. No account registration required.
- **Real-Time Messaging**: Instant communication with low latency using Socket.io.
- **Ephemeral Messages**: All chat history is automatically deleted from the database after 24 hours (TTL Index).
- **Room-Based Communication**: Create public or private rooms to organize conversations.
- **Typing Indicators**: Visual feedback when other users are typing.
- **Responsive Design**: Modern, dark-themed UI built with React and Tailwind CSS.

## 🔒 Security Architecture

Security is a core component of AnonSphere. We implement a multi-layered approach to protect user data and privacy.

### 1. Network Privacy (Client-Side Hashing)
To prevent sensitive data leaks, **private room passwords are never sent in plain text** over the network.
- **Mechanism**: When a user joins or creates a private room, the password is hashed using **SHA-256** on the client side (browser) using `crypto-js`.
- **Benefit**: Even if an attacker intercepts the network traffic (e.g., Man-in-the-Middle), they only see the hash, not the actual password.

### 2. Access Control (Server-Side Verification)
The server never stores plain-text passwords.
- **Mechanism**: Upon receiving the SHA-256 hash from the client, the server hashes it again (or compares it) using **bcrypt** (a slow, salt-based hashing algorithm) before storing or verifying it against the database.
- **Benefit**: Keeps room credentials secure even if the database is compromised.

### 3. Data Privacy (Encryption at Rest)
Messages are encrypted before they are saved to the database.
- **Mechanism**: We use **AES-256-CBC** (Advanced Encryption Standard) for symmetric encryption.
    - **Encryption**: Before a message is saved to MongoDB, the server encrypts the text content using a secure server-side `ENCRYPTION_KEY`.
    - **Decryption**: When users join a room and load history, the server decrypts the messages on-the-fly before sending them to the verified client.
- **Benefit**: Database administrators or attackers with database access cannot read the chat history.

### 4. Ephemeral Storage
- **Mechanism**: MongoDB TTL (Time-To-Live) indexes are configured to automatically delete message documents 24 hours after creation.
- **Benefit**: Ensures that conversations are transient and not permanently archived.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Socket.io-client, Crypto-js
- **Backend**: Node.js, Express, Socket.io, Mongoose
- **Database**: MongoDB (with TTL indexes)
- **Security Utilities**: bcryptjs, xss (sanitization), crypto (Node.js native), helmet, express-rate-limit

## 📦 Installation & Setup

1.  **Clone the repository**
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Environment Setup**
    - Create `server/.env`:
      ```env
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/anonchat
      NODE_ENV=development
      CLIENT_URL=http://localhost:5173
      ENCRYPTION_KEY=your_32_byte_hex_key
      ```
4.  **Run Application**
    ```bash
    npm run dev
    ```
    This will start both the backend (port 5000) and frontend (port 5173) concurrently.

## 📝 License

This project is open-source and available under the ISC License.
