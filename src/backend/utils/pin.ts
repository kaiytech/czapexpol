import { prisma } from '../database';

export async function generatePIN(userid: number) {
    const pin = Math.floor(1000 + Math.random() * 9000);
    const user = await prisma.uzytkownik.update({
        where: { id: userid },
        data: { pin: pin },
    });

    return pin;
}
export async function deletePin(userid: number) {
    const user = await prisma.uzytkownik.update({
        where: { id: userid },
        data: { pin: null },
    });

    return user;
}
