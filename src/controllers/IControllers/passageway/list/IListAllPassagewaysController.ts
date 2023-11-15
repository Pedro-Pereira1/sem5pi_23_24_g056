import { Request, Response, NextFunction } from "express";

export default interface IListAllPassagewaysController {
    listAllPassageways(req: Request, res: Response, next: NextFunction)
}