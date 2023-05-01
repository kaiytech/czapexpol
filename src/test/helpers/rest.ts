import * as http from 'http';

const request = require('request');
const { expect } = require('chai');

export function req(
    url: string,
    method: string,
    body: object,
): Promise<{ response: any; body: any }> {
    expect(method).to.be.oneOf(['POST', 'GET', 'PUT', 'DELETE']);
    return new Promise((resolve, reject) => {
        console.log(`Performing ${method} request to ${url}...`);
        request(
            {
                url: url,
                method: method,
                headers: { 'content-type': 'application/json' },
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
                    resolve({ response, body });
                }
            },
        );
    });
}
