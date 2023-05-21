import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { create } from '../../functions/rating';
import { authorize } from '../../utils/middleware.utils';

export default {
    method: 'post',
    path: '/api/rating',
    validators: [
        authorize,
        body('who').not().isEmpty(),
        body('whom').not().isEmpty(),
        body('stars').isNumeric().not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.CREATED,
            execute: async () => {
                return await create(
                    req.body.who,
                    req.body.whom,
                    req.body.stars,
                );
            },
        }),
} as TRoute;
