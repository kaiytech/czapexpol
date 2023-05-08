import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { list } from '../../functions/cart';
import { authorize } from '../../utils/middleware.utils';

export default {
    method: 'get',
    path: '/api/cart',
    validators: [authorize, body('useremail').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                return await list(req.body.useremail);
            },
        }),
} as TRoute;
