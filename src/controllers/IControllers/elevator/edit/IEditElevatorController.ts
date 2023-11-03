import { NextFunction, Request, Response } from "express";

export default interface IEditElevatorController{
    editElevator(req: Request, res: Response, next: NextFunction)
}