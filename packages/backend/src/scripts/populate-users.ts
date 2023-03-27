import { sequelize } from '../data-access/database.connection';
import { User } from '../models/user.model-definition';
import { UserCreationAttributes } from '../types/user.interface';

import { Logger } from '../config';

const defaultData: Array<UserCreationAttributes> =  [
    {
        'login': 'User1',
        'password': 'Password1',
        'age': 34,
        'isDeleted': false
    },
    {
        'login': 'Qwerty1',
        'password': 'Password1',
        'age': 21,
        'isDeleted': false
    },
    {
        'login': 'User2',
        'password': 'Password1',
        'age': 66,
        'isDeleted': false
    },
    {
        'login': 'Qwerty2',
        'password': 'Password1',
        'age': 21,
        'isDeleted': false
    },
    {
        'login': 'User3',
        'password': 'Password1',
        'age': 29,
        'isDeleted': false
    },
    {
        'login': 'Qwerty3',
        'password': 'Password1',
        'age': 16,
        'isDeleted': false
    }
];

const populateUsers = async () => {
    await sequelize.authenticate();
    await User.sync({ force: true });
    await User.bulkCreate(defaultData);
};

populateUsers().then(() => {
    Logger.info('Table with users was created and populated');
}).catch(err => Logger.error(err));
