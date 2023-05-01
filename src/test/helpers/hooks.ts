import * as http from 'http';

const { After, Before } = require('@cucumber/cucumber');
import { main } from '../../backend';
import { IncomingMessage, ServerResponse } from 'http';

export class Hooks {
    static s: null | http.Server<typeof IncomingMessage, typeof ServerResponse>;
    constructor() {
        Before(async function () {
            Hooks.s = await main();
        });

        After(function () {
            // workaround for Cucumber soft-lock bug ~K:
            setTimeout(function () {
                process.exit(1);
            }, 1000);
        });
    }
}
