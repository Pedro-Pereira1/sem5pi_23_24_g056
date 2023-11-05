import { Inject, Service } from "typedi";
import IListAllBuildingsController from "../../IControllers/building/list/IListAllBUildingsController";
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import IListAllRobotsService from "../../../services/IServices/robot/list/IListAllRobotsService";

@Service()
export default class ListAllRobotsController implements IListAllBuildingsController {

    constructor(
        @Inject(config.services.listAllRobots.name) private listAllRobotsService: IListAllRobotsService
    )
    {}

    public async listAllBuildings(req: Request, res: Response, next: NextFunction) {
        try {
            const robots = await this.listAllRobotsService.listAllRobots()

            if(robots.isFailure) {
                return res.status(400).send(robots.errorValue())
            }

            return res.status(200).json(robots.getValue())
        } catch(err) {
            throw err
        }
    }


}