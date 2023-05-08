import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { login } from '../../functions/users';
import { ValidationError } from '../../utils/customErrors';
import { IsVerified } from '../../functions/validation';

export default {
    method: 'get',
    path: '/api/user',
    validators: [
        body('mail').isEmail(),
        body('password').not().isEmpty(),
        body('pin').isNumeric().optional(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
            execute: async () => {
                if (await IsVerified(req.body.mail)) {
                    return await login(
                        req.body.mail,
                        req.body.password,
                        req.body.pin,
                    );
                } else {
                    throw new ValidationError('User not Verified.');
                }
            },
        }),
} as TRoute;
