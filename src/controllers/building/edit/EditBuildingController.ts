import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IEditBuildingontroller from "../../IControllers/building/edit/IEditBuildingController";
import { Service, Inject } from "typedi";
import config from "../../../../config";
import IEditBuildingService from "../../../services/IServices/building/IEditBuildingService";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";

@Service()
export default class EditBuildingController implements IEditBuildingontroller {
    
    constructor(
        @Inject(config.services.editBuilding.name) private editBuildingService: IEditBuildingService
    ){}

    public async editBuilding(req: Request, res: Response, next: NextFunction) {
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