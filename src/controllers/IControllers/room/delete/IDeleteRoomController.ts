import { NextFunction, Request, Response } from "express";

export default interface IDeleteRoomController{
    deleteRoom(req: Request, res: Response, next: NextFunction)
}