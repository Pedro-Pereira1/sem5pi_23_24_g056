import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import IListElevatorsInBuildingController from "../../IControllers/elevator/list/IListElevatorsInBuildingController";
import IListElevatorsInBuildingService from "../../../services/IServices/elevator/list/IListElevatorsInBuildingService";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListElevatorsInBuildingController implements IListElevatorsInBuildingController {

    constructor(
        @Inject(config.services.listElevatorsInBuilding.name) private listElevatorsInBuildingService: IListElevatorsInBuildingService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listElevatorsInBuilding(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const buildingCode = String(req.params.buildingCode);
            const elevators = await this.listElevatorsInBuildingService.listElevatorsInBuilding(buildingCode)

            if(elevators.isFailure) {
                return res.status(400).send(elevators.errorValue())
            }

            return res.status(200).json(elevators.getValue())
        } catch(err) {
            throw err
        }
    }


}