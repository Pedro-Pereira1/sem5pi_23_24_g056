import { NextFunction, Request, Response } from "express";
import ICreateElevatorController from "../../IControllers/elevator/create/ICreateElevatorController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { Result } from "../../../core/logic/Result";
import ICreateElevatorService from "../../../services/IServices/elevator/ICreateElevatorService";
import ICreateElevatorDTO from "../../../dto/elevator/ICreateElevatorDTO";

@Service()
export default class CreateElevatorController implements ICreateElevatorController {

    constructor(
        @Inject(config.services.createElevator.name) private service: ICreateElevatorService
    )
    {}

    public async createElevator(req: Request, res: Response, next: NextFunction) {
        try {
            const ElevatorOrError = await this.service.createElevator(req.body as ICreateElevatorDTO) as Result<IElevatorDTO>

            if (ElevatorOrError.isFailure) {
                return res.status(402).send
            }

            const ElevatorDTO = ElevatorOrError.getValue();
            return res.json(ElevatorDTO).status(201);

        }catch (e){
            return next(e);
        }
    }
}
