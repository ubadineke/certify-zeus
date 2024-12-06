import express from 'express';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import dotenv from 'dotenv';
import connectToDatabase from './config/db';
import authRouter from './routes/auth.route';
import productRouter from './routes/product.route';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(formidableMiddleware());

app.use('/api', productRouter);
app.use('/api', authRouter);
connectToDatabase();

app.listen(PORT, async () => {
  console.log(`Serving at http://localhost:${PORT}`);
});

export default app;
