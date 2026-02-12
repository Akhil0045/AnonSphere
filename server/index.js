const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const corsOptions = require('./config/cors');
const apiRoutes = require('./routes/api');
const socketHandler = require('./sockets/socketHandler');
const rateLimiter = require('./middlewares/rateLimiter');
const sanitizeMiddleware = require('./middlewares/sanitize');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: corsOptions
});

// Connect Database
connectDB();

// Middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(sanitizeMiddleware);
app.use('/api', rateLimiter); // Apply rate limiting to API routes

// Routes
app.use('/api', apiRoutes);
app.get('/health', (req, res) => res.status(200).send('OK'));

// Socket.io
socketHandler(io);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

