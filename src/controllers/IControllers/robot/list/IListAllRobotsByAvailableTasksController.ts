import { NextFunction, Request, Response } from "express";

export default interface IListAllRobotsByAvailableTasksController {
    listAllRobotsByAvailableTask(req: Request, res: Response, next: NextFunction)
}