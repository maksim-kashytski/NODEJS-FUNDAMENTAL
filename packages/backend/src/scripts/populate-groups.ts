import { sequelize } from '../data-access/database.connection';
import { Group } from '../models/group.model-definition';
import { GroupCreationAttributes } from '../types/group.interface';
import { Logger } from '../config';

const defaultData: Array<GroupCreationAttributes> = [
    { 'name': 'Admins', 'permissions': ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'] },
    { 'name': 'Managers', 'permissions': ['READ', 'WRITE', 'SHARE', 'UPLOAD_FILES'] },
    { 'name': 'Customers', 'permissions': ['READ', 'SHARE', 'UPLOAD_FILES'] },
    { 'name': 'Users', 'permissions': ['READ', 'SHARE', 'UPLOAD_FILES'] },
    { 'name': 'Readonly', 'permissions': ['READ'] },
    { 'name': 'Students', 'permissions': ['READ', 'SHARE', 'UPLOAD_FILES'] },
    { 'name': 'Employees', 'permissions': ['READ', 'WRITE'] },
    { 'name': 'Moderators', 'permissions': ['READ', 'DELETE'] }
];

const populateGroups = async () => {
    await sequelize.authenticate();
    await Group.sync({ force: true });
    await Group.bulkCreate(defaultData);
};

populateGroups().then(() => {
    Logger.info('Table with groups was created and populated');
}).catch(err => Logger.error(err));
