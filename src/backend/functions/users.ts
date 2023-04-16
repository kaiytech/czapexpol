import { createHash } from '../utils/hash.utils';
import { prisma } from '../database';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { createToken } from '../utils/jwt.utils';
import { SALT, SECRET } from '../config';
import { Prisma } from '@prisma/client';
import { ValidationError } from '../utils/customErrors';

export async function login(mail: string, password: string, pin?: number) {
    const passwordHash = createHash(password, SALT);
    const user = await prisma.uzytkownik.findFirst({ where: { mail } });
    const passwordValid = user ? user.password === passwordHash : false;
    if (!user) throw new ValidationError('User not found.');
    if (!passwordValid) throw new ValidationError('Incorrect password');

    let loginToken = createToken(
        { mail: user.mail, password: user.password },
        SECRET,
        '7d',
    );
    await prisma.uzytkownik.update({
        where: { mail: mail },
        data: { loginToken: loginToken },
    });

    return {
        token: loginToken,
    };
}

export async function create(
    mail: string,
    password: string,
    imienazwisko: string,
    adres: string,
) {
    const user = await prisma.uzytkownik.findFirst({ where: { mail } });
    const passwordHash = createHash(password, SALT);
    return prisma.uzytkownik.create({
        data: {
            mail: mail,
            password: passwordHash,
            imienazwisko: imienazwisko,
            adres: adres,
            czysprzedawca: false,
            czyAdmin: false,
        },
    });
}

export async function edit(mail: string) {}
