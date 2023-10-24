import { Request, Response, NextFunction } from "express";

export default interface IListAllBuildingsController {
    listAllBuildings(req: Request, res: Response, next: NextFunction)
}