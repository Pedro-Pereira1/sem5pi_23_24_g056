import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import IListElevatorsInBuildingController from "../../IControllers/elevator/list/IListElevatorsInBuildingController";
import IListElevatorsInBuildingService from "../../../services/IServices/elevator/list/IListElevatorsInBuildingService";

@Service()
export default class ListElevatorsInBuildingController implements IListElevatorsInBuildingController {

    constructor(
        @Inject(config.services.listElevatorsInBuilding.name) private listElevatorsInBuilding: IListElevatorsInBuildingService
    )
    {}

    public async listElevatorsInBuildingFloors(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingCode = String(req.params.buildingCode);
            const elevators = await this.listElevatorsInBuilding.listElevatorsInBuilding(buildingCode)

            if(elevators.isFailure) {
                return res.status(400).send(elevators.errorValue())
            }

            return res.status(200).json(elevators.getValue())
        } catch(err) {
            throw err
        }
    }


}