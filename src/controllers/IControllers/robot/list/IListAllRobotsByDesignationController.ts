import { NextFunction, Request, Response } from "express";

export default interface IListAllRobotsByDesignationController {
    listAllRobotsByDesignation(req: Request, res: Response, next: NextFunction)
}