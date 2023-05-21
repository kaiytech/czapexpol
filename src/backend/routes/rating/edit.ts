import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { edit } from '../../functions/rating';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin } from '../../functions/validation';
import { AuthorizationError } from '../../utils/customErrors';

export default {
    method: 'put',
    path: '/api/rating',
    validators: [
        authorize,
        body('who').isNumeric().not().isEmpty(),
        body('whom').isNumeric().not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                if (await IsAdmin(req.headers.authorization)) {
                    return await edit(
                        req.body.who,
                        req.body.whom,
                        req.body.accept,
                        req.body.stars,
                    );
                } else {
                    throw new AuthorizationError('Insufficient permissions.');
                }
            },
        }),
} as TRoute;
