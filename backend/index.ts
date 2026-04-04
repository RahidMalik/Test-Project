import express, { type Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import campaignRoutes from './routes/campaignRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app: Application = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://your-frontend-name.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log('✅ SQL Database connected. Data is safe!');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err: any) => {
        console.error('❌ Unable to connect to the SQL database:', err);
    });