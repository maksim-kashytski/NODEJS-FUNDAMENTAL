import express, { NextFunction } from 'express';
import { Request, Response, Router } from 'express';
import { createValidator } from 'express-joi-validation';
import { UserService } from '../services/user.service';
import { forbiddenId, userExists, userNotExist } from '../constants/user.constants';
import { createUserSchema, updateUserSchema, getUsersQuerySchema } from '../models/user/schema';
import { IUser } from '../models/user/user.types';

export const routerUsers: Router = express.Router();

const validator = createValidator({ passError: true });
const userService: UserService = new UserService();

/**
 * GET HTTP request. First param describes url path, second param is validator,
 * third param - callback function, that shows users. Also it can show us users by login substring
 */
routerUsers.get('/', validator.query(getUsersQuerySchema), (req: Request, res: Response) => {
    let users: Array<IUser>;

    if (req.query.loginSubstring) {
        users = userService.getAutoSuggestUsers(req.query.loginSubstring.toString().toLowerCase());
    } else {
        users = userService.getAllUsers();
    }

    if (req.query.limit) {
        users = users.splice(0, parseInt(req.query.limit.toString(), 10));
    }

    res.status(200).json(users);
});

/**
 * POST HTTP request. First param describes url path, second param is validator,
 * third param - callback function, that allow us to add users
 */
routerUsers.post('/', validator.body(createUserSchema), (req: Request, res: Response) => {
    const login = userService.getAutoSuggestUsers(req.body.login.toLowerCase());
    if (!login.length) {
        const user: IUser = userService.addUser(req.body);
        res.status(200).json(user);
    } else {
        res.status(400).json(userExists);
    }
});

/**
 * GET HTTP request. First param describes url path, second param is validator,
 * third param - callback function, that allow us to get user by id.
 */
routerUsers.get('/:userId', (req: Request, res: Response) => {
    const user: IUser | undefined = userService.getUserById(req.params.userId);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json(userNotExist);
    }
});

/**
 * PUT HTTP request. First param describes url path, second param is validator,
 * third param - callback function, that allow us to update user by id. All fields are
 * optional
 */
routerUsers.put('/:userId', validator.body(updateUserSchema), (req: Request, res: Response) => {
    const user: IUser | undefined = userService.getUserById(req.params.userId);
    const flag = req.body.id === user?.id;

    if (user && flag) {
        userService.updateUser(user, req.body);
        res.status(200).json(user);
    } else if (flag) {
        res.status(400).json(userNotExist);
    } else {
        res.status(400).json(forbiddenId);
    }
});

/**
 * DELETE HTTP request. First param describes url path,
 * second param - callback function, that allow us to delete user by id.
 */
routerUsers.delete('/:userId', (req: Request, res: Response) => {
    const user: IUser | undefined = userService.getUserById(req.params.userId);

    if (user) {
        userService.deleteUser(user);
        res.status(204).json();
    } else {
        res.status(400).json(userNotExist);
    }
});

/**
 * This is express validation
 */
routerUsers.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            type: err.type,
            message: err.error.toString()
        });
    } else {
        return next(err);
    }
});
