import { Request, Response, NextFunction } from "express";

export default interface IListAllFloorsController {
    listAllFloors(req: Request, res: Response, next: NextFunction)
}