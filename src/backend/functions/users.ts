import { createHash } from '../utils/hash.utils';
import { prisma } from '../database';
import { createToken } from '../utils/jwt.utils';
import { activateSALT, SALT, SECRET } from '../config';
import { ValidationError } from '../utils/customErrors';
import { sendmail } from '../utils/mail';
import { deletePin, generatePIN } from '../utils/pin';

export async function login(mail: string, password: string, pin?: number) {
    const passwordHash = createHash(password, SALT);
    const user = await prisma.uzytkownik.findFirst({ where: { mail } });
    const passwordValid = user ? user.password === passwordHash : false;
    if (!user) throw new ValidationError('User not found.');
    if (!passwordValid) throw new ValidationError('Incorrect password');

    if (!pin) {
        const responsepin = await generatePIN(user.id);
        sendmail(
            mail,
            'Weryfikacja dwuetapowa czapexpol',
            `twoj kod pin to ${responsepin}`,
            `twoj kod pin to <b>${responsepin}</b>`,
        );
        return {
            error: 'pin required',
        };
    } else if (pin == user.pin) {
        const loginToken = createToken(
            { mail: user.mail, password: user.password },
            SECRET,
            '7d',
        );

        const u = await prisma.uzytkownik.findFirst({ where: { mail: mail } });
        if (!u) throw new ValidationError('User not found.');
        await edit(
            u.id,
            undefined,
            undefined,
            undefined,
            undefined,
            loginToken,
        );
        await deletePin(user.id);
        return {
            token: loginToken,
        };
    } else {
        throw new ValidationError('Bad PIN.');
    }
}

export async function create(
    mail: string,
    password: string,
    imienazwisko: string,
    adres: string,
) {
    const passwordHash = createHash(password, SALT);
    const token = createHash(mail, activateSALT);
    sendmail(
        mail,
        `User Account Verification for user ${mail}`,
        `Click this link to activate: http://localhost:3000/api/user/verify/${token}`,
        `Click this link to activate: <a href='http://localhost:3000/api/user/verify/${token}'>LINK</a>`,
    );
    return await prisma.uzytkownik.create({
        data: {
            mail: mail,
            password: passwordHash,
            imienazwisko: imienazwisko,
            adres: adres,
            czysprzedawca: false,
            czyAdmin: false,
            aktywacja: token,
        },
    });
}

export async function edit(
    id: number,
    aktywacja?: string,
    password?: string,
    mail?: string,
    pin?: number,
    loginToken?: string,
    imienazwisko?: string,
    adres?: string,
    czysprzedawca?: boolean,
    czyAdmin?: boolean,
) {
    const user = await prisma.uzytkownik.findFirst({ where: { id } });
    if (!user) throw new ValidationError('User not found.');

    interface UpdateUserData {
        aktywacja?: string;
        password?: string;
        mail?: string;
        pin?: number;
        loginToken?: string;
        imienazwisko?: string;
        adres?: string;
        czysprzedawca?: boolean;
        czyAdmin?: boolean;
    }

    const data: UpdateUserData = {};
    if (aktywacja) data.aktywacja = aktywacja;
    if (password) data.password = createHash(password, SALT);
    if (mail) data.mail = mail;
    if (pin) data.pin = pin;
    if (loginToken) data.loginToken = loginToken;
    if (imienazwisko) data.imienazwisko = imienazwisko;
    if (adres) data.adres = adres;
    if (czysprzedawca) data.czysprzedawca = czysprzedawca;
    if (czyAdmin) data.czyAdmin = czyAdmin;

    return await prisma.uzytkownik.update({
        where: { id },
        data: data,
    });
}

export async function userDelete(id: number) {
    const user = await prisma.uzytkownik.findFirst({ where: { id } });
    if (!user) throw new ValidationError('User not found.');

    return await prisma.uzytkownik.delete({
        where: { id },
    });
}

export async function list() {
    const users = await prisma.uzytkownik.findMany();

    return users;
}
export async function verify(token: string) {
    const user = await prisma.uzytkownik.findFirst({
        where: { aktywacja: token },
    });
    if (user) {
        await edit(user.id, '1');
        return '<h1>User Successfully Activated</h1>';
    } else {
        throw new ValidationError('Link is expired.');
    }
}
