import express from 'express';
import getStatus from './status/get.status';
import postUser from './user/create';
import loginUser from './user/login';
import editUser from './user/edit';

const router = express.Router();
// home page route
router.get('/', (req, res) => {
    res.send('Example home page');
});
const apiRoutes = [getStatus, postUser, loginUser, editUser];
apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);
export default router;
