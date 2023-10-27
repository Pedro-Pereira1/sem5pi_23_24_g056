import { Inject, Service } from "typedi";
import IListAllFloorsController from "../../IControllers/floor/list/IListAllFloorsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListAllFloorsService from "../../../services/IServices/floor/list/IListAllFloorsService";
import { IListAllFloorsDTO } from "../../../dto/floor/IListAllFloorsDTO";

@Service()
export default class ListAllFloorsController implements IListAllFloorsController {

    constructor(
        @Inject(config.services.listAllFloors.name) private listAllFloorsService: IListAllFloorsService
    )
    {}

    public async listAllFloors(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingID = req.params.buildingId.toString();

            const floors = await this.listAllFloorsService.listAllFloors(buildingID)

            if(floors.isFailure) {
                return res.status(404).send()
            }

            return res.json(floors).status(200)
        } catch(err) {
            throw err
        }
    }


}