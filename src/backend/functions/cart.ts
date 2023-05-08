import { prisma } from '../database';
import { ValidationError } from '../utils/customErrors';

export async function create(
    productid: number,
    usermail: string,
    count: number,
) {
    const user = await prisma.uzytkownik.findFirst({
        where: { mail: usermail },
    });
    if (!user) throw new ValidationError('User not found.');

    return prisma.koszyk.create({
        data: {
            produktId: productid,
            uzytkownikId: user.id,
            ile: count,
            ostatnioprzypomniany: new Date(Date.now()),
        },
    });
}
export async function list(usermail: string) {
    const user = await prisma.uzytkownik.findFirst({
        where: { mail: usermail },
    });
    if (!user) throw new ValidationError('User not found.');

    return prisma.koszyk.findMany({ where: { uzytkownikId: user.id } });
}
export async function deleteCart(id: number) {
    const cart = await prisma.koszyk.findFirst({
        where: { id },
    });
    if (!cart) throw new ValidationError('Cart not found.');

    return prisma.koszyk.delete({ where: { id } });
}
