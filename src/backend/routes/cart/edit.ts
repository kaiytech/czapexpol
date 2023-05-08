import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { edit } from '../../functions/cart';
import { authorize } from '../../utils/middleware.utils';

export default {
    method: 'put',
    path: '/api/cart',
    validators: [
        authorize,
        body('id').isNumeric().not().isEmpty(),
        body('quantity').isNumeric().optional(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                return await edit(req.body.id, req.body.quantity);
            },
        }),
} as TRoute;
