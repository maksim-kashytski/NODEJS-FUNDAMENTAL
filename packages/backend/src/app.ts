import express, { Application, NextFunction, Request, Response } from 'express';
import { routerUsers } from './controllers/users.controller';
import * as bodyParser from 'body-parser';

import { sequelize } from './data-access/database.connection';
import { User } from './models/user.model-definition';
import { routerGroups } from './controllers/groups.controller';
import { Group } from './models/group.model-definition';
import { UserGroup } from './models/user-group.model-definition';
import { checkAccessToken } from './tokens';
import { routerAuth } from './controllers/auth.controller';
import cors from 'cors';

import { Logger, morganMiddleware } from './config';

const port = process.env.PORT || 3000;
const app: Application = express();

app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(cors());

app.use('', routerAuth);
app.use('/users', checkAccessToken, routerUsers);
app.use('/groups', checkAccessToken, routerGroups);

// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    Logger.error(
        `Method: ${req.method} / Arguments: ${JSON.stringify(req.query)} / Error: ${
            err.message
        }`,
    );
    res.status(500).json({
        message: err.message,
        stack: err.stack
    });
});

process
    .on('unhandledRejection', (reason, p) => {
        Logger.error(`${reason} Unhandled Rejection at Promise ${p}`);
    })
    .on('uncaughtException', err => {
        Logger.error(`${err} Uncaught Exception thrown`);
        process.exit(1);
    });

sequelize.authenticate().then(() => {
    User.sync().then();
    Group.sync().then();
    UserGroup.sync().then();
    User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId' });
    Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId' });
    app.listen(port, () => Logger.info(`server is running on port ${port}`));
}).catch(err => Logger.error(err));
