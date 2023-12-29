import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import IDeleteElevatorController from "../../IControllers/elevator/delete/IDeleteElevatorController";
import IDeleteElevatorService from "../../../services/IServices/elevator/delete/IDeleteElevatorService";
import IEditElevatorDTO from "../../../dto/elevator/IEditElevatorDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class DeleteElevatorController implements IDeleteElevatorController {

    constructor(
        @Inject(config.services.deleteElevator.name) private service: IDeleteElevatorService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async deleteElevator(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
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
