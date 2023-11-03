import { NextFunction, Request, Response } from "express";

export default interface IInhibitRobotController {
    inhibitRobot(req: Request, res: Response, next: NextFunction)
}