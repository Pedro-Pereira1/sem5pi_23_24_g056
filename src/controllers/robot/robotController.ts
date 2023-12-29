import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";

import IRobotTypeController from "../IControllers/robotType/IRobotTypeController";
import IDeleteRobotTypeService from "../../services/IServices/robotType/delete/IDeleteRobotTypeService";
import IListAllRobotTypeService from "../../services/IServices/robotType/list/IListAllRobotTypeService";
import IRobotController from "../IControllers/robot/IRobotController";
import IDeleteRobotService from "../../services/IServices/robot/delete/IDeleteRobotService";
import { IAuthService } from "../../services/IServices/auth/IAuthService";

@Service()
export default class robotController implements IRobotController {
    
    constructor(
        @Inject(config.services.deleteRobot.name) private deleteRobotService: IDeleteRobotService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ) 
    {}

    public async deleteRobot(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        try{
            const id = req.params.id.toString();

            const robotTypeOrError = await this.deleteRobotService.deleteRobot(id)

            if(robotTypeOrError.isFailure){
                return res.status(400).send(robotTypeOrError.errorValue())
            }

            res.status(200).json(robotTypeOrError.getValue());
        }catch(error){
            res.status(500).json({ error: "Internal Server Error" });
        }
        
    }
}