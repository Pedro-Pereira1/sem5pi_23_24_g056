import { NextFunction, Request, Response } from "express";

export default interface ICreateBuildingController{
    createBuilding(req: Request, res: Response, next: NextFunction)
}