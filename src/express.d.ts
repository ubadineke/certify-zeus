import { Express } from 'express';

declare global {
    namespace Express {
        export interface Request {
            user?: any; // Change `User` to your specific user type
        }
    }
}
