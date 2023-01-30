import { IUser } from '../models/user/user.types';

export class UserService {

    /**
     * Array that contains mocked data about users
     * @private users
     */
    private users: Array<IUser> = [
        {
            "id": 0,
            "login": "Login123",
            "password": "password",
            "age": 30,
            "isDeleted": false
        },
        {
            "id": 1,
            "login": "Wishperfect",
            "password": "password",
            "age": 21,
            "isDeleted": false
        },
        {
            "id": 2,
            "login": "Iofrench",
            "password": "password",
            "age": 66,
            "isDeleted": false
        },
        {
            "id": 3,
            "login": "Liliana",
            "password": "password",
            "age": 21,
            "isDeleted": false
        },
        {
            "id": 4,
            "login": "googleAcc",
            "password": "password",
            "age": 29,
            "isDeleted": false
        },
        {
            "id": 5,
            "login": "Freedom12",
            "password": "password",
            "age": 16,
            "isDeleted": false
        },
    ];

    /**
     * This method describes logic of getting user by id
     * @param id is string
     */
    public getUserById(id: string): IUser | undefined {
        return this.users.find((user: IUser) => user.id.toString() === id);
    }

    /**
     * This method describes logic of getting all users
     */
    public getAllUsers(): Array<IUser> {
        return this.users
            .filter((user: IUser) => !user.isDeleted)
            .sort((a: IUser, b: IUser) => a.login > b.login ? 1 : -1);
    }

    /**
     * This method describes logic of getting user by login
     * @param loginSubstring is string
     */
    public getAutoSuggestUsers(loginSubstring: string): Array<IUser> {
        return this.getAllUsers().filter((user: IUser) => user.login.toLowerCase().includes(loginSubstring));
    }

    /**
     * This method describes logic of adding user
     * @param newUser is Omit<IUser, 'id'>
     */
    public addUser(newUser: Omit<IUser, 'id'>): IUser {
        const newId = this.users.length;
        const user = {id: newId, ...newUser};
        this.users.push(user);
        return user;
    }

    /**
     * This method describes logic of updating user
     * @param targetUser is IUser
     * @param newValues is Partial<UserI>
     */
    public updateUser(targetUser: IUser, newValues: Partial<IUser>, ): IUser {
        return Object.assign(targetUser, newValues);
    }

    /**
     * This method describes logic of deleting user
     * @param user is IUser
     */
    public deleteUser(user: IUser): void {
        user.isDeleted = true;
    }
}
