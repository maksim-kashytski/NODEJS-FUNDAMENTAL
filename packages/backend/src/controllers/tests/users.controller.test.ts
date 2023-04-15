import { routerUsers } from '../users.controller';
import { UserCreationAttributes } from '../../types/user.interface';
import request, { Response } from 'supertest';
import express from 'express';
import { sequelize } from '../../data-access/database.connection';
import { User } from '../../models/user.model-definition';
import { Group } from '../../models/group.model-definition';
import { UserGroup } from '../../models/user-group.model-definition';
import * as bodyParser from 'body-parser';
import * as http from 'http';

const port = process.env.PORT || 3000;
const mockApp = express();
let server: http.Server;
mockApp.use(bodyParser.json());
mockApp.use('/users', routerUsers);

beforeAll(async () => {
    await sequelize.authenticate().then(async () => {
        await User.sync();
        await Group.sync();
        await UserGroup.sync();
        User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId' });
        Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId' });
        server = await mockApp.listen(port);
    }).catch(err => console.log(err));
});

afterAll(async () => {
    await server.close();
});

const newUser: UserCreationAttributes = {
    login: 'Autotests',
    password: 'Password123',
    age: 18,
    isDeleted: false
};

const secondNewUser: UserCreationAttributes = {
    login: 'HelloWorld',
    password: 'Password123',
    age: 33,
    isDeleted: false
};

let newUserId: number;

test('should get users', async () => {
    await request(mockApp)
        .get('/users')
        .expect((res: Response) => {
            expect(res.body.length).toBeGreaterThan(0);
        });
});

test('should get 200', async () => {
    await request(mockApp)
        .get('/users')
        .expect(200);
});

test('should add a user', async () => {
    await request(mockApp)
        .post('/users')
        .send(newUser)
        .expect((res: Response) => {
            expect(res.body.id).toBeTruthy();
            newUserId = res.body.id;
        });
});

test('should get a user', async () => {
    await request(mockApp)
        .get(`/users/${newUserId}`)
        .expect((res: Response) => {
            expect(res.body.login).toBe(newUser.login);
            expect(res.body.password).toBe(newUser.password);
            expect(res.body.age).toBe(newUser.age);
        });
});

test('update a user', async () => {
    await request(mockApp)
        .put(`/users/${newUserId}`)
        .send({ id: newUserId, ...secondNewUser })
        .expect(200);
});

test('should delete a user', async () => {
    await request(mockApp)
        .del(`/users/${newUserId}`)
        .expect(204);
});
