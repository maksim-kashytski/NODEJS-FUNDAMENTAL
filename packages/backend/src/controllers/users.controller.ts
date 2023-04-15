import express, { Request, Response, Router } from 'express';
import { createValidator } from 'express-joi-validation';
import asyncHandler from 'express-async-handler';
import { UserService } from '../services/user.service';
import { UserInstance } from '../types/user.interface';
import { forbiddenId, userExists, userNotExist } from '../constants/user.constants';
import { getUsersQuerySchema } from '../validators/user.query-schema';

export const routerUsers: Router = express.Router();

const validator = createValidator({ passError: true });
const userService: UserService = new UserService();

/**
 * GET HTTP request. First param describes url path,
 * second param - callback function, that shows users. Also it can show us users by login substring
 */
routerUsers.get('/', validator.query(getUsersQuerySchema), asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : undefined;
    let data: UserInstance[];
    if (req.query.loginSubstring) {
        data = await userService.getAutoSuggestUsers(req.query.loginSubstring.toString().toLowerCase(), limit);
    } else {
        data = await userService.getAllUsers(limit);
    }
    res.status(200).json(data);
}));

/**
 * POST HTTP request. First param describes url path,
 * second param - callback function, that allow us to add users
 */
routerUsers.post('/', asyncHandler(async (req: Request, res: Response) => {
    const login = await userService.getAutoSuggestUsers(req.body.login.toLowerCase());
    if (!login.length) {
        const data = await userService.addUser(req.body);
        res.status(200).json(data);
    } else {
        res.status(400).json(userExists);
    }
}));

/**
 * GET HTTP request. First param describes url path,
 * second param - callback function, that allow us to get user by id.
 */
routerUsers.get('/:userId', asyncHandler(async (req: Request, res: Response) => {
    const data: UserInstance | null = await userService.getUserById(req.params.userId);

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json(userNotExist);
    }
}));

/**
 * PUT HTTP request. First param describes url path,
 * second param - callback function, that allow us to update user by id. All fields are
 * optional
 */
routerUsers.put('/:userId',  asyncHandler(async (req: Request, res: Response) => {
    const user: UserInstance | null = await userService.getUserById(req.params.userId);
    const flag = (req.body.id === user?.id) || (!req.body.id);

    if (user && flag) {
        user.id = req.body.id;
        await userService.updateUser(user, req.body);
        const data = await userService.getUserById(req.params.userId);
        res.status(200).json(data);
    } else if (flag) {
        res.status(400).json(userNotExist);
    } else {
        res.status(400).json(forbiddenId);
    }
}));

/**
 * DELETE HTTP request. First param describes url path,
 * second param - callback function, that allow us to delete user by id.
 */
routerUsers.delete('/:userId', asyncHandler(async (req: Request, res: Response) => {
    const user: UserInstance | null = await userService.getUserById(req.params.userId);

    if (user) {
        const data = await userService.getUserById(req.params.userId);
        await userService.deleteUser(req.params.userId);
        res.status(204).json(data);
    } else {
        res.status(400).json(userNotExist);
    }
}));

/**
 * GET method for getting certain group for certain user
 */
routerUsers.get('/:userId/with-group', asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.getUserWithGroup(req.params.userId);
    res.status(200).json(data);
}));
