import { Inject, Service } from "typedi";
import IListAllFloorsController from "../../IControllers/floor/list/IListAllFloorsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListAllFloorsService from "../../../services/IServices/floor/list/IListAllFloorsService";
import { IListAllFloorsDTO } from "../../../dto/floor/IListAllFloorsDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListAllFloorsController implements IListAllFloorsController {

    constructor(
        @Inject(config.services.listAllFloors.name) private listAllFloorsService: IListAllFloorsService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listAllFloors(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const buildingId = req.params.buildingId.toString();

            const floorsOrError = await this.listAllFloorsService.listAllFloors(buildingId)

            if(floorsOrError.isFailure) {
                return res.status(400).send(floorsOrError.errorValue())
            }

            return res.status(200).json(floorsOrError.getValue())
        } catch(err) {
            throw err
        }
    }


}
