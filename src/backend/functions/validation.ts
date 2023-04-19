import { prisma } from '../database';

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
export async function IsSeller(token?: string) {
    if (token == null) return false;
    const found = await prisma.uzytkownik.findMany({
        where: { loginToken: token },
    });
    if (found.length == 0) {
        return false;
    }
    return found[0].czysprzedawca;
}
