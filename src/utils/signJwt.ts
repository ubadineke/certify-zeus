import jwt from 'jsonwebtoken';
import { ObjectId } from '../types';

export default function signToken(id: ObjectId) {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
}
