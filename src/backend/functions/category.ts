import { prisma } from '../database';

export async function create(name: string) {
    return prisma.kategoria.create({
        data: {
            nazwa: name,
        },
    });
}
export async function catDelete(name: string) {
    return prisma.kategoria.delete({ where: { nazwa: name } });
}

export async function list(name?: string) {
    if (name) {
        return prisma.kategoria.findMany({ where: { nazwa: name } });
    } else {
        return prisma.kategoria.findMany();
    }
}
