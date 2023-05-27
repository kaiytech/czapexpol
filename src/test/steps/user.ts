import { Before, Given, Then, When } from '@cucumber/cucumber';

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

    private cachedPin: number = 0;
    private cachedToken: string = '';

    @when(/^(?:I am|They are|He is|She is) a logged in user$/)
    public async LoggedInUser() {
        await this.RegisteredUser();
        await this.LogIn();
    }

    @given(/^(?:I am|They are|He is|She is) a registered user$/)
    public async RegisteredUser() {
        if (
            (await prisma.uzytkownik.findFirst({
                where: { mail: Constants.userEmail },
            })) != null
        ) {
            console.log('Test user exists. Deleting...');
            await prisma.uzytkownik.delete({
                where: { mail: Constants.userEmail },
            });
        }

        console.log('Creating test user...');
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
        this.cachedPin = user.pin;

        this.cachedResponse = await req(
            Constants.serverUrl + '/api/user',
            'GET',
            {
                mail: Constants.userEmail,
                password: Constants.userPassword,
                pin: this.cachedPin,
            },
        );

        this.cachedToken = this.cachedResponse.response.body.response.token;

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
    @then(/^the operation is successful$/)
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

    @when(
        /^(?:I attempt|They attempt|He attempts|She attempts) to set (?:my|their|his|hers) "([^"]*)" to "([^"]*)"$/,
    )
    public async SetAccountDetails(val1: any, val2: any) {
        const u = await prisma.uzytkownik.findFirst({
            where: { mail: Constants.userEmail },
        });
        expect(u).to.not.eql(null);
        if (u == null) return; // to sie nigdy nie wydarzy, chce tylko zadowolic analyzera ~K
        let body = {};
        switch (val1) {
            case 'email':
                body = { id: u.id, mail: val2 };
                break;
            case 'imienazwisko':
                body = { id: u.id, imienazwisko: val2 };
                break;
            case 'adres':
                body = { id: u.id, adres: val2 };
                break;
            case 'czysprzedawca':
                body = { id: u.id, czysprzedawca: val2 };
                break;
        }

        this.cachedResponse = await req(
            Constants.serverUrl + '/api/user',
            'PUT',
            body,
            this.cachedToken,
        );
    }

    @then(/^the "([^"]*)" is indeed "([^"]*)"$/)
    public async ValidateAccountDetails(val1: any, val2: any) {
        let user = await prisma.uzytkownik.findFirst({
            where: { mail: Constants.userEmail },
        });
        expect(user).to.not.eql(null);

        switch (val1) {
            case 'email':
                // @ts-ignore
                expect(user.mail).to.eq(val2);
                break;
            case 'imienazwisko':
                // @ts-ignore
                expect(user.imienazwisko).to.eq(val2);
                break;
            case 'adres':
                // @ts-ignore
                expect(user.adres).to.eq(val2);
                break;
            case 'czysprzedawca':
                // @ts-ignore
                expect(user.czysprzedawca).to.eq(val2);
                break;
        }
    }

    @when(
        /^(?:I attempt|They attempt|He attempts|She attempts) to change (?:my|their|his|hers) password to "([^"]*)"$/,
    )
    public async ChangePassword(password: string) {
        const u = await prisma.uzytkownik.findFirst({
            where: { mail: Constants.userEmail },
        });
        expect(u).to.not.eql(null);
        if (u == null) return; // to sie nigdy nie wydarzy, chce tylko zadowolic analyzera ~K

        this.cachedResponse = await req(
            Constants.serverUrl + '/api/user',
            'PUT',
            { id: u.id, password: password },
            this.cachedToken,
        );
    }

    @then(
        /^(?:I am|They are|He is|She is) able to log back in with password "([^"]*)" after logging out$/,
    )
    public async LogInWithPassword(password: string) {
        let r = await req(Constants.serverUrl + '/api/user', 'GET', {
            mail: Constants.userEmail,
            password: password,
        });
    }

    @when(
        /^(?:I attempt|They attempt|He attempts|She attempts) to delete (?:my|their|his|hers) account$/,
    )
    public async DeleteAccount() {
        const u = await prisma.uzytkownik.findFirst({
            where: { mail: Constants.userEmail },
        });
        expect(u).to.not.eql(null);
        if (u == null) return; // to sie nigdy nie wydarzy, chce tylko zadowolic analyzera ~K

        let r = await req(
            Constants.serverUrl + '/api/user',
            'DELETE',
            {
                id: u.id,
            },
            this.cachedToken,
        );
    }

    @then(/^(?:my|their|his|hers) account is indeed deleted$/)
    public async AccountShouldNotExist() {
        const u = await prisma.uzytkownik.findFirst({
            where: { mail: Constants.userEmail },
        });
        expect(u).to.eql(null);
    }
}
