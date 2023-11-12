import { NextFunction, Request, Response } from "express";

export default interface IRobotController{
    deleteRobot(req: Request, res: Response, next: NextFunction)
}