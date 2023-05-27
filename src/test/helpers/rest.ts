import * as http from 'http';

const request = require('request');
const { expect } = require('chai');

export function req(
    url: string,
    method: string,
    body: object,
    authToken: string = '',
): Promise<{ response: any; body: any }> {
    expect(method).to.be.oneOf(['POST', 'GET', 'PUT', 'DELETE']);
    return new Promise((resolve, reject) => {
        console.log(
            `Performing ${method} request to ${url} with body of ${JSON.stringify(
                body,
            ).trim()}...`,
        );
        if (authToken != '') console.log(`...and auth token of: ${authToken}`);
        request(
            {
                url: url,
                method: method,
                headers: {
                    'content-type': 'application/json',
                    Authorization: authToken,
                },
                body: body,
                json: true,
            },
            function (error: string, response: any, body: string) {
                if (error) {
                    console.log(`Request finished with error => ${error}`);
                    reject(
                        new Error(
                            `${method} request to ${url} has failed with => ${error}`,
                        ),
                    );
                } else {
                    console.log(
                        `Request finished with code ${response.statusCode}`,
                    );
                    console.log(
                        `Request response body: ${JSON.stringify(
                            response.body,
                        ).trim()}`,
                    );
                    resolve({ response, body });
                }
            },
        );
    });
}
