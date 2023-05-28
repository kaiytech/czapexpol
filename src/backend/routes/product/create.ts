import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { create } from '../../functions/products';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin, IsSeller } from '../../functions/validation';
import { AuthorizationError } from '../../utils/customErrors';

export default {
    method: 'post',
    path: '/api/product',
    validators: [
        authorize,
        body('name').not().isEmpty(),
        body('desc').optional(),
        body('photo').optional(),
        body('category').not().isEmpty(),
        body('user').isNumeric().not().isEmpty(),
        body('quantity').isNumeric().not().isEmpty(),
        body('price').isFloat().not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.CREATED,
            execute: async () => {
                if (
                    (await IsSeller(req.headers.authorization)) ||
                    (await IsAdmin(req.headers.authorization))
                ) {
                    return await create(
                        req.body.name,
                        req.body.category,
                        req.body.user,
                        req.body.quantity,
                        req.body.price,
                        req.body.desc,
                        req.body.photo,
                    );
                } else {
                    throw new AuthorizationError('Insufficient permissions.');
                }
                throw new AuthorizationError();
            },
        }),
} as TRoute;
