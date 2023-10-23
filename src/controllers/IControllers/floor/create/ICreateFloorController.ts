import { NextFunction, Request, Response } from "express";

export default interface ICreateFloorController{
    createFloor(req: Request, res: Response, next: NextFunction)
}