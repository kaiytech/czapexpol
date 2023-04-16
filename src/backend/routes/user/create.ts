import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { create } from '../../functions/users';
import { authorize } from '../../utils/middleware.utils';
import { prisma } from '../../database';
import { IsAdmin } from '../../functions/validation';

export default {
    method: 'post',
    path: '/api/user/create',
    validators: [
        authorize,
        body('mail').isEmail(),
        body('password').not().isEmpty(),
        body('imienazwisko').not().isEmpty(),
        body('adres').not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: {
                uniqueConstraintFailed: 'Email must be unique.',
            },
            execute: async () => {
                if (await IsAdmin(req.headers.authorization)) {
                    return create(
                        req.body.mail,
                        req.body.password,
                        req.body.imienazwisko,
                        req.body.adres,
                    );
                }
                res.status(401);
                return { data: { error: 'Not authorised' } };
            },
        }),
} as TRoute;
