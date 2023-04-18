import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { list } from '../../functions/category';
import { authorize } from '../../utils/middleware.utils';
import { body } from 'express-validator';

export default {
    method: 'get',
    path: '/api/category',
    validators: [authorize, body('name').optional()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                return await list(req.body.name);
            },
        }),
} as TRoute;
