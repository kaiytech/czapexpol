import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { catDelete } from '../../functions/category';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin } from '../../functions/validation';

const errorCode = StatusCodes.BAD_GATEWAY;

export default {
    method: 'delete',
    path: '/api/category',
    validators: [authorize, body('name').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.CREATED,
            execute: async () => {
                if (await IsAdmin(req.headers.authorization)) {
                    return catDelete(req.body.name);
                }
            },
        }),
} as TRoute;
