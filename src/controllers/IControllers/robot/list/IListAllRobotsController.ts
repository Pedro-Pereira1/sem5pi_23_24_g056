import { NextFunction, Request, Response } from "express";

export default interface IListAllRobotsController{
    listAllRobots(req: Request, res: Response, next: NextFunction)
}