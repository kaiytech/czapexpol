import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest, TCustomError } from '../../utils/request.utils';
import { login } from '../../functions/users';

export default {
    method: 'get',
    path: '/api/user/login',
    validators: [
        body('mail').isEmail(),
        body('password').not().isEmpty(),
        body('pin').isNumeric().optional(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            responseFailStatus: StatusCodes.UNAUTHORIZED,
            execute: async () => {
                return login(req.body.mail, req.body.password, req.body.pin);
            },
        }),
} as TRoute;
