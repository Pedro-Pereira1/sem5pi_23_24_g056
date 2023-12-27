import { NextFunction, Request, Response } from "express";
import ICreateElevatorController from "../../IControllers/elevator/create/ICreateElevatorController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { Result } from "../../../core/logic/Result";
import ICreateElevatorService from "../../../services/IServices/elevator/ICreateElevatorService";
import ICreateElevatorDTO from "../../../dto/elevator/ICreateElevatorDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class CreateElevatorController implements ICreateElevatorController {

    constructor(
        @Inject(config.services.createElevator.name) private service: ICreateElevatorService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async createElevator(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        
        try {
            const elevatorOrError = await this.service.createElevator(req.body as ICreateElevatorDTO) as Result<IElevatorDTO>

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
