import express, { type Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import campaignRoutes from './routes/campaignRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
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