import express from 'express';
import TRoute from './routes/status/get.status';
let router = express.Router();

router.get('/api/status', TRoute.handler);

router.post('/api/sample', () => {});
