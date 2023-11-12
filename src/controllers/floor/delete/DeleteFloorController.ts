import { Inject, Service } from "typedi";
import config from "../../../../config";
import IDeleteFloorController from "../../IControllers/floor/delete/IDeleteFLoorController";
import { Result } from "../../../core/logic/Result";
import { NextFunction, Request, Response } from "express";
import IDeleteFloorService from "../../../services/IServices/floor/delete/IDeleteFloorService";
import { parse } from "path";

@Service()
export default class DeleteFloorController implements IDeleteFloorController {

    constructor(
        @Inject(config.services.deleteFloor.name) private deleteFloorService: IDeleteFloorService
    ) { }

    public async deleteFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id.toString();

            const result = await this.deleteFloorService.deleteFloor(parseInt(id));

            if (result.isFailure) {
                res.status(400).send(result.errorValue());
            }

            res.status(200).json(result.getValue());

            return result;
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}