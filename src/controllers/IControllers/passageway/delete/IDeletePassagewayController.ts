import { NextFunction, Request, Response } from "express";

export default interface IDeletePassagewayController {
    deletePassageway(req: Request, res: Response, next : NextFunction)
}