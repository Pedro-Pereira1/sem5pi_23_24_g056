import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IDeleteRoomController from "../../IControllers/room/delete/IDeleteRoomController";
import IDeleteRoomService from "../../../services/IServices/room/IDeleteRoomService";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class DeleteRoomController implements IDeleteRoomController {

    constructor(
        @Inject(config.services.deleteRoom.name) private service: IDeleteRoomService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async deleteRoom(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
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
