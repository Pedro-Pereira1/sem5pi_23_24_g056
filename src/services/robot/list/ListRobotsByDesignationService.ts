import { Service, Inject } from "typedi"
import { Result } from "../../../core/logic/Result"
import { Robot } from "../../../domain/Robot/Robot"
import { AvailableTask } from "../../../domain/RobotType/AvailableTask"
import IListRobotsByAvailableTasksDTO from "../../../dto/robot/IListRobotsByAvailableTasksDTO"
import { IRobotDTO } from "../../../dto/robot/IRobotDTO"
import { RobotMap } from "../../../mappers/robot/RobotMap"
import IRobotRepo from "../../IRepos/robot/IRobotRepo"
import config from "../../../../config"
import IListRobotsByDesignationService from '../../IServices/robot/list/IListRobotsByDesignationService'

@Service()
export default class ListAllRobotsByAvailableTasksService implements IListRobotsByDesignationService {

    constructor(
        @Inject(config.repos.robot.name) private robotRepo: IRobotRepo
    ) { }

    public async listRobotsByDesignation(nickname: string): Promise<Result<IRobotDTO>> {
        const result: Robot = await this.robotRepo.findByNickname(nickname)

        if (result === null) {
            return Result.fail<IRobotDTO>('There are no robots with that designation')
        }

        return Result.ok<IRobotDTO>(RobotMap.toDto(result))
    }


}