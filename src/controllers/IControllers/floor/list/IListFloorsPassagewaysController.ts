import {NextFunction, Request, Response} from "express";

export default interface IListFloorsPassagewaysController {
    listFloorsPassageways(req: Request, res: Response, next: NextFunction)
}