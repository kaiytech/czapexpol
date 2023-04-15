import express from 'express'
import { getStatus } from './status/get.status'
const router = express.Router()
// middleware
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
// home page route
router.get('/', (req, res) => {
    res.send('Example home page')
})
export default router
