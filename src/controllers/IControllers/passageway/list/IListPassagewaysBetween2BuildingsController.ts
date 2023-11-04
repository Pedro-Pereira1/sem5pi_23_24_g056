import { NextFunction, Request, Response } from "express";

export default interface IListPassagewaysBetween2BuildingsController{
    listPassagewaysBetween2Buildings(req: Request, res: Response, next: NextFunction)
}