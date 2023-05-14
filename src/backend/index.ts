import { startServer } from './server';
import { config } from './config';
import { prisma } from './database';
import { mailer } from './utils/loopfunctions';
export async function main() {
    return startServer(config.server);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
setInterval(mailer, 1000);
