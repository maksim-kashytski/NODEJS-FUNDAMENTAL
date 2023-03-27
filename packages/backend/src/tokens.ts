import jwt, { Secret, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserTokenPayload } from './types/user-token-payload.interface';

const ACCESS_TOKEN_SECRET: Secret = 'access-token-secret';
const REFRESH_TOKEN_SECRET: Secret = 'refresh-token-secret';

export const generateAccessToken = (payload: UserTokenPayload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
export const generateRefreshToken = (payload: UserTokenPayload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
};

export const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: any = req.headers.authorization;
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token', token);

    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err: VerifyErrors | null) => {
            if (err) {
                res.status(403).json({ status: 'failed', errors: 'Failed to authenticate token' });
            } else {
                next();
            }
        });
    } else {
        res.status(401).json({ status: 'failed', errors: 'No token provided' });
        res.send();
    }
};

export const checkRefreshToken = (req: Request, res: Response) => {
    const authHeader: any = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, REFRESH_TOKEN_SECRET, (err: VerifyErrors | null, payload: any) => {
            if (err) {
                res.status(403).json({ status: 'failed', errors: 'Failed to authenticate token' });
            } else {
                res.locals.payload = payload;
            }
        });
    } else {
        res.status(401).json({ status: 'failed', errors: 'No token provided' });
        res.send();
    }
};
