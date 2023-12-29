import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import ICreateRoomController from "../../IControllers/room/create/ICreateRoomController";
import IRoomDTO from "../../../dto/room/IRoomDTO";
import ICreateRoomService from "../../../services/IServices/room/ICreateRoomService";
import ICreateRoomDTO from "../../../dto/room/ICreateRoomDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class CreateRoomController implements ICreateRoomController {

    constructor(
        @Inject(config.services.createRoom.name) private service: ICreateRoomService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async createRoom(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const roomOrError = await this.service.createRoom(req.body as ICreateRoomDTO) as Result<IRoomDTO>

            if (roomOrError.isFailure) {
                return res.status(400).send(roomOrError.errorValue())
            }

            const roomDTO = roomOrError.getValue();
            return res.json(roomDTO).status(201);

        }catch (e){
            return next(e);
        }
    }
}
