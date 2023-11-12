import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import IDeleteElevatorController from "../../IControllers/elevator/delete/IDeleteElevatorController";
import IDeleteElevatorService from "../../../services/IServices/elevator/delete/IDeleteElevatorService";
import IEditElevatorDTO from "../../../dto/elevator/IEditElevatorDTO";

@Service()
export default class DeleteElevatorController implements IDeleteElevatorController {

    constructor(
        @Inject(config.services.deleteElevator.name) private service: IDeleteElevatorService
    )
    {}

    public async deleteElevator(req: Request, res: Response, next: NextFunction) {
        try {
            const elevatorOrError = await this.service.deleteElevator(req.body as IEditElevatorDTO) as Result<boolean>

            if (elevatorOrError.isFailure) {
                return res.status(400).send(elevatorOrError.errorValue())
            }

            return res.status(200).json("Elevator deleted successfully");

        }catch (e){
            return next(e);
        }
    }
}
