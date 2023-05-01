import { Before } from '@cucumber/cucumber';

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
const { expect } = require('chai');

new Hooks();
async function sleep(ms: number) {
    return await new Promise((res) => setTimeout(res, ms));
}

@binding()
export class UserSteps {
    private cachedResponse: { response: any; body: any } = {
        response: '',
        body: '',
    };

    @given(/^(?:I am|They are|He is|She is) a registered user$/)
    public async RegisteredUser() {
        if (
            (await prisma.uzytkownik.findFirst({
                where: { mail: Constants.userEmail },
            })) == null
        ) {
            console.log('Test user does not exist. Creating...');
            await create(
                Constants.userEmail,
                Constants.userPassword,
                Constants.userName,
                Constants.userAddress,
            );
            await prisma.uzytkownik.update({
                where: { mail: Constants.userEmail },
                data: { aktywacja: '1' },
            });
        } else console.log('Test user exists already. Proceeding...');
    }

    @when(
        /^(?:I try|They try|He tries|She tries) to log in using (?:my|their|his|hers) credentials$/,
    )
    public async LogIn() {
        let r = await req(Constants.serverUrl + '/api/user', 'GET', {
            mail: Constants.userEmail,
            password: Constants.userPassword,
        });
        expect(r.response.statusCode).to.eql(200);
        expect(r.body.response.error).to.eql('pin required');

        let user = await prisma.uzytkownik.findFirst({
            where: { mail: Constants.userEmail },
        });
        expect(user).to.not.eql(null);
        // @ts-ignore
        let pin: number = user.pin;

        this.cachedResponse = await req(
            Constants.serverUrl + '/api/user',
            'GET',
            {
                mail: Constants.userEmail,
                password: Constants.userPassword,
                pin: pin,
            },
        );

        await sleep(14);
    }

    @when(
        /^(?:I try|They try|He tries|She tries) to log in using wrong credentials$/,
    )
    public async LogInBadCredentials() {
        this.cachedResponse = await req(
            Constants.serverUrl + '/api/user',
            'GET',
            {
                mail: Constants.userEmail,
                password: Constants.userWrongPassword,
            },
        );
    }

    @then(/^(?:My|their|His|Her) login attempt is successful$/)
    public async LogInAttemptSuccessful() {
        expect(this.cachedResponse.response.statusCode).to.eql(200);
    }

    @then(/^(?:my|their|his|her) login attempt is unsuccessful$/)
    public async LogInAttemptUnsuccessful() {
        expect(this.cachedResponse.response.statusCode).to.eql(400);
    }

    @then(/^(?:I'm|They're|He's|She's) given a login token to use later$/)
    public async LoginToken() {
        expect(this.cachedResponse.body.response.token.length).to.be.above(4);
    }
}
