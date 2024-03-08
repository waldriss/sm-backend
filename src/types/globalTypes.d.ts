export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }




  declare global {
    namespace Express {
      interface Request {
        file: IFile;
      }
    }
  }