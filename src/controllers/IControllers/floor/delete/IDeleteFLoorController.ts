import { NextFunction, Request, Response } from "express";

export default interface IDeleteFloorController {
    deleteFloor(req: Request, res: Response, next: NextFunction)
}