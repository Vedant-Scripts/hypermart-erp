import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import auth from './modules/auth/index.js';

const app = express();

// Middleware Setup
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.send('BasketFull backend is running on EC2 server...');
});

app.use(auth.prefix, auth.router);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});

export default app;
