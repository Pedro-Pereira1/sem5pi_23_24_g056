import { Inject, Service } from "typedi";
import IListBuildingsMaxMinFloorsController from "../../IControllers/building/list/IListBuildingsMaxMinFloorsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListBuildingsMaxMinFloorsService from "../../../services/IServices/building/IListBuildingsMaxMinFloorsService";
import { IBuildingListMaxMinDTO } from "../../../dto/building/IBuildingListMaxMinDTO";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";

@Service()
export default class ListBuildingsMaxMinFloorsController implements IListBuildingsMaxMinFloorsController {

    constructor(
        @Inject(config.services.listBuildingsMaxMinFloors.name) private listBuildingsMaxMinFloorsService: IListBuildingsMaxMinFloorsService
    )
    {}

    public async listBuildingsMaxMinFloors(req: Request, res: Response, next: NextFunction) {
        try{
            const max = Number(req.params.max);
            const min = Number(req.params.min);

            const buildingsOrError = await this.listBuildingsMaxMinFloorsService.listBuildingsMaxMinFloors(max,min)
            if(buildingsOrError.isFailure){
                return res.status(402).send(buildingsOrError.errorValue())
            }
            res.json(buildingsOrError.getValue()).status(200);
        }catch(error){
            console.error("Error in listBuildingsMaxMinFloors:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


}
