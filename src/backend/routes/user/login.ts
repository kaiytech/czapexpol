import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { login } from '../../functions/users';

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
                return login(req.body.mail, req.body.password, req.body.pin);
            },
        }),
} as TRoute;