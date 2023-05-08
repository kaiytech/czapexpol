import express from 'express';
import getStatus from './status/get';
import postUser from './user/create';
import loginUser from './user/login';
import editUser from './user/edit';
import deleteUser from './user/delete';
import listUsers from './user/list';
import verifyUsers from './user/verify';
import createCategory from './category/create';
import deleteCategory from './category/delete';
import getCategory from './category/get';
import editCategory from './category/edit';
import createProduct from './product/create';
import deleteProduct from './product/delete';
import getProduct from './product/get';
import editProduct from './product/edit';
import createCart from './cart/create';
const router = express.Router();
// home page route
router.get('/', (req, res) => {
    res.send('Nothing to found here ;)');
});
const apiRoutes = [
    getStatus,
    postUser,
    loginUser,
    editUser,
    deleteUser,
    listUsers,
    createCategory,
    deleteCategory,
    getCategory,
    editCategory,
    createProduct,
    deleteProduct,
    getProduct,
    editProduct,
    verifyUsers,
    createCart,
];
apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);
export default router;
