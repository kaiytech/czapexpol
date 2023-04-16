import { prisma } from '../database';
import { create } from './users';

export async function IsAdmin(token?: string) {
    if (token == null) return false;
    const found = await prisma.uzytkownik.findMany({
        where: { loginToken: token },
    });
    if (found.length == 0) {
        return false;
    }
    return found[0].czyAdmin;
}
