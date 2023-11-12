import { Inject, Service } from "typedi";
import IListBuildingsMaxMinFloorsController from "../../IControllers/building/list/IListBuildingsMaxMinFloorsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListBuildingsMaxMinFloorsService from "../../../services/IServices/building/IListBuildingsMaxMinFloorsService";
import { IBuildingListMaxMinDTO } from "../../../dto/building/IBuildingListMaxMinDTO";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import IDeleteBuildingController from "../../IControllers/building/delete/IdeleteBuildingController";
import IDeleteBuildingService from "../../../services/IServices/building/IDeleteBuildingService";

@Service()
export default class deleteBuildingController implements IDeleteBuildingController {

    constructor(
        @Inject(config.services.deleteBuilding.name) private deleteBuildingService: IDeleteBuildingService
    )
    {}

    public async deleteBuilding(req: Request, res: Response, next: NextFunction) {
        try{
            const id = req.params.id.toString();

            const buildingsOrError = await this.deleteBuildingService.deleteBuilding(id)

            if(buildingsOrError.isFailure){
                return res.status(400).send(buildingsOrError.errorValue())
            }

            res.status(200).json(buildingsOrError.getValue());
        }catch(error){
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


}
