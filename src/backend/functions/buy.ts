import { prisma } from '../database';
import { ValidationError } from '../utils/customErrors';
import { deleteCart } from './cart';

export async function buyCart(userid: number) {
    let finalbuy = [];
    const products = await prisma.koszyk.findMany({
        where: { uzytkownikId: userid },
    });
    const DataZakupy = new Date(Date.now());
    for (let i = 0; i < products.length; i++) {
        const produkt = await prisma.produkt.findFirst({
            where: { id: products[i].produktId },
        });
        if (!produkt) {
            throw new ValidationError('Product not found.');
        }
        const zakup = await prisma.zakup.create({
            data: {
                uzytkownikId: products[i].uzytkownikId,
                produktId: products[i].produktId,
                ile: products[i].ile,
                cena: produkt.cena,
                dataZakupu: DataZakupy,
            },
        });
        console.log(zakup);
        console.log(products[i]);
        if (zakup) {
            finalbuy.push(zakup);
            deleteCart(products[i].id);
        }
    }
    return finalbuy;
}
export async function list(userid: number) {
    const products = await prisma.zakup.findMany({
        where: { uzytkownikId: userid },
    });
    return await products;
}
