import express, { Request, Response, Router } from 'express';
import { GroupsService } from '../services/group.service';
import asyncHandler from 'express-async-handler';
import { GroupInstance } from '../types/group.interface';
import { createValidator } from 'express-joi-validation';
import { forbiddenId, groupNotExist, requiredFields, userWasAdded } from '../constants/group.constants';
import { addUsersToGroupBodySchema } from '../validators/group.schema';

export const routerGroups: Router = express.Router();

const validator = createValidator({ passError: true });
const groupsService: GroupsService = new GroupsService();

/**
 * GET method for groups
 */
routerGroups.get('/', asyncHandler(async (req: Request, res: Response) => {
    const data: GroupInstance[] = await groupsService.getAllGroups();
    res.status(200).json(data);
}));

/**
 * GET method for certain groupID
 */
routerGroups.get('/:groupId', asyncHandler(async (req: Request, res: Response) => {
    const data = await groupsService.getGroupById(req.params.groupId);
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json(requiredFields);
    }
}));

/**
 * POST method for groups
 */
routerGroups.post('/', asyncHandler(async (req: Request, res: Response) => {
    const data = await groupsService.addGroup(req.body);
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json(requiredFields);
    }
}));

/**
 * POST method for adding users to group
 */
routerGroups.post('/:groupId/add-users', validator.body(addUsersToGroupBodySchema), asyncHandler(async (req: Request, res: Response) => {
    if (req.params.groupId && req.body.userIds) {
        await groupsService.addUsersToGroup(parseInt(req.params.groupId, 10), req.body.userIds);
        res.status(200).json(userWasAdded);
    } else {
        res.status(400).json(requiredFields);
    }
}));

/**
 * PUT method for updating group
 */
routerGroups.put('/:groupId', asyncHandler(async (req: Request, res: Response) => {
    const targetGroup = await groupsService.getGroupById(req.params.groupId);
    const flag = (req.body.id === targetGroup?.id) || (!req.body.id);

    if (targetGroup && flag) {
        targetGroup.id = req.body.id;
        await groupsService.updateGroup(targetGroup, req.body);
        const data = await groupsService.getGroupById(req.params.groupId);
        res.status(200).json(data);
    } else if (flag) {
        res.status(400).json(groupNotExist);
    } else {
        res.status(400).json(forbiddenId);
    }
}));

/**
 * DELETE method for deleting certain group
 */
routerGroups.delete('/:groupId', asyncHandler(async (req: Request, res: Response) => {
    const targetGroup = await groupsService.getGroupById(req.params.groupId);

    if (targetGroup) {
        await groupsService.deleteGroup(targetGroup);
        await groupsService.getGroupById(req.params.groupId);
        res.status(200).json(targetGroup);
    } else {
        res.status(400).json(groupNotExist);
    }
}));
