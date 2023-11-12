import { NextFunction, Request, Response } from "express";

export default interface IDeleteElevatorController{
    deleteElevator(req: Request, res: Response, next: NextFunction)
}