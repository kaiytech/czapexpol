import { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TRoute } from '../types';
import { handleRequest } from '../../utils/request.utils';
import { edit } from '../../functions/users';
import { authorize } from '../../utils/middleware.utils';
import { IsAdmin } from '../../functions/validation';
import { AuthorizationError, ValidationError } from '../../utils/customErrors';
import { prisma } from '../../database';

const errorCode = StatusCodes.BAD_GATEWAY;

export default {
    method: 'put',
    path: '/api/user',
    validators: [authorize, body('id').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseDefaultStatus: StatusCodes.OK,
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
                    return edit(
                        user[0].id,
                        req.body.password,
                        req.body.mail,
                        req.body.pin,
                        req.body.token,
                        req.body.loginToken,
                        req.body.imienazwisko,
                        req.body.adres,
                        req.body.czysprzedawca,
                        req.body.czyAdmin,
                    );
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
                    return edit(
                        user[0].id,
                        req.body.password,
                        req.body.mail,
                        undefined,
                        undefined,
                        undefined,
                        req.body.imienazwisko,
                        req.body.adres,
                        req.body.czysprzedawca,
                        undefined,
                    );
                }
            },
        }),
} as TRoute;
