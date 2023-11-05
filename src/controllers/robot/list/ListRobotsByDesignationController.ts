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

@Service()
export default class listRobotsByDesignationController implements IListAllRobotsByDesignationController {

    constructor(
        @Inject(config.services.listRobotsByDesignation.name) private service: IListRobotsByDesignationService
    ){}

    public async listAllRobotsByDesignation(req: Request, res: Response, next: NextFunction) {
        const robot = await this.service.listRobotsByDesignation(req.body as string)

        if (robot.isFailure) {
            res.status(404).send()
        }

        return res.status(200).json(robot)
    }

}