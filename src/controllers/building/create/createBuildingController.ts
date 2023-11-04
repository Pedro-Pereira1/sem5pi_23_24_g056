import { NextFunction, Request, Response } from "express";
import ICreateBuildingController from "../../IControllers/building/createBuilding/ICreateBuildingController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import ICreateBuildingService from "../../../services/IServices/building/ICreateBuildingService";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { Result } from "../../../core/logic/Result";

@Service()
export default class CreateBuildingController implements ICreateBuildingController {
    
    constructor(
        @Inject(config.services.createBuilding.name) private service: ICreateBuildingService
    ) 
    {}

    public async createBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingOrError = await this.service.createBuilding(req.body as IBuildingDTO) as Result<IBuildingDTO>
        
            if (buildingOrError.isFailure) {
                return res.status(400).send(buildingOrError.errorValue())
            }
        
            const buildingDTO = buildingOrError.getValue();
            return res.status(201).json(buildingDTO);

        }catch (e){
            return next(e);
        }
    }
}