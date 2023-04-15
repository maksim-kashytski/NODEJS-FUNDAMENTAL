import { routerGroups } from '../groups.controller';
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
mockApp.use('/groups', routerGroups);

const groupOne = {
    name: 'mockGroup1',
    permissions: ['READ', 'WRITE']
};

const groupSecond = {
    name: 'mockGroup2',
    permissions: ['READ', 'WRITE', 'DELETE']
};

const addUsersToGroup = {
    userIds: ['1', '2', '3']
};

let groupId: string;

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

test('should get groups', async () => {
    await request(mockApp)
        .get('/groups')
        .expect((res: Response) => {
            expect(res.body.length).toBeGreaterThan(0);
        });
});

test('add a new group', async () => {
    await request(mockApp)
        .post('/groups')
        .send(groupOne)
        .expect(200)
        .expect((res: Response) => {
            expect(res.body.id).toBeTruthy();
            groupId = res.body.id;
        });
});

test('Get a certain group', async () => {
    await request(mockApp)
        .get(`/groups/${groupId}`)
        .expect(200)
        .expect((res: Response) => {
            expect(res.body.name).toBe(groupOne.name);
            expect(res.body.permissions).toStrictEqual(groupOne.permissions);
        });
});

test('update a certain group', async () => {
    await request(mockApp)
        .put(`/groups/${groupId}`)
        .send({ id: groupId, ...groupSecond })
        .expect(200);
});

test('add new users to group', async () => {
    await request(mockApp)
        .post(`/groups/${groupId}/add-users`)
        .send(addUsersToGroup)
        .expect(200);
});

it('Delete a certain group', async () => {
    await request(mockApp)
        .delete(`/groups/${groupId}`)
        .expect(200);
});
