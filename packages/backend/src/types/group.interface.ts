import { Model, Optional } from 'sequelize';

const tuple = <T extends string>(...args: Array<T>) => args;
export const permissions = tuple('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES');
type Permission = typeof permissions[number];

export interface GroupAttributes {
    id: number;
    name: string;
    permissions: Array<Permission>;
}

export interface GroupCreationAttributes extends Optional<GroupAttributes, 'id'> {}

export interface GroupInstance extends Model<GroupAttributes, GroupCreationAttributes>, GroupAttributes {}
