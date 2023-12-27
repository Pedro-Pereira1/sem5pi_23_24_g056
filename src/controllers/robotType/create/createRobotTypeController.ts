import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import ICreateRobotTypeController from "../../IControllers/robotType/create/ICreateRobotTypeController";
import ICreateRobotTypeService from "../../../services/IServices/robotType/create/ICreateRobotTypeService";
import { ICreateRobotTypeDTO } from "../../../dto/robotType/ICreateRobotTypeDTO";
import { IRobotTypeDTO } from "../../../dto/robotType/IRobotTypeDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class createRobotTypeController implements ICreateRobotTypeController {
    
    constructor(
        @Inject(config.services.createRobotType.name) private service: ICreateRobotTypeService,
        @Inject(config.services.auth.name) private authService: IAuthService

    ) 
    {}

    public async createRobotType(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["FleetManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const robotOrError = await this.service.createRobotType(req.body as ICreateRobotTypeDTO) as Result<IRobotTypeDTO>
        
            if (robotOrError.isFailure) {
                return res.status(400).send(robotOrError.errorValue())
            }
        
            const robotTypeDTO = robotOrError.getValue();
            return res.status(201).json(robotTypeDTO);

        }catch (e){
            return next(e);
        }
    }
}