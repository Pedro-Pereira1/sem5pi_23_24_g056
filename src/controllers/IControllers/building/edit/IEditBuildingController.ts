import { NextFunction, Request, Response } from "express";

export default interface IEditBuildingontroller {
    createBuilding(req: Request, res: Response, next: NextFunction)
}