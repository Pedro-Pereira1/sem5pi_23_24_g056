import { Request, Response, NextFunction } from "express";
import IInhibitRobotController from "../../IControllers/robot/inhibit/IInhibitRobotController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IInhibitRobotService from "../../../services/IServices/robot/inhibit/IIhibitRobotService";
import IInhibitRobotDTO from "../../../dto/robot/IInhibitRobotDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class InhibitRobotController implements IInhibitRobotController {
    
    constructor(
        @Inject(config.services.inhibitRobot.name) private inhibitRobotService: IInhibitRobotService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ){}

    public async inhibitRobot(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["FleetManager"])){
            return res.status(401).send("Unauthorized");
        }
        
        const robotDto = await this.inhibitRobotService.inhibitRobot(req.body as IInhibitRobotDTO)

        if (robotDto.isFailure) {
            return res.status(400).send(robotDto.errorValue())
        }

        return res.status(201).json(robotDto.getValue())
    }

}