import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { buyCart } from '../../functions/buy';
import { authorize } from '../../utils/middleware.utils';

export default {
    method: 'post',
    path: '/api/buy',
    validators: [authorize, body('userid').isNumeric().not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.CREATED,
            execute: async () => {
                return await buyCart(req.body.userid);
            },
        }),
} as TRoute;
