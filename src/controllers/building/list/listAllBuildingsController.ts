import { Inject, Service } from "typedi";
import IListAllBuildingsController from "../../IControllers/building/list/IListAllBUildingsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListAllBuildingsService from "../../../services/IServices/building/IListAllBuildingsService";

@Service()
export default class ListAllBuildingsController implements IListAllBuildingsController {

    constructor(
        @Inject(config.services.listAllBuildins.name) private listAllBuildingsService: IListAllBuildingsService
    )
    {}

    listAllBuildings(req: Request, res: Response, next: NextFunction) {
        throw new Error("Method not implemented.");
    }


}