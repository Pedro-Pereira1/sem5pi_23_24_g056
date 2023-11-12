import { NextFunction, Request, Response } from "express";

export default interface IListAllRoomsInBuildingController{
    listAllRoomsInBuilding(req: Request, res: Response, next: NextFunction)
}