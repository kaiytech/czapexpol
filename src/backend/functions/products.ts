import { prisma } from '../database';
import { ValidationError } from '../utils/customErrors';

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
export async function list(id?: number, query?: string) {
    if (id) {
        return prisma.produkt.findFirst({ where: { id: id } });
    } else if (query) {
        return prisma.produkt.findMany({
            where: {
                nazwa: {
                    contains: query,
                },
            },
        });
    } else {
        return prisma.produkt.findMany();
    }
}

export async function edit(
    id: number,
    name?: string,
    category?: string,
    user?: number,
    quantity?: number,
    price?: number,
    desc?: string,
    photo?: string,
) {
    const product = await prisma.produkt.findFirst({ where: { id } });
    if (!product) throw new ValidationError('Product not found.');

    interface UpdateProductData {
        nazwa?: string;
        opis?: string;
        zdjecie?: string;
        kategoriaId?: string;
        wlascicielId?: number;
        stan?: number;
        cena?: number;
    }

    const data: UpdateProductData = {};
    if (name) data.nazwa = name;
    if (category) data.kategoriaId = category;
    if (user) data.wlascicielId = user;
    if (quantity) data.stan = quantity;
    if (price) data.cena = price;
    if (desc) data.opis = desc;
    if (photo) data.zdjecie = photo;

    return await prisma.produkt.update({
        where: { id },
        data: data,
    });
}
