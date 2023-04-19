import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { edit } from '../../functions/products';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin, IsSeller } from '../../functions/validation';

export default {
    method: 'put',
    path: '/api/product',
    validators: [authorize, body('id').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                if (
                    (await IsSeller(req.headers.authorization)) ||
                    (await IsAdmin(req.headers.authorization))
                ) {
                    return edit(
                        req.body.id,
                        req.body.name,
                        req.body.category,
                        req.body.user,
                        req.body.quantity,
                        req.body.price,
                        req.body.desc,
                        req.body.photo,
                    );
                }
            },
        }),
} as TRoute;
