import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin, IsSeller } from '../../functions/validation';
import { deleteProduct } from '../../functions/products';

const errorCode = StatusCodes.BAD_GATEWAY;

export default {
    method: 'delete',
    path: '/api/product',
    validators: [authorize, body('id').not().isEmpty()],
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
                    return deleteProduct(req.body.id);
                }
            },
        }),
} as TRoute;
