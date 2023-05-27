import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { checkPrismaError, TPrismaErrorDescriptions } from './prisma.utils';

import { Prisma } from '@prisma/client';
import { AuthorizationError, ValidationError } from './customErrors';

export type TRequestData<Entity> = {
    req: Request;
    res: Response;
    execute: () => Promise<Entity | Entity[]>;
    responseDefaultStatus?: number;
    messages?: TPrismaErrorDescriptions;
};

export const handleRequest = async <Entity>({
    req,
    res,
    execute,
    responseDefaultStatus,
    messages,
}: TRequestData<Entity>) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let outMsg = '';
        errors.array().forEach(function (error) {
            // @ts-ignore
            outMsg += error.path;
            outMsg += ': ';
            outMsg += error.msg;
            outMsg += '; ';
        });

        return res.status(StatusCodes.BAD_REQUEST).json({ error: outMsg });
    }

    if (responseDefaultStatus != null) res.status(responseDefaultStatus);

    try {
        const result = await execute();
        // handled exceptions:
        // good:
        if (isStatusCodeGood(res.statusCode))
            res.status(res.statusCode).json({
                response: result,
            });
        // bad:
        else
            res.status(res.statusCode).json({
                error: result,
            });
    } catch (e) {
        // unhandled exceptions:
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            const err = e.message.split(/\r?\n/);
            res.status(StatusCodes.BAD_REQUEST).json({
                error: err[err.length - 1],
            });
        } else if (e instanceof ValidationError) {
            res.status(StatusCodes.BAD_REQUEST).json({
                error:
                    e.message == null || e.message == ''
                        ? StatusCodes[res.statusCode]
                        : e.message,
            });
        } else if (e instanceof AuthorizationError) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error:
                    e.message == null || e.message == ''
                        ? StatusCodes[res.statusCode]
                        : e.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: (e as Error).message,
            });
        }
    }

    res.send();
};

export function isStatusCodeGood(code: number) {
    return code.toString()[0] == '2';
}
