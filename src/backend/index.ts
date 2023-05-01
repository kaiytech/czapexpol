import { startServer } from './server';
import { config } from './config';
import { prisma } from './database';
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
