import { NextFunction, Request, Response } from "express";

export default interface ICreateElevatorController{
    createElevator(req: Request, res: Response, next: NextFunction)
}