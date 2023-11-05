import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IListAllRobotsService from "../../IServices/robot/list/IListAllRobotsService";
import { IRobotDTO } from "../../../dto/robot/IRobotDTO";
import IRobotRepo from "../../IRepos/robot/IRobotRepo";
import { RobotMap } from "../../../mappers/robot/RobotMap";

@Service()
export default class ListAllRobotsService implements IListAllRobotsService {

    constructor(
        @Inject(config.repos.robot.name) private robotRepo: IRobotRepo
    ) { }

    public async listAllRobots(): Promise<Result<IRobotDTO[]>> {
        try{
            const robotsList = await this.robotRepo.findAll()
            
            if (robotsList.length === 0) return Result.fail<IRobotDTO[]>("No Robots found!")

            let resolve: IRobotDTO[] = []

            robotsList.forEach(robot => {
                resolve.push(RobotMap.toDto(robot))
            })

            return Result.ok<IRobotDTO[]>(resolve)

        } catch(e) {
            throw e
        }
    }
}