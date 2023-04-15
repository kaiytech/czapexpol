import express from 'express'
import { getStatus } from './routes/status/get.status'
let router = express.Router()

router.get('/api/status', getStatus)

router.post('/api/sample', () => {})
