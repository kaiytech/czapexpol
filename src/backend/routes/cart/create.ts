import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { create } from '../../functions/cart';
import { authorize } from '../../utils/middleware.utils';

export default {
    method: 'post',
    path: '/api/cart',
    validators: [
        authorize,
        body('productid').isNumeric().not().isEmpty(),
        body('useremail').not().isEmpty(),
        body('count').isNumeric().not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.CREATED,
            execute: async () => {
                return await create(
                    req.body.productid,
                    req.body.useremail,
                    req.body.count,
                );
            },
        }),
} as TRoute;
