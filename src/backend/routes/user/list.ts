import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { list } from '../../functions/users';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin } from '../../functions/validation';

export default {
    method: 'get',
    path: '/api/users',
    validators: [authorize],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                if (await IsAdmin(req.headers.authorization)) {
                    return await list();
                }
            },
        }),
} as TRoute;
