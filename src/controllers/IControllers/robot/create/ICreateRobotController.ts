import { NextFunction, Request, Response } from "express";

export default interface ICreateRobotController{
    createRobot(req: Request, res: Response, next: NextFunction)
}