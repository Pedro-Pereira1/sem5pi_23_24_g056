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
            const buildingId = req.params.buildingId.toString();

            const floorsOrError = await this.listAllFloorsService.listAllFloors(buildingId)

            if(floorsOrError.isFailure) {
                return res.status(400).send(floorsOrError.errorValue())
            }

            return res.status(200).json(floorsOrError.getValue())
        } catch(err) {
            throw err
        }
    }


}
