import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import ICreateRobotController from "../../IControllers/robot/create/ICreateRobotController";
import { ICreateRobotDTO } from "../../../dto/robot/ICreateRobotDTO";
import ICreateRobotService from "../../../services/IServices/robot/create/ICreateRobotService";
import { IRobotDTO } from "../../../dto/robot/IRobotDTO";


@Service()
export default class createRobotController implements ICreateRobotController {
    
    constructor(
        @Inject(config.services.createRobot.name) private service: ICreateRobotService
    ) 
    {}

    public async createRobot(req: Request, res: Response, next: NextFunction) {
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