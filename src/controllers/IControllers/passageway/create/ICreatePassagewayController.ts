import { NextFunction, Request, Response } from "express";

export default interface ICreatePassagewayController{
    createPassageway(req: Request, res: Response, next: NextFunction)
}