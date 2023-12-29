import { Request, Response, NextFunction } from "express";
import IListAllRobotsByAvailableTasksController from "../../IControllers/robot/list/IListAllRobotsByAvailableTasksController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IListAllRobotsByAvailableTasksService from "../../../services/IServices/robot/list/IListAllRobotsByAvailableTasksService";
import IListRobotsByAvailableTasksDTO from "../../../dto/robot/IListRobotsByAvailableTasksDTO";
import IListAllRobotsByDesignationController from "../../IControllers/robot/list/IListAllRobotsByDesignationController";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IListRobotsByDesignationService from "../../../services/IServices/robot/list/IListRobotsByDesignationService";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class listRobotsByDesignationController implements IListAllRobotsByDesignationController {

    constructor(
        @Inject(config.services.listRobotsByDesignation.name) private service: IListRobotsByDesignationService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ){}

    public async listAllRobotsByDesignation(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        const robot = await this.service.listRobotsByDesignation(req.body as string)

        if (robot.isFailure) {
            res.status(404).send()
        }

        return res.status(200).json(robot)
    }

}