import { Request, Response } from "express";

export default interface ICreateBuildingController{
    createBuilding(req: Request, res: Response)
}