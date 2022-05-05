import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);
  
  return res
    .status(404)
    .send({ status: 404, message: 'Route Not Found', success: false });
};