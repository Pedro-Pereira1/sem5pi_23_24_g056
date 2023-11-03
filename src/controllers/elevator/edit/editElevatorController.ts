import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { Result } from "../../../core/logic/Result";
import IEditElevatorController from "../../IControllers/elevator/edit/IEditElevatorController";
import IEditElevatorService from "../../../services/IServices/elevator/edit/IEditElevatorService";
import IEditElevatorDTO from "../../../dto/elevator/IEditElevatorDTO";

@Service()
export default class EditElevatorController implements IEditElevatorController {

    constructor(
        @Inject(config.services.editElevator.name) private service: IEditElevatorService
    )
    {}

    public async editElevator(req: Request, res: Response, next: NextFunction) {
        try {
            const elevatorOrError = await this.service.editElevator(req.body as IEditElevatorDTO) as Result<IElevatorDTO>

            if (elevatorOrError.isFailure) {
                return res.status(402).send(elevatorOrError.errorValue())
            }

            const elevatorDTO = elevatorOrError.getValue();
            return res.json(elevatorDTO).status(200);

        }catch (e){
            return next(e);
        }
    }
}
