import { Request, Response, NextFunction } from "express";

export default interface IListElevatorsInBuildingController {
    listElevatorsInBuilding(req: Request, res: Response, next: NextFunction)
}