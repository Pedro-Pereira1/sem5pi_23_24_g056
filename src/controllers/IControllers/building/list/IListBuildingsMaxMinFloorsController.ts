import { Request, Response, NextFunction } from "express";

export default interface IListBuildingsMaxMinFloorsController {
    listBuildingsMaxMinFloors(req: Request, res: Response, next: NextFunction)
}