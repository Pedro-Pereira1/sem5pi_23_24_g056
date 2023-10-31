import { NextFunction, Request, Response } from "express";
import ICreateFloorController from "../../IControllers/floor/create/ICreateFloorController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import ICreateFloorService from "../../../services/IServices/floor/create/ICreateFloorService";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { ICreateFloorDTO } from "../../../dto/floor/ICreateFloorDTO";

@Service()
export default class CreateFloorController implements ICreateFloorController {

    constructor(
        @Inject(config.services.createFloor.name) private service: ICreateFloorService
    )
    {}

    public async createFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const FloorOrError = await this.service.createFloor(req.body as ICreateFloorDTO) as Result<IFloorDTO>

            if (FloorOrError.isFailure) {
                return res.status(402).send
            }

            const FloorDTO = FloorOrError.getValue();
            return res.json(FloorDTO).status(201);

        }catch (e){
            return next(e);
        }
    }
}
