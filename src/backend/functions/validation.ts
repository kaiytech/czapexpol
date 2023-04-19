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
export async function IsVerified(mail?: string) {
    if (mail == null) return false;
    const found = await prisma.uzytkownik.findMany({
        where: { mail: mail },
    });
    if (found.length == 0) {
        return false;
    } else return found[0].aktywacja == '1';
}
