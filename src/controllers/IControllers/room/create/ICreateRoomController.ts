import { NextFunction, Request, Response } from "express";

export default interface ICreateRoomController{
    createRoom(req: Request, res: Response, next: NextFunction)
}