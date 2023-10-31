import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import { Result } from "../../../core/logic/Result";
import ICreateRobotTypeController from "../../IControllers/robotType/create/ICreateRobotTypeController";
import ICreateRobotTypeService from "../../../services/IServices/robotType/create/ICreateRobotTypeService";
import { ICreateRobotTypeDTO } from "../../../dto/robotType/ICreateRobotTypeDTO";
import { IRobotTypeDTO } from "../../../dto/robotType/IRobotTypeDTO";

@Service()
export default class createRobotTypeController implements ICreateRobotTypeController {
    
    constructor(
        @Inject(config.services.createRobotType.name) private service: ICreateRobotTypeService
    ) 
    {}

    public async createRobotType(req: Request, res: Response, next: NextFunction) {
        try {
            const robotOrError = await this.service.createRobotType(req.body as ICreateRobotTypeDTO) as Result<IRobotTypeDTO>
        
            if (robotOrError.isFailure) {
                return res.status(402).send(robotOrError.errorValue())
            }
        
            const robotTypeDTO = robotOrError.getValue();
            return res.json(robotTypeDTO).status(201);

        }catch (e){
            return next(e);
        }
    }
}