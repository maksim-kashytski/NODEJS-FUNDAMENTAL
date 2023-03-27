import { Model } from 'sequelize';

export interface UserGroupInterface extends Model {
    userId: number;
    groupId: number;
}
