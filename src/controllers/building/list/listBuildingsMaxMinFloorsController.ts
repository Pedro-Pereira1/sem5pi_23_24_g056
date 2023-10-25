import { Inject, Service } from "typedi";
import IListBuildingsMaxMinFloorsController from "../../IControllers/building/list/IListBuildingsMaxMinFloorsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListBuildingsMaxMinFloorsService from "../../../services/IServices/building/IListBuildingsMaxMinFloorsService";

@Service()
export default class ListBuildingsMaxMinFloorsController implements IListBuildingsMaxMinFloorsController {

    constructor(
        @Inject(config.services.listBuildingsMaxMinFloors.name) private listAllBuildingsService: IListBuildingsMaxMinFloorsService
    )
    {}

    listBuildingsMaxMinFloors(req: Request, res: Response, next: NextFunction) {
        try{
            const buildings = this.listAllBuildingsService.listBuildingsMaxMinFloors
            res.status(200).json(buildings);
        }catch(error){
            console.error("Error in listBuildingsMaxMinFloors:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


}