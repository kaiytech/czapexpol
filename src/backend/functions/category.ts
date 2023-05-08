import { prisma } from '../database';
import { ValidationError } from '../utils/customErrors';

export async function create(name: string) {
    return await prisma.kategoria.create({
        data: {
            nazwa: name,
        },
    });
}
export async function catDelete(name: string) {
    return await prisma.kategoria.delete({ where: { nazwa: name } });
}

export async function list(name?: string) {
    if (name) {
        return await prisma.kategoria.findMany({ where: { nazwa: name } });
    } else {
        return await prisma.kategoria.findMany();
    }
}

export async function edit(name: string, newname?: string) {
    const category = await prisma.kategoria.findFirst({
        where: { nazwa: name },
    });
    if (!category) throw new ValidationError('Category not found.');

    interface UpdateCategoryData {
        nazwa?: string;
    }

    const data: UpdateCategoryData = {};
    if (newname) data.nazwa = newname;

    return await prisma.kategoria.update({
        where: { nazwa: name },
        data: data,
    });
}
