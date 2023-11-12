import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IListAllRoomsService from "../../../services/IServices/room/IListAllRoomsService";
import IListAllRoomsInBuildingController from "../../IControllers/room/list/IListAllRoomsInBuildingController";

@Service()
export default class ListAllRoomsInBuildingController implements IListAllRoomsInBuildingController {

    constructor(
        @Inject(config.services.listAllRoomsInBuilding.name) private service: IListAllRoomsService
    )
    {}

    public async listAllRoomsInBuilding(req: Request, res: Response, next: NextFunction) {
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
}