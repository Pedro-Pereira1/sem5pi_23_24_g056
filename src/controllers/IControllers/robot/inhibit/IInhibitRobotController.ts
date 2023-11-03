import { NextFunction, Request, Response } from "express";

export default interface IInhibitRobotController {
    createRobot(req: Request, res: Response, next: NextFunction)
}