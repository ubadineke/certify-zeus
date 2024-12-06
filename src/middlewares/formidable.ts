import formidable from 'express-formidable';
import { Request, Response, NextFunction } from 'express';

//Allow for upload of a single image only with a max size of 1MB
export const uploadSingle = formidable({
  maxFileSize: 1 * 4096 * 4096,
  multiples: false,
});

// export const uploadSingle = (req: Request, res: Response, next: NextFunction) => {
//     const form = formidable({
//         maxFileSize: 1 * 1024 * 1024, // 1MB max file size
//         multiples: false, // Single file upload
//     });
//     // next();
// };

export const uploadMultiple = formidable({
  maxFileSize: 1 * 4096 * 4096,
  multiples: true,
});
