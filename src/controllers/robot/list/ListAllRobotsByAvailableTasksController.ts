import { Request, Response, NextFunction } from "express";
import IListAllRobotsByAvailableTasksController from "../../IControllers/robot/list/IListAllRobotsByAvailableTasksController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IListAllRobotsByAvailableTasksService from "../../../services/IServices/robot/list/IListAllRobotsByAvailableTasksService";
import IListRobotsByAvailableTasksDTO from "../../../dto/robot/IListRobotsByAvailableTasksDTO";

@Service()
export default class listAllRobotsByAvailableTaskController implements IListAllRobotsByAvailableTasksController {

    constructor(
        @Inject(config.services.listAllRobotsByAvailableTask.name) private service: IListAllRobotsByAvailableTasksService
    ){}

    public async listAllRobotsByAvailableTask(req: Request, res: Response, next: NextFunction) {
        const robots = await this.service.listRobotsByAvailableTasks(req.body as IListRobotsByAvailableTasksDTO)

        if (robots.isFailure) {
            res.status(404).send()
        }

        return res.status(200).json(robots)
    }

}