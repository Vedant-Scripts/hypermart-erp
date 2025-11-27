import express, {type Express} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import auth from './modules/auth/index.js';
import { brandRouter, categoryRouter, productRouter, subcategoryRouter, unitRouter } from './modules/inventory/index.js';
import { contactRouter } from './modules/contacts/index.js';
import { userRouter } from './modules/users/index.js';
import { authenicateClient } from './common/auth/guards.auth.js';
import { purchaseBillRouter } from './modules/purchase/index.js';

const app: Express = express();

// Middleware Setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('HyperMart backend is running on EC2 server...');
});

app.use(authenicateClient); // client platform mandatory checking 

// app routes 
app.use(auth.prefix, auth.router);
app.use(categoryRouter.prefix, categoryRouter.router);
app.use(subcategoryRouter.prefix, subcategoryRouter.router);
app.use(brandRouter.prefix, brandRouter.router);
app.use(unitRouter.prefix, unitRouter.router);
app.use(contactRouter.prefix, contactRouter.router);
app.use(userRouter.prefix, userRouter.router);
app.use(productRouter.prefix, productRouter.router);
app.use(purchaseBillRouter.prefix, purchaseBillRouter.router);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});

export default app;
