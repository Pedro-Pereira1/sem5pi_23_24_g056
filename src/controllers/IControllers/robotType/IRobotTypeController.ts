import { NextFunction, Request, Response } from "express";

export default interface IRobotTypeController{
    listAllRobotTypes(req: Request, res: Response, next: NextFunction)
    deleteRobotType(req: Request, res: Response, next: NextFunction)
}