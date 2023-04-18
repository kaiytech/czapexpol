import { prisma } from '../database';

export async function create(name: string) {
    return prisma.kategoria.create({
        data: {
            nazwa: name,
        },
    });
}
