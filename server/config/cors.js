const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://anon-sphere-five.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
};

module.exports = corsOptions;
