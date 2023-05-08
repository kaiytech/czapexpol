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
    const cart = await prisma.koszyk.findFirst({
        where: { produktId: productid, uzytkownikId: user.id },
    });
    if (cart) {
        return await edit(cart.id, cart.ile + count, cart.ostatnioprzypomniany);
    }
    return await prisma.koszyk.create({
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

    return await prisma.koszyk.findMany({ where: { uzytkownikId: user.id } });
}
export async function deleteCart(id: number) {
    const cart = await prisma.koszyk.findFirst({
        where: { id },
    });
    if (!cart) throw new ValidationError('Cart not found.');

    return await prisma.koszyk.delete({ where: { id } });
}
export async function edit(
    id: number,
    quantity?: number,
    ostatnioprzypomniany?: Date,
) {
    const cart = await prisma.koszyk.findFirst({
        where: { id },
    });
    if (!cart) throw new ValidationError('Cart not found.');
    interface UpdateCartData {
        produktId?: number;
        uzytkownikId?: number;
        ile?: number;
        ostatnioprzypomniany?: Date;
    }

    const data: UpdateCartData = {};
    if (quantity) data.ile = quantity;
    if (ostatnioprzypomniany) data.ostatnioprzypomniany = ostatnioprzypomniany;

    return await prisma.koszyk.update({
        where: { id: id },
        data: data,
    });
}
