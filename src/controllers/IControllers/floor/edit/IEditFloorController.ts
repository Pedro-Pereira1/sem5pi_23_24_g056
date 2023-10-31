import { Request, Response, NextFunction } from 'express';

export default interface IEditFloorController {
	editFloor(req: Request, res: Response, next: NextFunction);
}