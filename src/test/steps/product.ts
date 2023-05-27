import { setDefaultTimeout } from '@cucumber/cucumber';

const { binding, given, when, then } = require('cucumber-tsflow');
import { Hooks } from '../helpers/hooks';
//import { binding, given, when, then } from 'cucumber-tsflow';
import { prisma } from '../../backend/database';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Constants } from '../helpers/constants';
import { create } from '../../backend/functions/users';
import { req } from '../helpers/rest';
import { main } from '../../backend';
import exp from 'constants';
import { UserSteps } from './user';
const { expect } = require('chai');

new Hooks();
async function sleep(ms: number) {
    return await new Promise((res) => setTimeout(res, ms));
}

setDefaultTimeout(60 * 1000);

@binding()
export class ProductSteps {
    private cachedResponse: { response: any; body: any } = {
        response: '',
        body: '',
    };

    @when(
        /^(?:I create|They create|He creates|She creates) a new product with name "([^"]*)", category "([^"]*)", quantity "([^"]*)" and price "([^"]*)"$/,
    )
    public async CreateProduct(
        name: string,
        category: string,
        quantity: string,
        price: string,
    ) {
        const u = await prisma.uzytkownik.findFirst({
            where: { mail: Constants.userEmail },
        });
        expect(u).not.be.eql(null);
        if (u == null) return;

        this.cachedResponse = await req(
            Constants.serverUrl + '/api/product',
            'POST',
            {
                user: u.id,
                name: name,
                category: category,
                quantity: quantity,
                price: price,
            },
            UserSteps.cachedToken,
        );
    }

    @then(/^the request is "([^"]*)"$/)
    public async CheckResult(expected: string) {
        if (expected == 'OK') {
            expect(this.cachedResponse.response.statusCode).to.eql(200);
            return;
        }
        expect(this.cachedResponse.body.response.token.length).to.be.above(4);
    }

    @when(
        /^(?:I request|They request|He requests|She requests) a list of all products$/,
    )
    public async GetListOfAllProducts() {
        this.cachedResponse = await req(
            Constants.serverUrl + '/api/product',
            'GET',
            {},
            UserSteps.cachedToken,
        );
    }

    @then(/^(?:I am|They are|He is|She is) given a list of all products$/)
    public async CheckListOfAllProducts() {
        expect(this.cachedResponse.response.body.response.length).to.be.above(
            0,
        );
    }
}
