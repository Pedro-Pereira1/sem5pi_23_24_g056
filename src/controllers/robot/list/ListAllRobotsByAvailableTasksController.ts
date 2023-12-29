import { Request, Response, NextFunction } from "express";
import IListAllRobotsByAvailableTasksController from "../../IControllers/robot/list/IListAllRobotsByAvailableTasksController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IListAllRobotsByAvailableTasksService from "../../../services/IServices/robot/list/IListAllRobotsByAvailableTasksService";
import IListRobotsByAvailableTasksDTO from "../../../dto/robot/IListRobotsByAvailableTasksDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class listAllRobotsByAvailableTaskController implements IListAllRobotsByAvailableTasksController {

    constructor(
        @Inject(config.services.listAllRobotsByAvailableTask.name) private service: IListAllRobotsByAvailableTasksService,
        @Inject(config.services.auth.name) private authService: IAuthService
    ){}

    public async listAllRobotsByAvailableTask(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        const robots = await this.service.listRobotsByAvailableTasks(req.body as IListRobotsByAvailableTasksDTO)

        if (robots.isFailure) {
            res.status(404).send()
        }

        return res.status(200).json(robots)
    }

}