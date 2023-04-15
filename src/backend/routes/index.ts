import express from 'express';
import { getStatus } from './status/get.status';
import { postUser } from './users/post.user';
const router = express.Router();
// middleware
router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});
// home page route
router.get('/', (req, res) => {
    res.send('Example home page');
});
router.post('/api/user', postUser);
export default router;
