import { DataTypes } from 'sequelize';
import { sequelize } from '../data-access/database.connection';
import { UserInstance }  from '../types/user.interface';

export const User = sequelize.define<UserInstance>('User', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlphanumeric: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /\S*(\S*([a-zA-Z]\S*[0-9])|([0-9]\S*[a-zA-Z]))\S*/
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 4,
            max: 130
        }
    },
    isDeleted: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    freezeTableName: true
});
