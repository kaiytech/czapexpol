import { prisma } from '../database';
import { ValidationError } from '../utils/customErrors';

export async function create(
    productid: number,
    usermail: string,
    count: number,
) {
    const user = await prisma.uzytkownik.findFirst({
        where: { mail: usermail },
    });
    if (!user) throw new ValidationError('User not found.');

    return prisma.koszyk.create({
        data: {
            produktId: productid,
            uzytkownikId: user.id,
            ile: count,
            ostatnioprzypomniany: new Date(Date.now()),
        },
    });
}
