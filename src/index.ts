import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authRouter from './routes/authRoutes';
import notificationRouter from './routes/notificationRoutes';

const app = express();

const PORT = process.env.PORT || 3500;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "server ok"
  })
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/notifications', notificationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});