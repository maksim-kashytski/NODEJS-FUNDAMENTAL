import { sequelize } from '../data-access/database.connection';
import { DataTypes } from 'sequelize';
import { GroupInstance, permissions } from '../types/group.interface';

export const Group = sequelize.define<GroupInstance>('Group', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlphanumeric: true
        }
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.ENUM({
            values: permissions
        })),
        allowNull: false
    }
}, {
    freezeTableName: true
});
