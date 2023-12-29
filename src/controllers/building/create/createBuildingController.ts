import { NextFunction, Request, Response } from "express";
import ICreateBuildingController from "../../IControllers/building/createBuilding/ICreateBuildingController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import ICreateBuildingService from "../../../services/IServices/building/ICreateBuildingService";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { Result } from "../../../core/logic/Result";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class CreateBuildingController implements ICreateBuildingController {
    
    constructor(
        @Inject(config.services.createBuilding.name) private service: ICreateBuildingService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ) 
    {}

    public async createBuilding(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }

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