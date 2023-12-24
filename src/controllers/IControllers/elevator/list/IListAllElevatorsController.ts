import { Request, Response, NextFunction } from "express";

export default interface IListAllElevatorsController {
    listAllElevators(req: Request, res: Response, next: NextFunction)
    listFloorsByElevatorId(req: Request, res: Response, next: NextFunction)
}