import { Request, Response } from "express";
import ICreateBuildingController from "../../IControllers/building/createBuilding/ICreateBuildingController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import ICreateBuildingService from "../../../services/IServices/building/ICreateBuildingService";

@Service()
export default class CreateBuildingController implements ICreateBuildingController {
    
    constructor(
        @Inject(config.services.createBuilding.name) private service: ICreateBuildingService
    ) 
    {}

    createBuilding(req: Request, res: Response) {

    }
}