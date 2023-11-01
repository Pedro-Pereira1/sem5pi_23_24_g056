import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import ICreateRoomController from "../../IControllers/room/create/ICreateRoomController";
import IRoomDTO from "../../../dto/room/IRoomDTO";
import ICreateRoomService from "../../../services/IServices/room/ICreateRoomService";
import ICreateRoomDTO from "../../../dto/room/ICreateRoomDTO";

@Service()
export default class CreateRoomController implements ICreateRoomController {

    constructor(
        @Inject(config.services.createRoom.name) private service: ICreateRoomService
    )
    {}

    public async createRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const roomOrError = await this.service.createRoom(req.body as ICreateRoomDTO) as Result<IRoomDTO>

            if (roomOrError.isFailure) {
                return res.status(402).send(roomOrError.errorValue())
            }

            const roomDTO = roomOrError.getValue();
            return res.json(roomDTO).status(201);

        }catch (e){
            return next(e);
        }
    }
}
