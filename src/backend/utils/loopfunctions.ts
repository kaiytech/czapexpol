import { prisma } from '../database';
import { sendmail } from './mail';

export async function mailer() {
    const dateOffset = 24 * 60 * 60 * 1000 * 7; //7 days
    const myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset);
    const mailtousers = await prisma.koszyk.findMany({
        where: {
            ostatnioprzypomniany: {
                lt: myDate,
            },
        },
    });
    for (let i = 0; i < mailtousers.length; i++) {
        const user = await prisma.uzytkownik.findFirst({
            where: { id: mailtousers[i].uzytkownikId },
        });
        if (user) {
            let mailtext: string = 'Wejdz i kup teraz zeby nie uckiekł';
            const produkt = await prisma.produkt.findFirst({
                where: { id: mailtousers[i].produktId },
            });
            if (produkt) mailtext += `<br>Kup już teraz ${produkt.nazwa}`;
            sendmail(
                user.mail,
                'Nie zapomniałes o swoim koszyku?',
                mailtext,
                mailtext,
            );
            await prisma.koszyk.update({
                where: { id: mailtousers[i].id },
                data: { ostatnioprzypomniany: new Date(Date.now()) },
            });
        }
    }
}
