import { prisma } from '../database';
import { ExistError, ValidationError } from '../utils/customErrors';

export async function create(who: number, whos: number, stars: number) {
    const ocena = await prisma.ocena.findFirst({
        where: { ktoId: who, komuId: whos },
    });
    if (!ocena) {
        return await prisma.ocena.create({
            data: {
                ktoId: who,
                komuId: whos,
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
