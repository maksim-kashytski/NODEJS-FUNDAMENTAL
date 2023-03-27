import express, { Request, Response, Router, } from 'express';
import { createValidator } from 'express-joi-validation';
import asyncHandler from 'express-async-handler';
import { UserService } from '../services/user.service';
import { checkRefreshToken, generateAccessToken, generateRefreshToken } from '../tokens';
import { authBodySchema } from '../validators/auth.schema';

export const routerAuth: Router = express.Router();

const validator = createValidator();
const userService: UserService = new UserService();

routerAuth.post(
    '/auth',
    validator.body(authBodySchema),
    asyncHandler(async (req: any, res: any) => {
        try {
            const user = await userService.login(req.body.login, req.body.password);

            if (user) {
                return res.status(200).json(user);
            }

            return res.status(403).json({
                message: 'Access forbidden',
                error: 'Incorrect credentials'
            });
        } catch (err) {
            return res.status(500).json({
                message: 'Something is wrong',
                error: (err as Error).message
            });
        }
    }
));

routerAuth.post('/refresh-token', checkRefreshToken, asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.payload;
    res.status(200).json({
        'access-token': generateAccessToken(user),
        'refresh-token': generateRefreshToken(user)
    });
}));
