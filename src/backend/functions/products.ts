import { prisma } from '../database';

export async function create(
    name: string,
    category: string,
    user: number,
    quantity: number,
    price: number,
    desc?: string,
    photo?: string,
) {
    if (!desc) {
        desc = 'null';
    }
    if (!photo) {
        photo = 'null';
    }
    return prisma.produkt.create({
        data: {
            nazwa: name,
            opis: desc,
            zdjecie: photo,
            kategoriaId: category,
            wlascicielId: user,
            stan: quantity,
            cena: price,
        },
    });
}
export async function deleteProduct(id: number) {
    return prisma.produkt.delete({ where: { id: id } });
}
export async function list(id?: number) {
    if (id) {
        return prisma.produkt.findFirst({ where: { id: id } });
    } else {
        return prisma.produkt.findMany();
    }
}
