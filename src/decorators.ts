import { Request, Response, NextFunction } from 'express';

/**
 *
 * @example
 * ```ts
 * @Controller()
 * public static async control(req: Request, res: Response) {
 * 	 // controller logic
 *	 return new ApiResponse(res,"Message");
 * }
 * ```
 */
export function Controller(customErrorHandler?: any) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        await originalMethod(req, res);
      } catch (error) {
        if (customErrorHandler) {
          await customErrorHandler(res);
        }
        next(error);
      }
    };
    return descriptor;
  };
}

/**
 *
 * @example
 * ```ts
 * @Middleware()
 * public static async middleware(req: Request, res: Response, next: NextFunction) {
 * 	 // controller logic
 *	 next()
 * }
 * ```
 */
export function Middleware() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        await originalMethod(req, res, next);
      } catch (error) {
        next(error);
      }
    };
    return descriptor;
  };
}
