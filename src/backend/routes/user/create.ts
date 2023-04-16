import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { create } from '../../functions/users';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin } from '../../functions/validation';
import { AuthorizationError } from '../../utils/customErrors';

var errorCode = StatusCodes.BAD_GATEWAY;

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
            responseDefaultStatus: StatusCodes.CREATED,
            execute: async () => {
                if (await IsAdmin(req.headers.authorization)) {
                    return await create(
                        req.body.mail,
                        req.body.password,
                        req.body.imienazwisko,
                        req.body.adres,
                    );
                }
                throw new AuthorizationError();
            },
        }),
} as TRoute;
