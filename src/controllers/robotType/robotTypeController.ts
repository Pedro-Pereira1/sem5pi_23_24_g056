import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";

import IRobotTypeController from "../IControllers/robotType/IRobotTypeController";
import IDeleteRobotTypeService from "../../services/IServices/robotType/delete/IDeleteRobotTypeService";
import IListAllRobotTypeService from "../../services/IServices/robotType/list/IListAllRobotTypeService";
import { IAuthService } from "../../services/IServices/auth/IAuthService";

@Service()
export default class robotTypeController implements IRobotTypeController {
    
    constructor(
        @Inject(config.services.listAllRobotType.name) private listAllRobotTypeService: IListAllRobotTypeService,
        @Inject(config.services.deleteRobotType.name) private deleteRobotTypeService: IDeleteRobotTypeService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ) 
    {}

    public async deleteRobotType(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        try{
            const id = req.params.id.toString();

            const robotTypeOrError = await this.deleteRobotTypeService.deleteRobotType(id)

            if(robotTypeOrError.isFailure){
                return res.status(400).send(robotTypeOrError.errorValue())
            }

            res.status(200).json(robotTypeOrError.getValue());
        }catch(error){
            res.status(500).json({ error: "Internal Server Error" });
        }
        
    }

    public async listAllRobotTypes(req: Request, res: Response, next: NextFunction) {
        try {
            const robotTypes = await this.listAllRobotTypeService.listAllRobotTypes()

            if(robotTypes.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(robotTypes.getValue())
        } catch(err) {
            throw err
        }
    }
}