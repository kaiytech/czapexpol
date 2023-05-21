import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { list } from '../../functions/rating';
import { authorize } from '../../utils/middleware.utils';
import { body } from 'express-validator';

export default {
    method: 'get',
    path: '/api/rating',
    validators: [authorize, body('whom').optional()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                return await list(req.body.whom);
            },
        }),
} as TRoute;
