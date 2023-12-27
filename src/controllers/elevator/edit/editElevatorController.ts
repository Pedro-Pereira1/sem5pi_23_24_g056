import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { Result } from "../../../core/logic/Result";
import IEditElevatorController from "../../IControllers/elevator/edit/IEditElevatorController";
import IEditElevatorService from "../../../services/IServices/elevator/edit/IEditElevatorService";
import IEditElevatorDTO from "../../../dto/elevator/IEditElevatorDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class EditElevatorController implements IEditElevatorController {

    constructor(
        @Inject(config.services.editElevator.name) private service: IEditElevatorService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async editElevator(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const elevatorOrError = await this.service.editElevator(req.body as IEditElevatorDTO) as Result<IElevatorDTO>

            if (elevatorOrError.isFailure) {
                return res.status(400).send(elevatorOrError.errorValue())
            }

            const elevatorDTO = elevatorOrError.getValue();
            return res.status(201).json(elevatorDTO);

        }catch (e){
            return next(e);
        }
    }
}
