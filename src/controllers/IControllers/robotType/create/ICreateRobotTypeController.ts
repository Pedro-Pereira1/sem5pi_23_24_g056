import { NextFunction, Request, Response } from "express";

export default interface ICreateRobotTypeController{
    createRobotType(req: Request, res: Response, next: NextFunction)
}