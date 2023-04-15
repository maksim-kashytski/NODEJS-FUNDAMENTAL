import { GroupAttributes, GroupCreationAttributes, GroupInstance } from '../types/group.interface';
import { Group } from '../models/group.model-definition';
import { UserGroup}  from '../models/user-group.model-definition';
import { sequelize } from '../data-access/database.connection';

/**
 * This class describes Group Service and contains operations that
 * can be applied to users
 */
export class GroupsService {

    /**
     * This method describes logic of getting group by id
     * @param id string
     */
    public async getGroupById(id: string): Promise<GroupInstance | null> {
        return Group.findByPk(id);
    }

    /**
     * This method describes logic of getting all groups
     */
    public async getAllGroups(): Promise<GroupInstance[]> {
        return Group.findAll({
            order: [['name', 'ASC']],
        })
    }

    /**
     * This method describes logic of adding group to DB
     * @param newGroup GroupCreationAttributes
     */
    public async addGroup(newGroup: GroupCreationAttributes): Promise<GroupInstance> {
        return Group.create(newGroup);
    }

    /**
     * This method describes logic of updating group
     * @param targetGroup GroupInstance
     * @param group Partial<GroupAttributes>
     */
    public async updateGroup(targetGroup: GroupInstance, group: Partial<GroupAttributes>): Promise<void> {
        await Group.update({...group}, {where: {id: targetGroup.id}});
    }

    /**
     * This method describes logic of deleting group
     * @param targetGroup GroupInstance
     */
    public async deleteGroup(targetGroup: GroupInstance): Promise<void> {
        await targetGroup.destroy();
    }

    /**
     * This method describes logic of adding users to group. Transactions are used
     * @param groupId number
     * @param userIds array of numbers
     */
    public async addUsersToGroup(groupId: number, userIds: number[]): Promise<void> {
        const t = await sequelize.transaction();

        try {
            await UserGroup.destroy({ where: { groupId: groupId }, transaction: t});
            const userGroupRelations = userIds.map(userId => ({userId: userId, groupId: groupId}));
            await UserGroup.bulkCreate(userGroupRelations, {transaction: t});
            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
