import { NextFunction, Request, Response } from "express";

export default interface IDeleteFloorService {
    deleteFloor(req: Request, res: Response, next: NextFunction)
}