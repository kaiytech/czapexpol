import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { edit } from '../../functions/category';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin } from '../../functions/validation';
import { AuthorizationError } from '../../utils/customErrors';

export default {
    method: 'put',
    path: '/api/category',
    validators: [authorize, body('name').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                if (await IsAdmin(req.headers.authorization)) {
                    return await edit(req.body.name, req.body.newname);
                } else {
                    throw new AuthorizationError('Insufficient permissions.');
                }
            },
        }),
} as TRoute;
