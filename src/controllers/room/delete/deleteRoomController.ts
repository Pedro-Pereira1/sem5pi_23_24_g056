import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IDeleteRoomController from "../../IControllers/room/delete/IDeleteRoomController";
import IDeleteRoomService from "../../../services/IServices/room/IDeleteRoomService";

@Service()
export default class DeleteRoomController implements IDeleteRoomController {

    constructor(
        @Inject(config.services.deleteRoom.name) private service: IDeleteRoomService
    )
    {}

    public async deleteRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const roomId = String(req.params.roomName);
            const deletedOrError = await this.service.deleteRoom(roomId)

            if (deletedOrError.isFailure) {
                return res.status(400).send(deletedOrError.errorValue())
            }

            const content = deletedOrError.getValue();
            return res.json(content).status(200);

        }catch (e){
            return next(e);
        }
    }
}
