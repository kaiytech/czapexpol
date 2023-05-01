import { API_PORT } from '../../backend/config';

export class Constants {
    static serverUrl: string = `http://localhost:${API_PORT}`;

    static userEmail: string = 'user@user.com';
    static userPassword: string = 'pass';
    static userWrongPassword: string = 'p@ss';
    static userName: string = 'User Userowski';
    static userAddress: string = 'Userowa 14, Userowo 80-555';
}
