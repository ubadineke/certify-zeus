import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware } from '../decorators';
import Manufacturer from '../models/user.model';
import signToken from '../utils/signJwt';
import { promisify } from 'util';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default class Auth {
  @Controller()
  public static async signup(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const user = await Manufacturer.create({ name, email, password });
    const token = signToken(user._id);
    user.password = '';
    res.status(201).json({ message: 'Signup successful', token, user });
  }

  @Controller()
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }
    const user = await Manufacturer.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    const token = signToken(user.id);
    res.status(200).json({ message: 'Login successful', token });
  }

  // public static async protect(req: Request, res: Response) {}\
  @Middleware()
  public static async protect(req: Request, res: Response, next: NextFunction) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json('You are not logged in. Please log in to gain access!');
      // return next(new AppError('You are not logged in. Please log in to gain access!', 401));
    }

    //2) Verifying token
    const verifyJwt = promisify(jwt.verify) as (
      token: string,
      secretOrPublicKey: jwt.Secret,
      options?: jwt.VerifyOptions
    ) => Promise<JwtPayload>;

    const decoded: any = await verifyJwt(token, process.env.JWT_SECRET as string).catch((err) => {
      return res.status(401).json('Invalid token, Please log in again!');
      // return next(new AppError('Invalid token, Please log in again!', 401));
    });

    // //3) Check if user still exists
    const currentUser = await Manufacturer.findById(decoded.id);
    if (!currentUser) {
      return res
        .status(401)
        .json("The user belonging to this token does not exist/you're not permitted to accesss this feature");
      //     // return next(new AppError('The user belonging to this token does not exist', 401));
    }
    // // //store user details
    req.user = currentUser;
    next();
  }

  @Controller()
  public static async getUserInfo(req: Request, res: Response) {
    let user = req.user;
    if (!user) return res.status(404).json('No user info, try logging in');
    res.status(200).json(user);
  }
}
