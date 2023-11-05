import { Request, Response, NextFunction } from "express";

export default interface ILoadFloorMapController {
    loadFloorMap(req: Request, res: Response, next: NextFunction)
}