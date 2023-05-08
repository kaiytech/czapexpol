import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { deleteCart } from '../../functions/cart';
import { authorize } from '../../utils/middleware.utils';

export default {
    method: 'delete',
    path: '/api/cart',
    validators: [authorize, body('id').isNumeric().not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                return await deleteCart(req.body.id);
            },
        }),
} as TRoute;
