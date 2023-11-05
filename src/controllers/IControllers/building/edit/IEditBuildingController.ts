import { NextFunction, Request, Response } from "express";

export default interface IEditBuildingontroller {
    editBuilding(req: Request, res: Response, next: NextFunction)
}