import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IEditBuildingontroller from "../../IControllers/building/edit/IEditBuildingController";
import { Service, Inject } from "typedi";
import config from "../../../../config";
import IEditBuildingService from "../../../services/IServices/building/IEditBuildingService";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class EditBuildingController implements IEditBuildingontroller {
    
    constructor(
        @Inject(config.services.editBuilding.name) private editBuildingService: IEditBuildingService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ){}

    public async editBuilding(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const buildingOrError = await this.editBuildingService.editBuilding(req.body as IBuildingDTO)

            if (buildingOrError.isFailure) {
                return res.status(400).send()
            }

            const buildingDTO = buildingOrError.getValue();
            return res.status(201).json(buildingDTO);
        } catch (err) {
            return next(err)
        }
    }
    
}