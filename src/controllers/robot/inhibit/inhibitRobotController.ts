import { Request, Response, NextFunction } from "express";
import IInhibitRobotController from "../../IControllers/robot/inhibit/IInhibitRobotController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IInhibitRobotService from "../../../services/IServices/robot/inhibit/IIhibitRobotService";
import IInhibitRobotDTO from "../../../dto/robot/IInhibitRobotDTO";

@Service()
export default class InhibitRobotController implements IInhibitRobotController {
    
    constructor(
        @Inject(config.services.inhibitRobot.name) private inhibitRobotService: IInhibitRobotService
    ){}

    public async inhibitRobot(req: Request, res: Response, next: NextFunction) {
        const robotDto = await this.inhibitRobotService.inhibitRobot(req.body as IInhibitRobotDTO)

        if (robotDto.isFailure) {
            return res.status(400).send(robotDto.errorValue())
        }

        return res.status(201).json(robotDto.getValue())
    }

}