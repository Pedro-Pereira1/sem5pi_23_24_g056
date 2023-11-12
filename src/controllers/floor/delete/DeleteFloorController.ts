import { Inject, Service } from "typedi";
import config from "../../../../config";
import IDeleteFloorController from "../../IControllers/floor/delete/IDeleteFLoorController";
import { Result } from "../../../core/logic/Result";
import { NextFunction, Request, Response } from "express";
import IDeleteFloorService from "../../../services/IServices/floor/delete/IDeleteFloorService";

@Service()
export default class DeleteFloorController implements IDeleteFloorController {

    constructor(
        @Inject(config.services.deleteFloor.name) private deleteFloorService: IDeleteFloorService
    ) {}


    public async deleteFloor(req: Request, res: Response, next: NextFunction): Promise<Result<string>> {
        try {
            const result = await this.deleteFloorService.deleteFloor(req.body.id as number);

            if (result.isFailure) {
                res.status(400).send();
            }

            res.status(200).json(result.getValue());

            return result;
        } catch (error) {
            return Result.fail<string>('Floor not deleted');
        }
    }
}