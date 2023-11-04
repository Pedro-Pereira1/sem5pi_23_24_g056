import { Request, Response, NextFunction } from "express";

export default interface IListElevatorsInBuildingController {
    listElevatorsInBuildingFloors(req: Request, res: Response, next: NextFunction)
}