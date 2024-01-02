import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IListAllRoomsService from "../../../services/IServices/room/IListAllRoomsService";
import IListAllRoomsInBuildingController from "../../IControllers/room/list/IListAllRoomsInBuildingController";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListAllRoomsInBuildingController implements IListAllRoomsInBuildingController {

    constructor(
        @Inject(config.services.listAllRoomsInBuilding.name) private service: IListAllRoomsService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listAllRoomsInBuilding(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager", "TaskManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const buildingCode = String(req.params.buildingCode);
            const rooms = await this.service.listAllRoomsInBuilding(buildingCode)

            if (rooms.isFailure) {
                return res.status(400).send(rooms.errorValue())
            }

            return res.status(200).json(rooms.getValue());

        }catch (e){
            return next(e);
        }
    }

    public async listAllRooms(req: Request, res: Response, next: NextFunction) {

        try {
            const rooms = await this.service.listAllRooms()

            if (rooms.isFailure) {
                return res.status(400).send(rooms.errorValue())
            }

            return res.status(200).json(rooms.getValue());

        }catch (e){
            return next(e);
        }
    }
}