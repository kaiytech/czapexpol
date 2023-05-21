import { prisma } from '../database';
import { ExistError, ValidationError } from '../utils/customErrors';

export async function create(who: number, whom: number, stars: number) {
    const ocena = await prisma.ocena.findFirst({
        where: { ktoId: who, komuId: whom },
    });
    if (!ocena) {
        return await prisma.ocena.create({
            data: {
                ktoId: who,
                komuId: whom,
                gwiazdki: stars,
                zaakceptowana: false,
            },
        });
    } else {
        throw new ExistError('Rating exist.');
    }
}
export async function list(whom?: number) {
    if (whom) {
        return await prisma.ocena.findMany({ where: { komuId: whom } });
    } else {
        return await prisma.ocena.findMany();
    }
}
export async function edit(
    who: number,
    whom: number,
    accept?: boolean,
    stars?: number,
) {
    const rating = await prisma.ocena.findFirst({
        where: { ktoId: who, komuId: whom },
    });
    if (!rating) throw new ValidationError('Rating not found.');

    interface UpdateRatingData {
        ktoId?: number;
        komuId?: number;
        gwiazdki?: number;
        zaakceptowana?: boolean;
    }

    const data: UpdateRatingData = {};
    if (who) data.ktoId = who;
    if (whom) data.komuId = whom;
    if (stars) data.gwiazdki = stars;
    if (accept) data.zaakceptowana = accept;

    return await prisma.ocena.update({
        where: { id: rating.id },
        data: data,
    });
}
