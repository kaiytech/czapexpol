export class ValidationError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
export class ExistError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'ExistError';
    }
}
export class AuthorizationError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'AuthorizationError';
    }
}
