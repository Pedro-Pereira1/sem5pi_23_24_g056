import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import ICreateRobotController from "../../IControllers/robot/create/ICreateRobotController";
import { ICreateRobotDTO } from "../../../dto/robot/ICreateRobotDTO";
import ICreateRobotService from "../../../services/IServices/robot/create/ICreateRobotService";
import { IRobotDTO } from "../../../dto/robot/IRobotDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";


@Service()
export default class createRobotController implements ICreateRobotController {
    
    constructor(
        @Inject(config.services.createRobot.name) private service: ICreateRobotService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ) 
    {}

    public async createRobot(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["FleetManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const robotOrError = await this.service.createRobot(req.body as ICreateRobotDTO) as Result<IRobotDTO>
        
            if (robotOrError.isFailure) {
                return res.status(400).send(robotOrError.errorValue())
            }
        
            const robotDTO = robotOrError.getValue();
            return res.status(201).json(robotDTO);

        }catch (e){
            return next(e);
        }
    }
}