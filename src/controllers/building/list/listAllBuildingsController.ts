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

    public async listAllBuildings(req: Request, res: Response, next: NextFunction) {
        try {
            const buildings = await this.listAllBuildingsService.listAllBuildings()

            if(buildings.isFailure) {
                return res.status(404).send()
            }

            return res.json(buildings).status(200)
        } catch(err) {
            throw err
        }
    }


}