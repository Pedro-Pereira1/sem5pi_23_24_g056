import {NextFunction, Request, Response} from "express";

export default interface IEditPassagewayController{
    editPassageway(req: Request, res: Response, next: NextFunction)
}