import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { edit, userDelete } from '../../functions/users';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin } from '../../functions/validation';
import { AuthorizationError, ValidationError } from '../../utils/customErrors';
import { prisma } from '../../database';

const errorCode = StatusCodes.BAD_GATEWAY;

export default {
    method: 'delete',
    path: '/api/user',
    validators: [authorize, body('id').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.CREATED,
            execute: async () => {
                if (await IsAdmin(req.headers.authorization)) {
                    let user;
                    try {
                        user = await prisma.uzytkownik.findMany({
                            where: { id: Number(req.body.id) },
                        });
                        if (user.length == 0) throw new Error();
                    } catch {
                        throw new ValidationError('User not found.');
                    }
                    return userDelete(user[0].id);
                } else {
                    let user;
                    try {
                        user = await prisma.uzytkownik.findMany({
                            where: {
                                loginToken: req.headers.authorization,
                                id: Number(req.body.id),
                            },
                        });
                        if (user.length == 0) throw new Error();
                    } catch {
                        throw new AuthorizationError(
                            'Insufficient permissions.',
                        );
                    }
                    return userDelete(user[0].id);
                }
            },
        }),
} as TRoute;
