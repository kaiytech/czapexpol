import { createHash } from '../utils/hash.utils';
import { prisma } from '../database';
import { createToken } from '../utils/jwt.utils';
import { SALT, SECRET } from '../config';
import { ValidationError } from '../utils/customErrors';

export async function login(mail: string, password: string, pin?: number) {
    const passwordHash = createHash(password, SALT);
    const user = await prisma.uzytkownik.findFirst({ where: { mail } });
    const passwordValid = user ? user.password === passwordHash : false;
    if (!user) throw new ValidationError('User not found.');
    if (!passwordValid) throw new ValidationError('Incorrect password');

    const loginToken = createToken(
        { mail: user.mail, password: user.password },
        SECRET,
        '7d',
    );

    const u = await prisma.uzytkownik.findFirst({ where: { mail: mail } });
    if (!u) throw new ValidationError('User not found.');
    await edit(u.id, undefined, undefined, undefined, undefined, loginToken);

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

export async function edit(
    id: number,
    password?: string,
    mail?: string,
    pin?: number,
    token?: string,
    loginToken?: string,
    imienazwisko?: string,
    adres?: string,
    czysprzedawca?: boolean,
    czyAdmin?: boolean,
) {
    const user = await prisma.uzytkownik.findFirst({ where: { id } });
    if (!user) throw new ValidationError('User not found.');

    interface UpdateUserData {
        password?: string;
        mail?: string;
        pin?: number;
        token?: string;
        loginToken?: string;
        imienazwisko?: string;
        adres?: string;
        czysprzedawca?: boolean;
        czyAdmin?: boolean;
    }

    const data: UpdateUserData = {};
    if (password) data.password = createHash(password, SALT);
    if (mail) data.mail = mail;
    if (pin) data.pin = pin;
    if (token) data.token = token;
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
